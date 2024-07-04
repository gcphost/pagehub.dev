import { useState } from "react";

const DragTable = () => {
  const [numRows, setNumRows] = useState(3);
  const [numCols, setNumCols] = useState(3);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [dragDirection, setDragDirection] = useState(null);

  const handleMouseDown = (event) => {
    setDragging(true);
    setStartX(event.clientX);
    setStartY(event.clientY);
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragDirection(null);
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      if (!dragDirection) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          setDragDirection("horizontal");
        } else {
          setDragDirection("vertical");
        }
      }
      if (dragDirection === "horizontal") {
        if (deltaX > 50) {
          setNumCols(numCols + 1);
          setStartX(event.clientX);
        } else if (deltaX < -50) {
          setNumCols(Math.max(numCols - 1, 1));
          setStartX(event.clientX);
        }
      } else if (dragDirection === "vertical") {
        if (deltaY > 50) {
          setNumRows(numRows + 1);
          setStartY(event.clientY);
        } else if (deltaY < -50) {
          setNumRows(Math.max(numRows - 1, 1));
          setStartY(event.clientY);
        }
      } else if (dragDirection === "diagonal") {
        if (deltaX > 50 && deltaY > 50) {
          setNumCols(numCols + 1);
          setNumRows(numRows + 1);
          setStartX(event.clientX);
          setStartY(event.clientY);
        } else if (deltaX < -50 && deltaY < -50) {
          setNumCols(Math.max(numCols - 1, 1));
          setNumRows(Math.max(numRows - 1, 1));
          setStartX(event.clientX);
          setStartY(event.clientY);
        }
      }
      if (Math.abs(deltaX) > 50 && Math.abs(deltaY) > 50) {
        setDragDirection("diagonal");
      }
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="table border"
    >
      {Array(numRows)
        .fill(null)
        .map((_, rowIndex) => (
          <div key={rowIndex} className="table-row border">
            {Array(numCols)
              .fill(null)
              .map((_, colIndex) => (
                <div key={colIndex} className="table-cell border">
                  Cell ({rowIndex}, {colIndex})
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

export default DragTable;
