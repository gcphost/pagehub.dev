import { ROOT_NODE, useEditor } from "@craftjs/core";
import { GetSignedUrl, SaveMedia } from "components/editor/Viewport/lib";
import { Tooltip } from "components/layout/Tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { TbClipboard, TbCode, TbEdit, TbExternalLink, TbLayoutGrid, TbList, TbPhoto, TbPlus, TbRefresh, TbSearch, TbTrash, TbUpload, TbX } from "react-icons/tb";
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
  const [saveUrlToCdn, setSaveUrlToCdn] = useState(false);
  const [hasImageInClipboard, setHasImageInClipboard] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    currentFile: string;
    completedFiles: string[];
  } | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const settings = useRecoilValue(SettingsAtom);

  // Handle drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    console.log(`Dropped ${files.length} files:`, Array.from(files).map(f => f.name));
    if (files && files.length > 0) {
      handleUpload(files);
    }
  };

  // Handle paste events for images (keyboard shortcut)
  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();

        const file = item.getAsFile();
        if (!file) continue;

        setUploading(true);
        setUploadProgress({
          current: 0,
          total: 1,
          currentFile: file.name || 'Pasted image',
          completedFiles: []
        });

        try {
          // Get signed URL for CDN upload
          const geturl = await GetSignedUrl();
          const signedURL = geturl?.result?.uploadURL;

          if (!signedURL) {
            throw new Error("Failed to get upload URL");
          }

          // Upload to CDN
          const res = await SaveMedia(file, signedURL);
          if (!res?.result?.id) {
            throw new Error("Failed to upload to CDN");
          }

          const mediaId = res.result.id;
          registerMediaWithBackground(query, actions, mediaId, "cdn", "media-manager");

          // Add metadata
          actions.setProp(ROOT_NODE, (props: any) => {
            props.pageMedia = props.pageMedia || [];
            const existingMedia = props.pageMedia.find((m: any) => m.id === mediaId);

            if (existingMedia) {
              existingMedia.metadata = {
                ...existingMedia.metadata,
                title: file.name || "Pasted Image",
                alt: file.name?.replace(/\.[^/.]+$/, "") || "Pasted Image",
                size: file.size,
                source: "paste",
              };
            }
          });

          refreshMediaList();
          console.log(`✅ Pasted and uploaded image: ${file.name || 'unnamed'}`);
        } catch (error) {
          console.error("Failed to upload pasted image:", error);
          alert(`Failed to upload pasted image: ${error.message}`);
        } finally {
          setUploading(false);
          setUploadProgress(null);
        }

        break; // Only handle first image
      }
    }
  };

  // Check clipboard for images
  const checkClipboardForImages = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      const hasImage = clipboardItems.some(item =>
        item.types.some(type => type.startsWith('image/'))
      );
      setHasImageInClipboard(hasImage);
    } catch (error) {
      // Fallback: assume no image if clipboard access fails
      setHasImageInClipboard(false);
    }
  };

  // Handle paste button click
  const handlePasteClick = async () => {
    if (!hasImageInClipboard) return;

    try {
      const clipboardItems = await navigator.clipboard.read();

      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], `pasted-image-${Date.now()}.${type.split('/')[1]}`, { type });

            setUploading(true);

            try {
              // Get signed URL for CDN upload
              const geturl = await GetSignedUrl();
              const signedURL = geturl?.result?.uploadURL;

              if (!signedURL) {
                throw new Error("Failed to get upload URL");
              }

              // Upload to CDN
              const res = await SaveMedia(file, signedURL);
              if (!res?.result?.id) {
                throw new Error("Failed to upload to CDN");
              }

              const mediaId = res.result.id;
              registerMediaWithBackground(query, actions, mediaId, "cdn", "media-manager");

              // Add metadata
              actions.setProp(ROOT_NODE, (props: any) => {
                props.pageMedia = props.pageMedia || [];
                const existingMedia = props.pageMedia.find((m: any) => m.id === mediaId);

                if (existingMedia) {
                  existingMedia.metadata = {
                    ...existingMedia.metadata,
                    title: file.name,
                    alt: file.name.replace(/\.[^/.]+$/, ""),
                    size: file.size,
                    source: "paste",
                  };
                }
              });

              refreshMediaList();
              console.log(`✅ Pasted and uploaded image: ${file.name}`);
            } catch (error) {
              console.error("Failed to upload pasted image:", error);
              alert(`Failed to upload pasted image: ${error.message}`);
            } finally {
              setUploading(false);
            }

            return; // Only handle first image
          }
        }
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
      alert("Failed to access clipboard. Please try pasting with Ctrl+V / Cmd+V instead.");
    }
  };

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

    console.log(`Starting upload of ${files.length} files:`, Array.from(files).map(f => f.name));
    setUploading(true);
    setUploadProgress({
      current: 0,
      total: files.length,
      currentFile: '',
      completedFiles: []
    });
    const uploadedIds: string[] = [];

    try {
      // Upload each file to CDN
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Uploading file ${i + 1}/${files.length}: ${file.name}`);

        // Update progress to show current file
        setUploadProgress(prev => prev ? {
          ...prev,
          current: i,
          currentFile: file.name
        } : null);

        try {
          // Get signed URL for each file (in case URLs expire)
          const geturl = await GetSignedUrl();
          const signedURL = geturl?.result?.uploadURL;

          if (!signedURL) {
            console.error(`Failed to get upload URL for ${file.name}`);
            continue; // Skip this file and continue with next
          }

          // Upload to CDN and get UUID
          const res = await SaveMedia(file, signedURL);

          if (res?.result?.id) {
            const mediaId = res.result.id; // This is the UUID from CDN
            uploadedIds.push(mediaId);
            console.log(`✅ Successfully uploaded ${file.name} with ID: ${mediaId}`);

            // Update progress to show completed file
            setUploadProgress(prev => prev ? {
              ...prev,
              completedFiles: [...prev.completedFiles, file.name]
            } : null);

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
          // Continue with next file even if one fails
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
      setUploadProgress(null);
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
    setUploadProgress({
      current: 0,
      total: 1,
      currentFile: files[0].name,
      completedFiles: []
    });

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
      setUploadProgress(null);
    }
  };

  const handleAddUrl = async () => {
    if (!urlInput.trim()) return;

    setUploading(true);

    try {
      if (saveUrlToCdn) {
        // Download image from URL and upload to CDN
        const response = await fetch(urlInput);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

        const blob = await response.blob();
        const file = new File([blob], urlInput.split('/').pop() || 'image.jpg', { type: blob.type });

        // Get signed URL for CDN upload
        const geturl = await GetSignedUrl();
        const signedURL = geturl?.result?.uploadURL;

        if (!signedURL) {
          throw new Error("Failed to get upload URL");
        }

        // Upload to CDN
        const res = await SaveMedia(file, signedURL);
        if (!res?.result?.id) {
          throw new Error("Failed to upload to CDN");
        }

        const mediaId = res.result.id;
        registerMediaWithBackground(query, actions, mediaId, "cdn", "media-manager");

        // Add metadata
        actions.setProp(ROOT_NODE, (props: any) => {
          props.pageMedia = props.pageMedia || [];
          const existingMedia = props.pageMedia.find((m: any) => m.id === mediaId);

          if (existingMedia) {
            existingMedia.metadata = {
              ...existingMedia.metadata,
              title: file.name,
              alt: file.name.replace(/\.[^/.]+$/, ""),
              size: file.size,
              originalUrl: urlInput, // Keep track of original URL
            };
          }
        });

        console.log(`✅ Downloaded and uploaded URL to CDN: ${urlInput}`);
      } else {
        // Store as URL reference (existing behavior)
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

        console.log(`✅ Added URL reference: ${urlInput}`);
      }

      refreshMediaList();
      setUrlInput("");
      setSaveUrlToCdn(false);
      setAddMode("upload");
    } catch (error) {
      console.error("Failed to add URL:", error);
      alert(`Failed to add URL: ${error.message}`);
    } finally {
      setUploading(false);
    }
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

      // Check clipboard for images when modal opens
      checkClipboardForImages();

      // Add paste event listener when modal opens
      document.addEventListener('paste', handlePaste);
    }

    // Cleanup paste event listener when modal closes
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9997] bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9998] bg-background border border-border shadow-xl"
        style={{ margin: "20px", borderRadius: "12px", overflow: "hidden" }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-accent text-accent-foreground">
            <div className="flex items-center gap-4">
              <TbPhoto className="text-3xl text-primary" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {selectionMode ? "Select Media" : "Media Manager"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectionMode
                    ? "Click an image to select it"
                    : `${filteredMedia.length} ${filteredMedia.length === 1 ? "item" : "items"}${searchQuery ? ` (filtered from ${mediaList.length})` : ""}`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-2xl p-2 hover:bg-muted rounded-lg"
              title="Close"
            >
              <TbX />
            </button>
          </div>

          {/* Toolbar */}
          <div ref={toolbarRef} className="px-4 py-2 border-b border-border bg-muted">
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="flex-1 relative">
                <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search media..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-muted text-muted-foreground rounded-lg p-1 border border-border">
                <Tooltip content="Card view" placement="bottom">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${viewMode === "cards"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <TbLayoutGrid className="w-4 h-4" />
                  </button>
                </Tooltip>
                <Tooltip content="List view" placement="bottom">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${viewMode === "list"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <TbList className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>

              {/* Add Mode Selector - compact pills */}
              <div className="flex items-center gap-1 bg-muted text-muted-foreground rounded-lg p-1 border border-border">
                <Tooltip content="Upload files" placement="bottom">
                  <button
                    onClick={() => {
                      setAddMode("upload");
                      if (addMode === "upload") fileInputRef.current?.click();
                    }}
                    disabled={uploading}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${addMode === "upload"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <TbUpload className="inline" />
                  </button>
                </Tooltip>
                <Tooltip content="Add from URL" placement="bottom">
                  <button
                    onClick={() => setAddMode("url")}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${addMode === "url"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <TbExternalLink className="inline" />
                  </button>
                </Tooltip>
                <Tooltip content="Add SVG code" placement="bottom">
                  <button
                    onClick={() => setAddMode("svg")}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${addMode === "svg"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <TbCode className="inline" />
                  </button>
                </Tooltip>
                <Tooltip
                  content={hasImageInClipboard
                    ? "Paste image from clipboard (Ctrl+V / Cmd+V)"
                    : "No image in clipboard"
                  }
                  placement="bottom"
                >
                  <button
                    onClick={handlePasteClick}
                    disabled={!hasImageInClipboard || uploading}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${hasImageInClipboard && !uploading
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-muted-foreground cursor-not-allowed"
                      }`}
                  >
                    <TbClipboard className="inline" />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Inline input for URL/SVG modes */}
            {addMode === "url" && (
              <div className="mt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-1.5 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
                    autoFocus
                  />
                  <button
                    onClick={handleAddUrl}
                    disabled={!urlInput.trim() || uploading}
                    className="px-3 py-1.5 bg-primary text-foreground rounded text-sm hover:bg-primary disabled:bg-muted transition-colors"
                  >
                    {uploading ? "Adding..." : "Add"}
                  </button>
                </div>

                {/* Save to CDN toggle */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="saveUrlToCdn"
                    checked={saveUrlToCdn}
                    onChange={(e) => setSaveUrlToCdn(e.target.checked)}
                    className="w-4 h-4 text-accent bg-muted border-border rounded focus:ring-ring"
                  />
                  <label htmlFor="saveUrlToCdn" className="text-xs text-muted-foreground">
                    Save to CDN (downloads image to your account)
                  </label>
                </div>

                {/* Paste hint */}
                <div className="mt-2 text-xs text-muted-foreground">
                  💡 Tip: You can also paste images directly (Ctrl+V / Cmd+V) or use the clipboard button above!
                </div>
              </div>
            )}

            {addMode === "svg" && (
              <div className="mt-2">
                <div className="flex gap-2">
                  <textarea
                    value={svgInput}
                    onChange={(e) => setSvgInput(e.target.value)}
                    placeholder="<svg>...</svg>"
                    className="flex-1 px-3 py-1.5 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring font-mono text-xs"
                    rows={3}
                    autoFocus
                  />
                  <button
                    onClick={handleAddSvg}
                    disabled={!svgInput.trim()}
                    className="px-3 py-1.5 bg-primary text-foreground rounded text-sm hover:bg-primary disabled:bg-muted transition-colors"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 ml-0.5">
                  Find SVGs @{" "}
                  <a
                    href="https://www.svgrepo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary underline"
                  >
                    svgrepo.com
                  </a>
                </p>
              </div>
            )}

            {uploading && (
              <div className="mt-2 text-sm text-muted-foreground">Uploading...</div>
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
          <div
            className={`flex-1 overflow-y-auto bg-background relative transition-colors ${isDragOver ? 'bg-accent border-2 border-dashed border-accent' : ''
              } ${uploadProgress ? 'pt-16' : 'p-3'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Add padding when no upload progress */}
            {!uploadProgress && <div className="p-3"></div>}

            {/* Drag and drop overlay */}
            {isDragOver && (
              <div className="absolute inset-0 bg-accent/90 backdrop-blur-sm z-40 flex items-center justify-center border-2 border-dashed border-accent rounded-lg">
                <div className="flex flex-col items-center gap-4 text-accent-foreground">
                  <TbUpload className="text-6xl" />
                  <div className="text-center">
                    <p className="text-xl font-semibold">Drop files here</p>
                    <p className="text-sm opacity-75">Release to upload multiple images</p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload progress bar */}
            {uploadProgress && (
              <div className="absolute top-0 left-0 right-0 bg-background border-b border-border p-4 z-30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-foreground">
                      Uploading {uploadProgress.current + 1} of {uploadProgress.total} files
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(((uploadProgress.current + 1) / uploadProgress.total) * 100)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-muted text-muted-foreground rounded-full h-2 mb-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${((uploadProgress.current + 1) / uploadProgress.total) * 100}%` }}
                  ></div>
                </div>

                {/* Current file */}
                {uploadProgress.currentFile && (
                  <div className="text-xs text-muted-foreground truncate">
                    📁 {uploadProgress.currentFile}
                  </div>
                )}

                {/* Completed files */}
                {uploadProgress.completedFiles.length > 0 && (
                  <div className="text-xs text-secondary-foreground mt-1">
                    ✅ Completed: {uploadProgress.completedFiles.join(', ')}
                  </div>
                )}
              </div>
            )}

            {filteredMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <TbPhoto className="text-6xl text-primary mb-3" />
                {searchQuery ? (
                  <>
                    <p className="text-muted-foreground text-lg mb-2">No media found</p>
                    <p className="text-sm text-muted-foreground">
                      Try a different search term
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground text-lg mb-2">No media uploaded yet</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload files, add URLs, or paste SVG code
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      💡 You can also drag & drop multiple images anywhere in this area
                    </p>
                    <button
                      onClick={() => {
                        setAddMode("upload");
                        fileInputRef.current?.click();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary shadow-sm"
                    >
                      <TbPlus />
                      Upload Your First Image
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className={viewMode === "cards"
                ? "grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2"
                : "space-y-1"
              }>
                {filteredMedia.map((media) => (
                  <div
                    key={media.id}
                    className={`group relative bg-card rounded-lg border border-border overflow-hidden cursor-pointer transition-all hover:shadow-md ${viewMode === "cards"
                      ? selectedMedia === media.id
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : "hover:border-primary"
                      : selectedMedia === media.id
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : "hover:border-primary"
                      }`}
                    onClick={() => {
                      if (selectionMode && onSelect) {
                        onSelect(media.id);
                      } else {
                        setSelectedMedia(media.id);
                      }
                    }}
                  >
                    {viewMode === "cards" ? (
                      <>
                        {/* Card View - Thumbnail */}
                        <div className="aspect-square bg-muted text-muted-foreground flex items-center justify-center overflow-hidden">
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

                        {/* Card View - Name/Title and Size */}
                        <div className="p-1.5 bg-accent text-accent-foreground">
                          <p className="text-xs truncate text-foreground font-medium">
                            {media.metadata?.title || media.id}
                          </p>
                          {media.metadata?.size && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {formatFileSize(media.metadata.size)}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* List View - Horizontal Layout */}
                        <div className="flex items-center p-1.5 bg-accent text-accent-foreground">
                          {/* Tiny thumbnail */}
                          <div className="w-8 h-8 bg-muted text-muted-foreground rounded flex items-center justify-center overflow-hidden flex-shrink-0 mr-3">
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
                                className="w-full h-full p-1"
                                dangerouslySetInnerHTML={{ __html: media.metadata?.svg || "" }}
                              />
                            ) : (
                              <img
                                key={`${media.id}-${media.uploadedAt || 0}`}
                                src={getCdnUrl(media.cdnId || media.id, { width: 100, format: 'auto' })}
                                alt={media.metadata?.alt || media.id}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                          </div>

                          {/* File info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate text-foreground font-medium">
                              {media.metadata?.title || media.id}
                            </p>
                            {media.metadata?.size && (
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(media.metadata.size)}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Action Buttons (on hover) */}
                    <div className={`absolute ${viewMode === "cards" ? "top-1 right-1" : "top-2 right-2"} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReplacingMedia(media.id);
                          replaceInputRef.current?.click();
                        }}
                        className="p-1.5 bg-background border border-border rounded-md shadow-lg hover:bg-muted text-primary transition-colors"
                        title="Replace image"
                      >
                        <TbRefresh className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(media);
                        }}
                        className="p-1.5 bg-background border border-border rounded-md shadow-lg hover:bg-muted text-primary transition-colors"
                        title="Edit metadata"
                      >
                        <TbEdit className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(media.id);
                        }}
                        className="p-1.5 bg-background border border-border rounded-md shadow-lg hover:bg-destructive text-destructive transition-colors"
                        title="Delete"
                      >
                        <TbTrash className="text-sm" />
                      </button>
                    </div>

                    {/* Metadata indicator */}
                    {(media.metadata?.alt || media.metadata?.description) && (
                      <div className="absolute bottom-10 left-1">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
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
            className="absolute inset-0 bg-background/80 backdrop-blur-sm text-muted-foreground flex items-center justify-center p-4"
            onClick={() => setEditingMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-xl font-bold text-foreground">Edit Media</h3>
                <button
                  onClick={() => setEditingMedia(null)}
                  className="text-muted-foreground hover:text-foreground text-xl"
                >
                  <TbX />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Preview */}
                <div className="flex items-center gap-4 p-4 bg-muted text-muted-foreground rounded-lg border border-border">
                  {editingMedia.type === "url" ? (
                    <img
                      src={editingMedia.metadata?.url}
                      alt={editingMedia.metadata?.alt || "Preview"}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ) : editingMedia.type === "svg" ? (
                    <div
                      className="w-24 h-24 flex items-center justify-center rounded border border-border"
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
                    <p className="text-sm font-mono text-muted-foreground">{editingMedia.id}</p>
                    <p className="text-xs text-muted-foreground mt-1">Type: {editingMedia.type || "cdn"}</p>
                    {editingMedia.metadata?.size && (
                      <p className="text-xs text-muted-foreground mt-1">Size: {formatFileSize(editingMedia.metadata.size)}</p>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                {/* URL field for URL type - show first */}
                {editingMedia.type === "url" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Image URL <span className="text-destructive">*</span>
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
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                )}

                {/* SVG field for SVG type - show first */}
                {editingMedia.type === "svg" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      SVG Code <span className="text-destructive">*</span>
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
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                      rows={6}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
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
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Alt Text <span className="text-destructive">*</span>
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
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Important for accessibility and SEO
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
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
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted text-muted-foreground">
                <button
                  onClick={() => setEditingMedia(null)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedMetadata}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary"
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

