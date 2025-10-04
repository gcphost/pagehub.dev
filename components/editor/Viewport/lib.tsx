import { getRandomId, ROOT_NODE } from "@craftjs/utils";
import lz from "lzutf8";

const generate = require("boring-name-generator");

export const GetHtmlToComponent = async (html) => {
  try {
    const res = await fetch("/api/convert", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: html }),
    });

    return res.json();
  } catch (e) {
    console.error(e);
  }
};

export const GetSignedUrl = async () => {
  try {
    const res = await fetch("/api/media/get", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    return res.json();
  } catch (e) {
    console.error(e);
  }
};

export const SaveMedia = async (media, url) => {
  const formData = new FormData();
  formData.append("file", media);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    return res.json();
  } catch (e) {
    console.error(e);
  }
};

export const SaveSubmissions = async (
  submission,
  settings,
  additional = {}
) => {
  try {
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        submission,
        name: settings.name || settings.draftId,
        ...additional,
      }),
    });

    return res.json();
  } catch (e) {
    console.error(e);
  }
};

export const DeleteMedia = async (mediaId, settings, query = null, actions = null) => {
  try {
    const res = await fetch("/api/files", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mediaId,
        _id: settings._id,
      }),
    });

    // Also unregister from Background if query and actions are provided
    if (query && actions && mediaId) {
      const { unregisterMediaFromBackground } = await import("utils/lib");
      unregisterMediaFromBackground(query, actions, mediaId);
    }

    return res.json();
  } catch (e) {
    console.error(e);
  }
};

export const SaveToServer = async (json, draft, settings, setSettings, sessionToken = null) => {
  const content = lz.encodeBase64(lz.compress(json));

  localStorage.setItem("draft", content);

  const _id = settings?._id || "";

  const r: any = { _id };

  if (draft) {
    r.draft = content;
  } else r.content = content;

  // Include sessionToken if provided
  if (sessionToken) {
    r.sessionToken = sessionToken;
  }

  console.info("Saving...");
  const headers: any = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // Also send token in header for redundancy
  if (sessionToken) {
    headers['x-pagehub-token'] = sessionToken;
  }

  const res = await fetch("/api/save", {
    method: "POST",
    headers,
    body: JSON.stringify(r),
  });

  let result = null;

  try {
    result = await res.json();
  } catch (e) {
    console.error(e);
  }

  if (result && result._id) {
    const lsIds = JSON.parse(localStorage.getItem("history")) || [];

    if (!lsIds.find((_) => _._id === result._id)) {
      lsIds.push({
        _id: result._id,
        draftId: result?.title || result?.draftId,
      });
      localStorage.setItem("history", JSON.stringify(lsIds));
    }

    if (result._id !== _id) {
      window.history.pushState(result._id, result._id, `/build/${result._id}`);
      localStorage.setItem("_id", result._id);
      setSettings(result);
    }
  }
  // }
};

export const SearchGpt = async (search, existing) => {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ search, existing }),
  });

  const result = await res.json();

  return result;
};

const getPropValue = ({ propKey, propItemKey, index }, _props = {}) => {
  const value = _props ? { ..._props } : {};

  if (!propItemKey && !index && index !== 0) {
    return value[propKey] || null;
  }

  if (propItemKey && (index || index >= 0)) {
    value[propKey] = value[propKey] ? { ...value[propKey] } : {};
    value[propKey][index] = value[propKey][index]
      ? { ...value[propKey][index] }
      : {};
    return value[propKey][index][propItemKey] || null;
  }

  value[index] = value[index] ? { ...value[index] } : {};
  return value[index][propKey] || null;
};

export const getProp = (params, view, nodeProps) => {
  let nodeProp;

  if (params.propType === "root") {
    nodeProp = nodeProps.root;
  } else if (params.propType === "component") {
    nodeProp = nodeProps;
  } else nodeProp = nodeProps[view];

  const results = getPropValue(params, nodeProp);

  return results;
};

