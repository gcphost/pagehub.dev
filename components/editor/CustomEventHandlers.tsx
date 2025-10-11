import { DefaultEventHandlers, NodeId } from "@craftjs/core";

export default class CustomEventHandlers extends DefaultEventHandlers {
  handlers() {
    const defaultEventHandlers = super.handlers();
    const {
      store: { query },
    } = this.options;

    return {
      ...defaultEventHandlers,
      drag: (el: HTMLElement, id: NodeId) => {
        if (!query.node(id)?.isDraggable()) return () => {};

        const unbindDefaultDragHandlers = defaultEventHandlers.drag(el, id);

        // Customize drag start to show custom drag preview
        const unbindDragStart = this.addCraftEventListener(
          el,
          "dragstart",
          (e) => {
            // The event is already the native event in Craft.js
            const nativeEvent = (e as any).nativeEvent || e;

            if (nativeEvent.dataTransfer) {
              // Clone the element for drag preview
              const preview = el.cloneNode(true) as HTMLElement;
              preview.style.position = "absolute";
              preview.style.top = "-9999px";
              preview.style.left = "-9999px";
              preview.style.opacity = "0.7";
              preview.style.pointerEvents = "none";
              preview.style.zIndex = "9999";

              // Append to body temporarily
              document.body.appendChild(preview);

              // Calculate offset based on where user clicked relative to element
              const rect = el.getBoundingClientRect();
              const offsetX = nativeEvent.clientX - rect.left;
              const offsetY = nativeEvent.clientY - rect.top;

              // Set the custom drag image with proper offset
              nativeEvent.dataTransfer.setDragImage(preview, offsetX, offsetY);
              nativeEvent.dataTransfer.effectAllowed = "move";

              // Remove the preview element after a short delay (after browser captures it)
              setTimeout(() => {
                if (preview.parentNode) {
                  document.body.removeChild(preview);
                }
              }, 0);
            }

            // Mark element as dragging and add body class for CSS to handle
            el.setAttribute("data-dragging", "true");
            document.body.setAttribute("data-is-dragging", "true");
          },
        );

        // Reset on drag end
        const unbindDragEnd = this.addCraftEventListener(el, "dragend", (e) => {
          el.removeAttribute("data-dragging");
          document.body.removeAttribute("data-is-dragging");
        });

        return () => {
          el.setAttribute("draggable", "false");
          unbindDefaultDragHandlers();
          unbindDragStart();
          unbindDragEnd();
        };
      },
    };
  }
}
