import { useEditor } from "@craftjs/core";
import { useRef, useState } from "react";
import { ParseTree } from "../Toolbar/Helpers/ParseTree";

export default function DebugPanel() {
  const { state, query } = useEditor((state, query) => ({ state }));

  const active = query.getEvent("selected").first();

  const theNode = active ? query.node(active).get() : null;

  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setDragStart({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const parentRect = divRef.current.parentNode.getBoundingClientRect();
      const divRect = divRef.current.getBoundingClientRect();
      const x = event.clientX - dragStart.x - parentRect.left;
      const y = event.clientY - dragStart.y - parentRect.top;
      setPosition({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  if (!active) return null;

  return (
    <button
      ref={divRef}
      className="flex flex-col gap-3 p-1.5 z-50 h-1/2 w-1/3 overflow-auto scrollbar absolute top-3 right-3 bg-white rounded-xl"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: "move",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      tabIndex={0}
    >
      <div>
        <ParseTree tree={theNode.data} />
      </div>
    </button>
  );
}
