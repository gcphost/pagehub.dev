import { useEffect, useRef, useState } from "react";

export function VisibleArray({ items, height = "400px" }) {
  const [visibleItems, setVisibleItems] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateVisibleItems = () => {
        const containerRect = container.getBoundingClientRect();
        const visibleTop = containerRect.top;
        const visibleBottom = containerRect.bottom;
        const newVisibleItems = items.filter((_, index) => {
          const item = container.children[index];
          if (item) {
            const itemRect = item.getBoundingClientRect();
            const itemTop = itemRect.top;
            const itemBottom = itemRect.bottom;
            return itemTop < visibleBottom && itemBottom > visibleTop;
          }
        });
        setVisibleItems(newVisibleItems);
      };
      updateVisibleItems();
      container.addEventListener("scroll", updateVisibleItems);
      return () => container.removeEventListener("scroll", updateVisibleItems);
    }
  }, [items]);

  return (
    <div ref={containerRef} style={{ height, overflow: "scroll" }}>
      {visibleItems.map((item) => (
        <div key={item.id}>
          {/* Render the contents of each item */}
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export default VisibleArray;
