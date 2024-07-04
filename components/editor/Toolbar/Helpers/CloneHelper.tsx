import { removeHasManyRelation } from "components/editor/Viewport/lib";

export const setClonedProps = (props, query, exclude = []) => {
  return props;
  if (props.belongsTo) {
    const parent = query.node(props.belongsTo).get();
    const parentProps = parent?.data?.props || {};

    if (parentProps && props.relationType !== "style") {
      props = { ...props, ...parent?.data?.props };
    }

    if (parentProps && props.relationType === "style") {
      const propsWithout = (_name) => {
        const pro = parent.data?.props[_name] || {};
        const og = props[_name];
        const newRootProps = {};

        Object.keys(pro).forEach((_) => {
          if (!exclude.includes(_)) {
            newRootProps[_] = pro[_];
          } else {
            newRootProps[_] = og[_];
          }
        });

        return newRootProps;
      };

      props.root = propsWithout("root");
      props.desktop = propsWithout("desktop");
      props.mobile = propsWithout("mobile");
    }
  }

  return props;
};

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

export const NoSettings = ({ actions, id, query }) => {
  return (
    <>
      <p className="text-xl">No settings available.</p>

      <ConvertToRegularComponent query={query} actions={actions} id={id} />
    </>
  );
};

export const ConvertToRegularComponent = ({ query, actions, id }) => {
  return (
    <p>
      <strong
        className="cursor-pointer underline"
        onClick={() => {
          const node = query.node(id).get();
          removeHasManyRelation(node, query, actions);

          actions.setProp(id, (prop) => {
            prop.belongsTo = "";
            prop.relationType = "";
          });
        }}
      >
        Convert to a regular component
      </strong>{" "}
      to adjust all of the settings and remove the relation.
    </p>
  );
};

export const ConvertToStyledComponent = ({ actions, id }) => {
  return (
    <p>
      <strong
        className="cursor-pointer underline"
        onClick={() =>
          actions.setProp(id, (prop) => (prop.relationType = "style"))
        }
      >
        Convert to a styled component
      </strong>{" "}
      to adjust non style related settings.
    </p>
  );
};

export const RenderChildren = ({ props, children, query, actions, id }) => {
  if (props.belongsTo && props.relationType !== "style") {
    const parent = query.node(props.belongsTo).get();
    if (parent) {
      return (
        <div className="p-3 flex flex-col gap-6">
          <p>
            Properties are defined in the{" "}
            <strong
              className="cursor-pointer underline"
              onClick={() => actions.selectNode(props.belongsTo)}
            >
              {parent.data.custom.displayName || parent.data.displayName}
            </strong>{" "}
            component and can be adjusted there.
          </p>

          <ConvertToStyledComponent actions={actions} id={id} />

          <ConvertToRegularComponent query={query} actions={actions} id={id} />
        </div>
      );
    }
  }

  return children;
};