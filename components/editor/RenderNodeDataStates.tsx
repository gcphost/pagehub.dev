import { useEditor, useNode } from '@craftjs/core';
import { useEffect } from 'react';

export const RenderNodeDataStates = () => {
  const {
    isHover, name, dom, id
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
  }));

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const { isActive } = useEditor((_, query) => ({
    isActive: query.getEvent('selected').contains(id),
  }));

  useEffect(() => {
    if (!dom) return;

    dom.setAttribute('data-enabled', 'true');

    if (dom && name !== 'Background') {
      if (isActive) {
        dom.setAttribute('data-selected', 'true');
      } else {
        dom.removeAttribute('data-selected');
      }

      if (isHover) dom.setAttribute('data-hover', 'true');
      else dom.removeAttribute('data-hover');
    }
  }, [isActive, isHover, enabled]);

  return null;
};