export const getPropFinalValue = (__props, view, nodeProps) => {
  let value = getProp(__props, view, nodeProps);
  let viewValue = view;

  if (!value) {
    const theView = view === "desktop" ? "mobile" : "desktop";
    value = getProp(__props, theView, nodeProps);
    viewValue = theView;
  }
  return { value, viewValue };
};

export const setPropOnView = (
  {
    propKey,
    value,
    setProp,
    view,
    index = null,
    propItemKey = null,
    onChange = null,
  }: PropType,
  delay = 2000
) => {
  try {
    setProp((props: any) => {
      // possible to do non root shit here..
      const setting =
        view === "component"
          ? (props = props || {})
          : (props[view] = props[view] || {});

      if (index >= 0 && propItemKey) {
        setting[propKey] = setting[propKey] || {};
        setting[propKey][index] = setting[propKey][index] || {};
        setting[propKey][index][propItemKey] = value;
        return;
      }

      if (index || index > 0) {
        setting[index] = setting[index] || {};
        setting[index][propKey] = value;
        return;
      }

      setting[propKey] = value;
    }, 0);

    if (onChange) onChange(value);
  } catch (e) {
    console.error(e);
  }
};

interface PropType {
  value: any;
  onChange?: any;
  propKey: string;
  setProp: any;
  view?: string;
  index?: any;
  propType?: string;
  propItemKey?: string;
  query?: any;
  actions?: any;
  nodeId?: string;
}

export const propagatePropsToClones = (
  originalId,
  propKey,
  value,
  view,
  query,
  actions,
  index = null,
  propItemKey = null
) => {
  try {
    const original = query.node(originalId).get();
    if (!original?.data?.props?.hasMany) return;

    const clones = original.data.props.hasMany;

    clones.forEach(cloneId => {
      const clone = query.node(cloneId).get();
      if (!clone) return;

      // Check if this prop should propagate based on relationType
      const cloneRelationType = clone.data.props.relationType;

      if (cloneRelationType === 'style') {
        // Only propagate style-related props (view-based styles)
        const styleViews = ['root', 'mobile', 'tablet', 'desktop', 'hover'];
        if (view !== 'component' && !styleViews.includes(view)) return;
        if (view === 'component') return; // Don't propagate component props in style mode
      }

      // Apply the same change to clone
      actions.setProp(cloneId, (props) => {
        const setting =
          view === "component"
            ? props
            : (props[view] = props[view] || {});

        if (index >= 0 && propItemKey) {
          setting[propKey] = setting[propKey] || {};
          setting[propKey][index] = setting[propKey][index] || {};
          setting[propKey][index][propItemKey] = value;
          return;
        }

        if (index || index > 0) {
          setting[index] = setting[index] || {};
          setting[index][propKey] = value;
          return;
        }

        setting[propKey] = value;
      }, 0);
    });
  } catch (e) {
    console.error('Error propagating props to clones:', e);
  }
};

export const changeProp = (props: PropType, delay = 2000) => {
  const view = props.propType === "root" ? "root" :
    props.propType === "component" ? "component" :
      props.view;

  // Apply the change
  setPropOnView({ ...props, view }, delay);

  // Propagate to clones if query and actions are provided
  if (props.query && props.actions && props.nodeId) {
    const node = props.query.node(props.nodeId).get();
    if (node?.data?.props?.hasMany?.length) {
      propagatePropsToClones(
        props.nodeId,
        props.propKey,
        props.value,
        view,
        props.query,
        props.actions,
        props.index,
        props.propItemKey
      );
    }
  }
};

export const removeHasManyRelation = (node, query, actions) => {
  if (node.data.props?.belongsTo) {
    const belongsTo = query.node(node.data.props.belongsTo).get();

    if (belongsTo) {
      actions.setProp(
        node.data.props.belongsTo,
        (prop) => (prop.hasMany = prop.hasMany.filter((_) => _ !== node.id))
      );
    }
  }
};

