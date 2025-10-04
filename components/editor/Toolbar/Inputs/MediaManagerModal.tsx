import { ROOT_NODE, useEditor } from "@craftjs/core";
import { GetSignedUrl, SaveMedia } from "components/editor/Viewport/lib";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { TbEdit, TbPhoto, TbPlus, TbRefresh, TbSearch, TbTrash, TbUpload, TbX } from "react-icons/tb";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const settings = useRecoilValue(SettingsAtom);

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

  const openEditModal = (media: any) => {
    setEditingMedia({
      ...media,
      metadata: {
        alt: media.metadata?.alt || "",
        title: media.metadata?.title || "",
        description: media.metadata?.description || "",
      },
    });
  };

  const saveEditedMetadata = () => {
    if (!editingMedia) return;

    updateMediaMetadata(query, actions, editingMedia.id, editingMedia.metadata);
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

            // Optionally update filename in metadata
            if (mediaItem.metadata) {
              mediaItem.metadata.title = file.name;
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

  useEffect(() => {
    if (isOpen) {
      refreshMediaList();
      setSearchQuery("");
      setSelectedMedia(null);
      setEditingMedia(null);
    }
  }, [isOpen, refreshMediaList]);

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
          <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
            {/* Search */}
            <div className="flex-1 relative">
              <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search media by name, alt text, or description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Upload Button - always visible */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleUpload(e.target.files)}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-400 transition-colors"
            >
              <TbUpload />
              {uploading ? "Uploading..." : "Upload"}
            </button>

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
                      Click the Upload button to add images
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
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
                      <img
                        key={`${media.id}-${media.uploadedAt || 0}`}
                        src={`${getCdnUrl(media.cdnId || media.id)}?v=${media.uploadedAt || Date.now()}`}
                        alt={media.metadata?.alt || media.id}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide image if load fails
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Name/Title */}
                    <div className="p-2 bg-white">
                      <p className="text-xs truncate text-gray-700 font-medium">
                        {media.metadata?.title || media.id}
                      </p>
                    </div>

                    {/* Action Buttons (on hover) - hide in selection mode */}
                    {!selectionMode && (
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
                    )}

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
                  <img
                    key={`${editingMedia.id}-${editingMedia.uploadedAt || 0}`}
                    src={`${getCdnUrl(editingMedia.cdnId || editingMedia.id)}?v=${editingMedia.uploadedAt || Date.now()}`}
                    alt={editingMedia.metadata?.alt || "Preview"}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-mono text-gray-600">{editingMedia.id}</p>
                  </div>
                </div>

                {/* Form Fields */}
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

