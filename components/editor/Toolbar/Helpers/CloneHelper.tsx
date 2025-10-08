import { getLinkedAncestorNode } from "components/editor/componentUtils";
import { removeHasManyRelation } from "components/editor/Viewport/lib";
import { TbBoxModel2, TbLinkOff, TbPalette } from "react-icons/tb";
import { useSetRecoilState } from "recoil";
import { OpenComponentEditorAtom, ViewModeAtom } from "utils/lib";

export const setClonedProps = (props, query, exclude = []) => {
  // If this node doesn't belong to a master component, just return props as-is
  if (!props.belongsTo) {
    return props;
  }

  try {
    // Get the master node
    const masterNode = query.node(props.belongsTo).get();
    if (!masterNode) {
      return props;
    }

    const masterProps = { ...masterNode.data.props };

    // Always exclude these props from syncing
    const propsToExclude = ['belongsTo', 'relationType', 'hasMany', 'savedComponentName', 'type'];
    propsToExclude.forEach(key => {
      delete masterProps[key];
    });

    // If it's a "style" relation type, sync everything EXCEPT styles
    if (props.relationType === "style") {
      // Clone keeps its own styles (root, mobile, tablet, desktop)
      // but gets everything else from master
      return {
        ...props,
        ...masterProps,
        root: props.root,
        mobile: props.mobile,
        tablet: props.tablet,
        desktop: props.desktop,
        belongsTo: props.belongsTo,
        relationType: props.relationType,
      };
    }

    // For "full" relation type, sync everything from master
    return {
      ...props,
      ...masterProps,
      belongsTo: props.belongsTo,
      relationType: props.relationType,
    };
  } catch (error) {
    console.error('Error syncing cloned props:', error);
    return props;
  }
};

export const ConvertToRegularComponent = ({ query, actions, id }) => (
  <button
    className="w-full flex items-center gap-3 px-4 py-3 bg-primary-800 hover:bg-primary-700 rounded-lg transition-colors text-left"
    onClick={() => {
      const node = query.node(id).get();
      removeHasManyRelation(node, query, actions);

      actions.setProp(id, (prop) => {
        prop.belongsTo = "";
        prop.relationType = "";
      });
    }}
  >
    <TbLinkOff className="text-red-400 flex-shrink-0 text-xl" />
    <div className="flex-1">
      <div className="font-semibold text-white">Unlink Component</div>
      <div className="text-xs text-gray-400">Make independent with all settings editable</div>
    </div>
  </button>
);

export const getClonedState = (props, state) => {
  if (!props.belongsTo) {
    return {
      enabled: state.options.enabled,
    };
  }
  return {
    enabled: state.options.enabled,
    state,
  };
};

export const NoSettings = ({ actions, id, query }) => (
  <>
    <p className="text-xl">No settings available.</p>

    <ConvertToRegularComponent query={query} actions={actions} id={id} />
  </>
);

export const ConvertToStyledComponent = ({ actions, id }) => (
  <button
    className="w-full flex items-center gap-3 px-4 py-3 bg-primary-800 hover:bg-primary-700 rounded-lg transition-colors text-left"
    onClick={() =>
      actions.setProp(id, (prop) => (prop.relationType = "style"))
    }
  >
    <TbPalette className="text-blue-400 flex-shrink-0 text-xl" />
    <div className="flex-1">
      <div className="font-semibold text-white">Style Only Mode</div>
      <div className="text-xs text-gray-400">Edit styles while keeping other settings linked</div>
    </div>
  </button>
);

export const RenderChildren = ({ props, children, query, actions, id }) => {
  const setViewMode = useSetRecoilState(ViewModeAtom);
  const setOpenComponentEditor = useSetRecoilState(OpenComponentEditorAtom);

  // Check if this node or ANY ancestor is a linked component
  const linkedNode = getLinkedAncestorNode(id, query);

  if (linkedNode) {
    const linkedNodeId = linkedNode.data.props.belongsTo;
    const parent = query.node(linkedNodeId).get();
    if (parent) {
      // Get the component container (parent's parent if it's inside a component)
      const componentContainer = parent.data.parent ? query.node(parent.data.parent).get() : null;
      const isInComponentContainer = componentContainer?.data?.props?.type === 'component';

      // Get the first child of the component container (the actual content node)
      const contentNodeId = isInComponentContainer ? componentContainer.data.nodes?.[0] : props.belongsTo;
      const componentName = componentContainer?.data?.custom?.displayName || parent.data.custom?.displayName || parent.data.displayName || 'Master Component';

      const handleEditComponent = () => {
        // Switch to component mode
        setViewMode('component');

        // Open the component for editing
        setTimeout(() => {
          setOpenComponentEditor({
            componentId: contentNodeId,
            componentName: componentName,
          });
        }, 100);
      };

      return (
        <div className="p-3 flex flex-col gap-3">
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400 mb-2">This is a linked instance of:</div>
            <div className="font-semibold text-white text-lg">{componentName}</div>
          </div>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 bg-primary-800 hover:bg-primary-700 rounded-lg transition-colors text-left"
            onClick={handleEditComponent}
          >
            <TbBoxModel2 className="text-green-500 flex-shrink-0 text-xl" />
            <div className="flex-1">
              <div className="font-semibold text-white">Edit Linked Instance</div>
              <div className="text-xs text-primary-200">Change the main component</div>
            </div>
          </button>

          <ConvertToStyledComponent actions={actions} id={id} />

          <ConvertToRegularComponent query={query} actions={actions} id={id} />
        </div>
      );
    }
  }

  return children;
};