export const deleteNode = async (query, actions, active, settings) => {
  const selected = query.getEvent("selected").first();

  const node = query.node(selected).get();
  if (!node.data.props.canDelete) return;

  if (node.data.props?.hasMany?.length) {
    const many = node.data.props?.hasMany;

    many.forEach((hasId) => {
      const has = query.node(hasId).get();
      if (has) {
        actions.setProp(hasId, (prop) => (prop.belongsTo = null));
      }
    });
  }

  removeHasManyRelation(node, query, actions);

  const theParent = query.node(node.data.parent).get();
  const index = theParent.data.nodes.indexOf(active);

  const theNew =
    index > 0 ? query.node(theParent.data.nodes[index - 1]).get() : theParent;

  actions.selectNode(theNew.id);

  const { type, videoId, image, ico } = node.data.props || {};

  // Clean up any media associated with this node
  if (type === "cdn" && videoId) {
    DeleteMedia(videoId, settings, query, actions);
  }
  if (image) {
    DeleteMedia(image, settings, query, actions);
  }
  if (ico) {
    DeleteMedia(ico, settings, query, actions);
  }

  if (!query.node(selected).get()) return;

  actions.delete(selected);
};

export const addHandler = ({
  actions,
  query,
  getCloneTree,
  id,
  data = null,
  setProp,
}) => {
  data = data || JSON.parse(localStorage.getItem("clipBoard"));
  const newNodes = JSON.parse(data.nodes);

  Object.keys(newNodes).forEach((_) => {
    const d = newNodes[_].props;
    // newNodes[_].props.belongsTo = _;
    // newNodes[_].props.hasMany = [];

    if (d?.type === "page") {
      if (!d.canDelete) {
        d.canDelete = true;
      }

      if (newNodes[_].custom.displayName === "Home Page") {
        newNodes[_].custom.displayName = "Page";
        newNodes[_].props.isHomePage = false;
      }

      newNodes[_].custom.displayName = generate().spaced;
    }
  });

  const nodePairs = Object.keys(newNodes).map((id) => {
    const nodeId = id;

    const da = query
      .parseSerializedNode(newNodes[id])
      .toNode((node) => (node.id = nodeId));

    return [nodeId, da];
  });
  const tree = { rootNodeId: data.rootNodeId, nodes: fromEntries(nodePairs) };
  const newTree = getCloneTree(tree);

  const theNode = query.node(id).get();

  const parentNode = query.node(theNode?.data?.parent || ROOT_NODE).get();
  const indexToAdd = parentNode.data.nodes.indexOf(id);

  // add templates where you want
  actions.addNodeTree(newTree, parentNode.id, indexToAdd + 1);

  setTimeout(() => actions.selectNode(newTree.rootNodeId), 50);
};

const fromEntries = (pairs) => {
  if (Object.fromEntries) {
    return Object.fromEntries(pairs);
  }
  return pairs.reduce(
    (accum, [id, value]) => ({
      ...accum,
      [id]: value,
    }),
    {}
  );
};

export const saveHandler = ({ query, id, component = null, actions = null }) => {
  const tree = query.node(id).toNodeTree();
  const nodePairs = Object.keys(tree.nodes).map((id) => [
    id,
    query.node(id).toSerializedNode(),
  ]);
  const entries = fromEntries(nodePairs);

  const serializedNodesJSON = JSON.stringify(entries);

  // Get the component name from the root node
  const rootNode = query.node(tree.rootNodeId).get();
  const componentName = rootNode?.data?.custom?.displayName ||
    rootNode?.data?.displayName ||
    rootNode?.data?.name ||
    `Component ${Date.now()}`;

  const saveData = {
    rootNodeId: tree.rootNodeId,
    nodes: serializedNodesJSON,
    name: componentName, // Add name for linking
  };

  // save to your database

  // assign component it came froms id.. then that new comp can see if we can mod or take settings..

  if (component) {
    // Save to Background props instead of localStorage
    if (actions) {
      // Find the Background node (ROOT_NODE's first child is usually Background)
      const rootNode = query.node(ROOT_NODE).get();
      const backgroundId = rootNode?.data?.nodes?.[0];

      if (backgroundId) {
        console.log('💾 Saving component to Background:', componentName);
        actions.setProp(backgroundId, (prop) => {
          prop.savedComponents = prop.savedComponents || [];
          // Check if component already exists (avoid duplicates)
          if (!prop.savedComponents.find(c => c.rootNodeId === saveData.rootNodeId)) {
            prop.savedComponents.push(saveData);
            console.log('✅ Component saved! Total components:', prop.savedComponents.length);
          } else {
            console.log('⚠️ Component already exists, skipping');
          }
        });
      }

      // Mark the original component on canvas with savedComponentName so clones can link to it
      actions.setProp(id, (prop) => {
        prop.savedComponentName = componentName;
      });

      // Verify serialization and trigger save
      setTimeout(() => {
        const serialized = query.serialize();
        const parsed = JSON.parse(serialized);
        const bgNode = parsed[backgroundId];
        console.log('🔍 Background node savedComponents after save:', bgNode?.props?.savedComponents?.length || 0);

        // Trigger a tracked change to force the onNodesChange callback
        // This ensures auto-save captures the new savedComponents
        actions.setProp(backgroundId, (prop) => {
          // Touch a property to trigger change detection (this will be in history)
          prop._lastComponentSave = Date.now();
        });
        console.log('🔔 Triggered change to force auto-save');
      }, 100);
    }
  } else localStorage.setItem("clipBoard", JSON.stringify(saveData));

  return saveData;
};

