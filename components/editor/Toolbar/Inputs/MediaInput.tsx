import { useEditor, useNode } from "@craftjs/core";
import { useState } from "react";
import { TbPhoto } from "react-icons/tb";
import {
  getMediaById,
  getMediaContent,
  registerMediaWithBackground,
} from "utils/lib";
import { ToolbarSection } from "../ToolbarSection";
import { MediaManagerModal } from "./MediaManagerModal";

export const MediaInput = (propa) => {
  const props = { ...propa };
  const { props: nodeProps, id: componentId } = useNode((node) => ({
    props: node.data.props,
    id: node.id,
  }));

  const {
    actions: { setProp },
  } = useNode();

  const { query, actions } = useEditor();

  const { propKey, typeKey, title = "Media" } = props;

  const [showMediaBrowser, setShowMediaBrowser] = useState(false);

  const handleBrowseSelect = (selectedMediaId: string) => {
    if (!selectedMediaId) return;

    const selectedMedia = getMediaById(query, selectedMediaId);

    setProp((_props) => {
      _props[propKey] = selectedMediaId;
      _props[typeKey] = selectedMedia?.type || "cdn";
    });

    // Don't override the media type - it's already registered with the correct type
    // Just update the component reference
    registerMediaWithBackground(
      query,
      actions,
      selectedMediaId,
      selectedMedia?.type || "cdn",
      componentId,
    );

    setShowMediaBrowser(false);
  };

  const mediaId = nodeProps[propKey];
  const hasMedia = !!mediaId;
  const selectedMedia = hasMedia ? getMediaById(query, mediaId) : null;
  const isSvg = selectedMedia?.type === "svg";
  const svgContent = isSvg ? selectedMedia?.metadata?.svg : null;

  // For preview, use optimized size for CDN images
  let imageUrl = null;
  if (hasMedia && !isSvg) {
    if (selectedMedia?.type === "cdn") {
      const { getCdnUrl } = require("utils/cdn");
      const cdnId = selectedMedia.cdnId || selectedMedia.id;
      imageUrl = getCdnUrl(cdnId, { width: 600, format: "auto" });
    } else {
      imageUrl = getMediaContent(query, mediaId);
    }
  }

  const handleClear = () => {
    setProp((_props) => {
      _props[propKey] = null;
      _props[typeKey] = "cdn";
    });
  };

  return (
    <>
      <ToolbarSection title={title} full={1} collapsible={props.collapsible}>
        <div className="space-y-2">
          {/* Preview if media exists */}
          {hasMedia && (svgContent || imageUrl) && (
            <div className="relative">
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-background p-2">
                {svgContent ? (
                  <div
                    className="flex size-full items-center justify-center text-foreground [&>svg]:size-full [&>svg]:max-h-full [&>svg]:max-w-full"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                  />
                ) : (
                  <img
                    src={imageUrl || ""}
                    alt="Preview"
                    className="size-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Clear button - only show when media is set */}
              <button
                onClick={handleClear}
                className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-foreground hover:bg-destructive"
                title="Clear media"
              >
                ×
              </button>
            </div>
          )}

          {/* Browse Media Library Button */}
          <button
            onClick={() => setShowMediaBrowser(true)}
            className="btn w-full gap-2"
          >
            <TbPhoto />
            {hasMedia ? "Change Media" : "Browse Media Library"}
          </button>
        </div>

        <MediaManagerModal
          isOpen={showMediaBrowser}
          onClose={() => setShowMediaBrowser(false)}
          onSelect={handleBrowseSelect}
          selectionMode={true}
        />
      </ToolbarSection>
    </>
  );
};
