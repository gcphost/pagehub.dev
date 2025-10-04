import { useEditor } from "@craftjs/core";
import { useEffect, useState } from "react";
import { TbPhoto } from "react-icons/tb";
import { getPageMedia } from "utils/lib";
import { ToolbarSection } from "../ToolbarSection";
import { MediaManagerModal } from "./MediaManagerModal";

export const MediaManagerInput = () => {
  const { query } = useEditor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaCount, setMediaCount] = useState(0);

  useEffect(() => {
    const media = getPageMedia(query);
    setMediaCount(media.length);
  }, [query]);

  return (
    <>
      <ToolbarSection title="Media Manager" full={2}>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-primary-500 rounded-lg transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <TbPhoto className="text-2xl text-gray-600 group-hover:text-primary-500" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Manage Media</div>
              <div className="text-sm text-gray-500">
                {mediaCount} {mediaCount === 1 ? "item" : "items"} uploaded
              </div>
            </div>
          </div>
          <div className="text-gray-400 group-hover:text-primary-500">→</div>
        </button>
      </ToolbarSection>

      <MediaManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

