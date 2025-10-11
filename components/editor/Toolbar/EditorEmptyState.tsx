import { motion } from "framer-motion";
import { TbBoxModel2, TbClick, TbPlus, TbPointer } from "react-icons/tb";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  ComponentsAtom,
  MenuItemState,
  MenuState,
  OpenComponentEditorAtom,
  ViewModeAtom,
} from "utils/lib";

export const EditorEmptyState = () => {
  const viewMode = useRecoilValue(ViewModeAtom);
  const components = useRecoilValue(ComponentsAtom);
  const setOpenComponentEditor = useSetRecoilState(OpenComponentEditorAtom);
  const setShowMenu = useSetRecoilState(MenuState);
  const setShowMenuType = useSetRecoilState(MenuItemState);

  const isComponentMode = viewMode === "component";
  const hasComponents = components.length > 0;

  const handleCreateClick = () => {
    // Open component editor to create new component
    setOpenComponentEditor({
      componentId: null,
      componentName: "New Component",
    });
  };

  const handleSectionsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // This will be handled by AddSectionNodeController, just focus on something
    document.getElementById("viewport")?.focus();
  };

  const handleComponentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(true);
    setShowMenuType("components");
  };

  return (
    <div className="scrollbar z-20 flex h-screen w-auto grow basis-full flex-col items-center justify-center gap-8 overflow-auto bg-background px-4 pb-24 text-center">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-muted-foreground"
      >
        {isComponentMode && !hasComponents ? (
          <TbBoxModel2 className="size-20" />
        ) : (
          <TbPointer className="size-20 rotate-90" />
        )}
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-3"
      >
        <h2 className="text-2xl font-semibold text-foreground">
          {isComponentMode && !hasComponents ? (
            <>Create your first component</>
          ) : (
            <>Select something to edit</>
          )}
        </h2>

        <p className="flex max-w-md flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
          {isComponentMode ? (
            hasComponents ? (
              <>
                <span>Click on an element to start editing,</span>
                <span>or add components</span>
                <button
                  onClick={handleComponentsClick}
                  className="inline-flex size-5 cursor-pointer items-center justify-center text-foreground transition-colors hover:text-primary"
                  title="Browse components"
                >
                  <TbPlus className="size-8" />
                </button>
                <span>to build your component.</span>
              </>
            ) : (
              <>
                Get started by creating your first reusable component.
                Components can be used across multiple pages.
              </>
            )
          ) : (
            <>
              <span>Click on an element to start editing,</span>
              <span>or add new sections</span>
              <button
                onClick={handleSectionsClick}
                className="inline-flex size-5 cursor-pointer items-center justify-center text-foreground transition-colors hover:text-primary"
                title="Add sections"
              >
                <TbBoxModel2 className="size-8" />
              </button>
              <span>and components</span>
              <button
                onClick={handleComponentsClick}
                className="inline-flex size-5 cursor-pointer items-center justify-center text-foreground transition-colors hover:text-primary"
                title="Browse components"
              >
                <TbPlus className="size-8" />
              </button>
              <span>to build your page.</span>
            </>
          )}
        </p>
      </motion.div>

      {/* Action Button */}
      {!hasComponents && isComponentMode && (
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateClick}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground shadow-sm transition-colors hover:bg-primary"
        >
          <TbPlus className="size-5" />
          <span>Create Component</span>
        </motion.button>
      )}

      {/* Helpful Hint */}
      {hasComponents && isComponentMode && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <TbClick className="size-8" />
          <span>Use the dropdown at the top to select a component</span>
        </motion.div>
      )}
    </div>
  );
};