export const getNodeTree = ({ tree, query }) => {
  const newNodes = {};
  const changeNodeId = (node: any, newParentId?: string) => {
    const newNodeId = getRandomId();
    const childNodes = node.data.nodes.map((childId) =>
      changeNodeId(tree.nodes[childId], newNodeId)
    );
    const linkedNodes = Object.keys(node.data.linkedNodes).reduce((acc, id) => {
      const newLinkedNodeId = changeNodeId(
        tree.nodes[node.data.linkedNodes[id]],
        newNodeId
      );
      return {
        ...acc,
        [id]: newLinkedNodeId,
      };
    }, {});

    const tmpNode = {
      ...node,
      id: newNodeId,
      data: {
        ...node.data,
        parent: newParentId || node.data.parent,
        nodes: childNodes,
        linkedNodes,
      },
    };
    const freshNode = query.parseFreshNode(tmpNode).toNode();
    newNodes[newNodeId] = freshNode;
    return newNodeId;
  };

  const rootNodeId = changeNodeId(tree.nodes[tree.rootNodeId]);
  return {
    rootNodeId,
    nodes: newNodes,
  };
};

export const buildClonedTree = ({ tree, query, setProp, createLinks = true }) => {
  const newNodes = {};
  const changeNodeId = (node: any, newParentId?: string) => {
    const newNodeId = getRandomId();
    const childNodes = node.data.nodes.map((childId) =>
      changeNodeId(tree.nodes[childId], newNodeId)
    );
    const linkedNodes = Object.keys(node.data.linkedNodes).reduce((acc, id) => {
      const newLinkedNodeId = changeNodeId(
        tree.nodes[node.data.linkedNodes[id]],
        newNodeId
      );
      return {
        ...acc,
        [id]: newLinkedNodeId,
      };
    }, {});

    const oldid = node.id;

    const tmpNode = {
      ...node,
      id: newNodeId,

      data: {
        ...node.data,
        parent: newParentId || node.data.parent,
        nodes: childNodes,
        linkedNodes,
      },
    };
    const freshNode = query.parseFreshNode(tmpNode).toNode();

    newNodes[newNodeId] = freshNode;

    // Only create links if the original node exists in the current canvas
    if (createLinks && query.node(oldid).get()) {
      setProp(oldid, (prop) => {
        prop.hasMany = prop.hasMany || [];
        prop.hasMany.push(newNodeId);
      });
    }

    return newNodeId;
  };

  const rootNodeId = changeNodeId(tree.nodes[tree.rootNodeId]);

  // Store the original root ID for later use (after tree is added to editor)
  const originalRootId = tree.rootNodeId;

  return {
    rootNodeId,
    nodes: newNodes,
    originalRootId: createLinks ? originalRootId : null, // Include original ID if linking
  };
};
export type Position = "top" | "bottom" | "left" | "right";
export type Align = "start" | "middle" | "end";
