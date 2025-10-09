import { ROOT_NODE, useEditor } from "@craftjs/core";
import { GetSignedUrl, SaveMedia } from "components/editor/Viewport/lib";
import { Tooltip } from "components/layout/Tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { TbCode, TbEdit, TbExternalLink, TbPhoto, TbPlus, TbRefresh, TbSearch, TbTrash, TbUpload, TbX } from "react-icons/tb";
import { useRecoilValue } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { getCdnUrl } from "utils/cdn";
import { getPageMedia, registerMediaWithBackground, updateMediaMetadata } from "utils/lib";

interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (mediaId: string) => void; // Optional: if provided, enables selection mode
  selectionMode?: boolean; // If true, shows "Select" button on items
}

export const MediaManagerModal = ({ isOpen, onClose, onSelect, selectionMode = false }: MediaManagerModalProps) => {
  const { query, actions } = useEditor();
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [editingMedia, setEditingMedia] = useState<any | null>(null);
  const [replacingMedia, setReplacingMedia] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [addMode, setAddMode] = useState<"upload" | "url" | "svg">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [svgInput, setSvgInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const settings = useRecoilValue(SettingsAtom);

  // Format file size in human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const refreshMediaList = useCallback(() => {
    const media = getPageMedia(query);
    setMediaList(media);
    setFilteredMedia(media);
  }, [query]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredMedia(mediaList);
      return;
    }

    const filtered = mediaList.filter((media) => {
      const searchLower = query.toLowerCase();
      return (
        media.id.toLowerCase().includes(searchLower) ||
        media.metadata?.title?.toLowerCase().includes(searchLower) ||
        media.metadata?.alt?.toLowerCase().includes(searchLower) ||
        media.metadata?.description?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredMedia(filtered);
  };


  const handleDelete = (mediaId: string) => {
    if (!confirm("Are you sure you want to delete this media item? This cannot be undone.")) {
      return;
    }

    actions.setProp(ROOT_NODE, (props: any) => {
      if (!props.pageMedia) return;
      props.pageMedia = props.pageMedia.filter((m: any) => m.id !== mediaId);
    });

    refreshMediaList();
    setSelectedMedia(null);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedIds: string[] = [];

    try {
      // Get signed URL for CDN upload
      const geturl = await GetSignedUrl();
      const signedURL = geturl?.result?.uploadURL;

      if (!signedURL) {
        console.error("Failed to get upload URL");
        setUploading(false);
        return;
      }

      // Upload each file to CDN
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          // Upload to CDN and get UUID
          const res = await SaveMedia(file, signedURL);

          if (res?.result?.id) {
            const mediaId = res.result.id; // This is the UUID from CDN
            uploadedIds.push(mediaId);

            // Register with page media
            registerMediaWithBackground(query, actions, mediaId, "cdn", "media-manager");

            // Also add metadata
            actions.setProp(ROOT_NODE, (props: any) => {
              props.pageMedia = props.pageMedia || [];
              const existingMedia = props.pageMedia.find((m: any) => m.id === mediaId);

              if (existingMedia) {
                // Update existing entry with metadata
                existingMedia.metadata = {
                  ...existingMedia.metadata,
                  title: file.name,
                  alt: file.name.replace(/\.[^/.]+$/, ""), // filename without extension
                  size: file.size, // Store file size in bytes
                };
              }
            });
          }
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
        }
      }

      refreshMediaList();

      // Show success message
      if (uploadedIds.length > 0) {
        console.log(`✅ Uploaded ${uploadedIds.length} file(s) to CDN`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const cleanSvg = (svg: string): string => {
    let cleaned = svg.trim();

    // Remove XML declaration
    cleaned = cleaned.replace(/<\?xml[^?]*\?>/gi, '');

    // Remove DOCTYPE
    cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');

    // Remove comments
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

    // Extract only the SVG tag and its contents
    const svgMatch = cleaned.match(/<svg[\s\S]*<\/svg>/i);
    if (svgMatch) {
      cleaned = svgMatch[0];
    }

    // Remove width and height attributes from SVG tag
    cleaned = cleaned.replace(/\s*(width|height)\s*=\s*["'][^"']*["']/gi, '');

    // Replace black fills with currentColor to make SVG themeable
    // Handle various black color formats
    cleaned = cleaned.replace(/fill\s*=\s*["']#000000["']/gi, 'fill="currentColor"');
    cleaned = cleaned.replace(/fill\s*=\s*["']#000["']/gi, 'fill="currentColor"');
    cleaned = cleaned.replace(/fill\s*=\s*["']black["']/gi, 'fill="currentColor"');
    cleaned = cleaned.replace(/fill\s*=\s*["']rgb\(0,\s*0,\s*0\)["']/gi, 'fill="currentColor"');
    cleaned = cleaned.replace(/fill\s*=\s*["']rgba\(0,\s*0,\s*0,\s*1\)["']/gi, 'fill="currentColor"');

    // Trim extra whitespace
    cleaned = cleaned.trim();

    return cleaned;
  };

  const openEditModal = (media: any) => {
    setEditingMedia({
      ...media,
      metadata: {
        alt: media.metadata?.alt || "",
        title: media.metadata?.title || "",
        description: media.metadata?.description || "",
        url: media.metadata?.url || "",
        svg: media.metadata?.svg || "",
      },
    });
  };

  const saveEditedMetadata = () => {
    if (!editingMedia) return;

    // Clean SVG if it's an SVG type and recalculate size
    const metadata = { ...editingMedia.metadata };
    if (editingMedia.type === "svg" && metadata.svg) {
      const cleanedSvg = cleanSvg(metadata.svg);
      metadata.svg = cleanedSvg;
      metadata.size = new Blob([cleanedSvg]).size; // Recalculate size
    }

    updateMediaMetadata(query, actions, editingMedia.id, metadata);
    setEditingMedia(null);
    refreshMediaList();
  };

  const handleReplaceMedia = async (files: FileList | null) => {
    if (!files || files.length === 0 || !replacingMedia) return;

    setUploading(true);

    try {
      const file = files[0]; // Only take first file

      // Get signed URL for CDN upload
      const geturl = await GetSignedUrl();
      const signedURL = geturl?.result?.uploadURL;

      if (!signedURL) {
        console.error("Failed to get upload URL");
        setUploading(false);
        return;
      }

      // Upload to CDN - this will overwrite the existing file if using same ID
      // Or we can get a new ID and update the reference
      const res = await SaveMedia(file, signedURL);

      if (res?.result?.id) {
        const newCdnId = res.result.id;

        // Update the media entry to point to the new CDN file
        actions.setProp("ROOT", (props: any) => {
          if (!props.pageMedia) return;

          const mediaItem = props.pageMedia.find((m: any) => m.id === replacingMedia);
          if (mediaItem) {
            // Keep the same media library ID but update to point to new CDN file
            mediaItem.cdnId = newCdnId;
            mediaItem.uploadedAt = Date.now();

            // Update filename and size in metadata
            if (mediaItem.metadata) {
              mediaItem.metadata.title = file.name;
              mediaItem.metadata.size = file.size; // Update file size
            }
          }
        });

        refreshMediaList();
        setReplacingMedia(null);
        console.log(`✅ Replaced media ${replacingMedia} with new file`);
      }
    } catch (error) {
      console.error("Replace failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;

    const mediaId = `url-${Date.now()}`;
    registerMediaWithBackground(query, actions, mediaId, "url", "media-manager");

    // Add metadata with the actual URL
    actions.setProp(ROOT_NODE, (props: any) => {
      props.pageMedia = props.pageMedia || [];
      const existingMedia = props.pageMedia.find((m: any) => m.id === mediaId);

      if (existingMedia) {
        existingMedia.metadata = {
          ...existingMedia.metadata,
          title: urlInput.split('/').pop() || urlInput,
          url: urlInput,
        };
      }
    });

    refreshMediaList();
    setUrlInput("");
    setAddMode("upload");
    console.log(`✅ Added URL media: ${urlInput}`);
  };

  const handleAddSvg = () => {
    if (!svgInput.trim()) return;

    const cleanedSvg = cleanSvg(svgInput);
    const svgSize = new Blob([cleanedSvg]).size; // Get byte size of SVG

    const mediaId = `svg-${Date.now()}`;
    registerMediaWithBackground(query, actions, mediaId, "svg", "media-manager");

    // Add metadata with the SVG content
    actions.setProp(ROOT_NODE, (props: any) => {
      props.pageMedia = props.pageMedia || [];
      const existingMedia = props.pageMedia.find((m: any) => m.id === mediaId);

      if (existingMedia) {
        existingMedia.metadata = {
          ...existingMedia.metadata,
          title: "SVG Image",
          svg: cleanedSvg,
          size: svgSize, // Store SVG size in bytes
        };
      }
    });

    refreshMediaList();
    setSvgInput("");
    setAddMode("upload");
    console.log(`✅ Added SVG media`);
  };

  useEffect(() => {
    if (isOpen) {
      refreshMediaList();
      setSearchQuery("");
      setSelectedMedia(null);
      setEditingMedia(null);
    }
  }, [isOpen, refreshMediaList]);

  // Close add mode inputs when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        if (addMode === "url" || addMode === "svg") {
          setAddMode("upload");
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, addMode]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] bg-white"
        style={{ margin: "20px", borderRadius: "12px", overflow: "hidden" }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center gap-4">
              <TbPhoto className="text-3xl text-primary-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectionMode ? "Select Media" : "Media Manager"}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectionMode
                    ? "Click an image to select it"
                    : `${filteredMedia.length} ${filteredMedia.length === 1 ? "item" : "items"}${searchQuery ? ` (filtered from ${mediaList.length})` : ""}`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl p-2 hover:bg-gray-200 rounded-lg"
              title="Close"
            >
              <TbX />
            </button>
          </div>

          {/* Toolbar */}
          <div ref={toolbarRef} className="px-6 py-3 border-b bg-white">
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="flex-1 relative">
                <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search media..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              {/* Add Mode Selector - compact pills */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Tooltip content="Upload files" placement="bottom">
                  <button
                    onClick={() => {
                      setAddMode("upload");
                      if (addMode === "upload") fileInputRef.current?.click();
                    }}
                    disabled={uploading}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${addMode === "upload"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    <TbUpload className="inline" />
                  </button>
                </Tooltip>
                <Tooltip content="Add from URL" placement="bottom">
                  <button
                    onClick={() => setAddMode("url")}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${addMode === "url"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    <TbExternalLink className="inline" />
                  </button>
                </Tooltip>
                <Tooltip content="Add SVG code" placement="bottom">
                  <button
                    onClick={() => setAddMode("svg")}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${addMode === "svg"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    <TbCode className="inline" />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Inline input for URL/SVG modes */}
            {addMode === "url" && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
                  autoFocus
                />
                <button
                  onClick={handleAddUrl}
                  disabled={!urlInput.trim()}
                  className="px-3 py-1.5 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 disabled:bg-gray-400 transition-colors"
                >
                  Add
                </button>
              </div>
            )}

            {addMode === "svg" && (
              <div className="mt-2">
                <div className="flex gap-2">
                  <textarea
                    value={svgInput}
                    onChange={(e) => setSvgInput(e.target.value)}
                    placeholder="<svg>...</svg>"
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs"
                    rows={3}
                    autoFocus
                  />
                  <button
                    onClick={handleAddSvg}
                    disabled={!svgInput.trim()}
                    className="px-3 py-1.5 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 disabled:bg-gray-400 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 ml-0.5">
                  Find SVGs @{" "}
                  <a
                    href="https://www.svgrepo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    svgrepo.com
                  </a>
                </p>
              </div>
            )}

            {uploading && (
              <div className="mt-2 text-sm text-gray-500">Uploading...</div>
            )}

            {/* Hidden file input for upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleUpload(e.target.files)}
              className="hidden"
            />

            {/* Hidden file input for replace */}
            <input
              ref={replaceInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleReplaceMedia(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Content Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {filteredMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <TbPhoto className="text-8xl text-gray-300 mb-4" />
                {searchQuery ? (
                  <>
                    <p className="text-gray-500 text-lg mb-2">No media found</p>
                    <p className="text-sm text-gray-400">
                      Try a different search term
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-lg mb-2">No media uploaded yet</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Upload files, add URLs, or paste SVG code
                    </p>
                    <button
                      onClick={() => {
                        setAddMode("upload");
                        fileInputRef.current?.click();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                    >
                      <TbPlus />
                      Upload Your First Image
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {filteredMedia.map((media) => (
                  <div
                    key={media.id}
                    className={`group relative bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${selectedMedia === media.id
                      ? "border-primary-500 shadow-lg"
                      : "border-gray-200 hover:border-primary-300 hover:shadow-md"
                      }`}
                    onClick={() => {
                      if (selectionMode && onSelect) {
                        onSelect(media.id);
                      } else {
                        setSelectedMedia(media.id);
                      }
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                      {media.type === "url" ? (
                        <img
                          key={`${media.id}-${media.uploadedAt || 0}`}
                          src={media.metadata?.url}
                          alt={media.metadata?.alt || media.id}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : media.type === "svg" ? (
                        <div
                          className="w-full h-full p-2"
                          dangerouslySetInnerHTML={{ __html: media.metadata?.svg || "" }}
                        />
                      ) : (
                        <img
                          key={`${media.id}-${media.uploadedAt || 0}`}
                          src={getCdnUrl(media.cdnId || media.id, { width: 400, format: 'auto' })}
                          alt={media.metadata?.alt || media.id}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </div>

                    {/* Name/Title and Size */}
                    <div className="p-2 bg-white">
                      <p className="text-xs truncate text-gray-700 font-medium">
                        {media.metadata?.title || media.id}
                      </p>
                      {media.metadata?.size && (
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {formatFileSize(media.metadata.size)}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons (on hover) */}
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReplacingMedia(media.id);
                          replaceInputRef.current?.click();
                        }}
                        className="p-1.5 bg-white rounded-md shadow-lg hover:bg-blue-50 text-blue-600"
                        title="Replace image"
                      >
                        <TbRefresh className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(media);
                        }}
                        className="p-1.5 bg-white rounded-md shadow-lg hover:bg-primary-50 text-primary-600"
                        title="Edit metadata"
                      >
                        <TbEdit className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(media.id);
                        }}
                        className="p-1.5 bg-white rounded-md shadow-lg hover:bg-red-50 text-red-600"
                        title="Delete"
                      >
                        <TbTrash className="text-sm" />
                      </button>
                    </div>

                    {/* Metadata indicator */}
                    {(media.metadata?.alt || media.metadata?.description) && (
                      <div className="absolute bottom-10 left-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Metadata Modal */}
        {editingMedia && (
          <div
            className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setEditingMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">Edit Media</h3>
                <button
                  onClick={() => setEditingMedia(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  <TbX />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Preview */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  {editingMedia.type === "url" ? (
                    <img
                      src={editingMedia.metadata?.url}
                      alt={editingMedia.metadata?.alt || "Preview"}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ) : editingMedia.type === "svg" ? (
                    <div
                      className="w-24 h-24 flex items-center justify-center rounded border border-gray-200"
                      dangerouslySetInnerHTML={{ __html: editingMedia.metadata?.svg || "" }}
                    />
                  ) : (
                    <img
                      key={`${editingMedia.id}-${editingMedia.uploadedAt || 0}`}
                      src={getCdnUrl(editingMedia.cdnId || editingMedia.id, { width: 200, format: 'auto' })}
                      alt={editingMedia.metadata?.alt || "Preview"}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-mono text-gray-600">{editingMedia.id}</p>
                    <p className="text-xs text-gray-500 mt-1">Type: {editingMedia.type || "cdn"}</p>
                    {editingMedia.metadata?.size && (
                      <p className="text-xs text-gray-500 mt-1">Size: {formatFileSize(editingMedia.metadata.size)}</p>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                {/* URL field for URL type - show first */}
                {editingMedia.type === "url" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingMedia.metadata.url || ""}
                      onChange={(e) =>
                        setEditingMedia({
                          ...editingMedia,
                          metadata: { ...editingMedia.metadata, url: e.target.value },
                        })
                      }
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {/* SVG field for SVG type - show first */}
                {editingMedia.type === "svg" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SVG Code <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={editingMedia.metadata.svg || ""}
                      onChange={(e) =>
                        setEditingMedia({
                          ...editingMedia,
                          metadata: { ...editingMedia.metadata, svg: e.target.value },
                        })
                      }
                      placeholder="<svg>...</svg>"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                      rows={6}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={editingMedia.metadata.title}
                    onChange={(e) =>
                      setEditingMedia({
                        ...editingMedia,
                        metadata: { ...editingMedia.metadata, title: e.target.value },
                      })
                    }
                    placeholder="Enter file name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingMedia.metadata.alt}
                    onChange={(e) =>
                      setEditingMedia({
                        ...editingMedia,
                        metadata: { ...editingMedia.metadata, alt: e.target.value },
                      })
                    }
                    placeholder="Describe the image for accessibility"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Important for accessibility and SEO
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingMedia.metadata.description}
                    onChange={(e) =>
                      setEditingMedia({
                        ...editingMedia,
                        metadata: { ...editingMedia.metadata, description: e.target.value },
                      })
                    }
                    placeholder="Additional details about this media"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <button
                  onClick={() => setEditingMedia(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedMetadata}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  <TbEdit />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

