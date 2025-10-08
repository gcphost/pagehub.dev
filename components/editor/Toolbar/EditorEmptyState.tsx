import { motion } from "framer-motion";
import { TbBoxModel2, TbClick, TbPlus, TbPointer } from "react-icons/tb";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ComponentsAtom, MenuItemState, MenuState, OpenComponentEditorAtom, ViewModeAtom } from "utils/lib";

export const EditorEmptyState = () => {
  const viewMode = useRecoilValue(ViewModeAtom);
  const components = useRecoilValue(ComponentsAtom);
  const setOpenComponentEditor = useSetRecoilState(OpenComponentEditorAtom);
  const setShowMenu = useSetRecoilState(MenuState);
  const setShowMenuType = useSetRecoilState(MenuItemState);

  const isComponentMode = viewMode === 'component';
  const hasComponents = components.length > 0;

  const handleCreateClick = () => {
    // Open component editor to create new component
    setOpenComponentEditor({ componentId: null, componentName: 'New Component' });
  };

  const handleSectionsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // This will be handled by AddSectionNodeController, just focus on something
    document.getElementById('viewport')?.focus();
  };

  const handleComponentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(true);
    setShowMenuType('components');
  };

  return (
    <div className="bg-gray-700/50 scrollbar w-auto overflow-auto h-screen grow basis-full pb-24 z-20 gap-8 flex flex-col items-center justify-center text-center px-2">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-gray-400"
      >
        {isComponentMode && !hasComponents ? (
          <TbBoxModel2 className="w-20 h-20" />
        ) : (
          <TbPointer className="w-20 h-20 rotate-90" />
        )}
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-3"
      >
        <h2 className="text-2xl font-semibold text-gray-200">
          {isComponentMode && !hasComponents ? (
            <>Create your first component</>
          ) : (
            <>Select something to edit</>
          )}
        </h2>

        <p className="text-gray-400 text-sm max-w-md flex items-center justify-center gap-1 flex-wrap">
          {isComponentMode ? (
            hasComponents ? (
              <>
                <span>Click on an element to start editing,</span>
                <span>or add components</span>
                <button
                  onClick={handleComponentsClick}
                  className="inline-flex items-center justify-center w-5 h-5 text-white hover:text-primary-400 transition-colors cursor-pointer"
                  title="Browse components"
                >
                  <TbPlus className="w-8 h-8" />
                </button>
                <span>to build your component.</span>
              </>
            ) : (
              <>Get started by creating your first reusable component. Components can be used across multiple pages.</>
            )
          ) : (
            <>
              <span>Click on an element to start editing,</span><span>or add new sections</span>
              <button
                onClick={handleSectionsClick}
                className="inline-flex items-center justify-center w-5 h-5 text-white hover:text-primary-400 transition-colors cursor-pointer"
                title="Add sections"
              >
                <TbBoxModel2 className="w-8 h-8" />
              </button>
              <span>and components</span>
              <button
                onClick={handleComponentsClick}
                className="inline-flex items-center justify-center w-5 h-5 text-white hover:text-primary-400 transition-colors cursor-pointer"
                title="Browse components"
              >
                <TbPlus className="w-8 h-8" />
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
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
        >
          <TbPlus className="w-5 h-5" />
          <span>Create Component</span>
        </motion.button>
      )}

      {/* Helpful Hint */}
      {hasComponents && isComponentMode && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center gap-2 text-gray-500 text-xs mt-4"
        >
          <TbClick className="w-8 h-8" />
          <span>Use the dropdown at the top to select a component</span>
        </motion.div>
      )}
    </div>
  );
};

