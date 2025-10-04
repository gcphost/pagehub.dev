import { useEditor } from "@craftjs/core";
import { useMemo } from "react";
import { getMediaById, getMediaContent } from "./lib";

/**
 * Custom hook to get media content by ID
 * @param mediaId - The ID of the media to retrieve
 * @returns Object with media content URL and metadata
 */
export const useMediaContent = (mediaId: string | null | undefined) => {
  const { query } = useEditor();

  return useMemo(() => {
    if (!mediaId) {
      return { src: null, media: null };
    }

    const media = getMediaById(query, mediaId);
    const src = getMediaContent(query, mediaId);

    return {
      src,
      media,
      alt: media?.metadata?.alt || "",
      title: media?.metadata?.title || "",
      description: media?.metadata?.description || "",
    };
  }, [mediaId, query]);
};

/**
 * Custom hook to get all page media
 * @returns Array of all media items
 */
export const usePageMedia = () => {
  const { query } = useEditor();

  return useMemo(() => {
    try {
      const backgroundNode = query.node("ROOT").get();
      if (!backgroundNode) return [];
      return backgroundNode.data.props.pageMedia || [];
    } catch (e) {
      console.error("Failed to get page media:", e);
      return [];
    }
  }, [query]);
};
