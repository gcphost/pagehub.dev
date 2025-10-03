import { useEffect, useState } from "react";

export function useMousePosition(id, distance = 45, cref = null) {
  const dom = cref || document.querySelector(`[node-id="${id}"]`);

  const [isInTopOrLeft, setIsInTopOrLeft] = useState(false);
  const [isInBottomOrRight, setIsInBottomOrRight] = useState(false);
  const [isInTopOrLeftOrBottomOrRight, setIsInTopOrLeftOrBottomOrRight] =
    useState(false);
  const [isNearTop, setIsNearTop] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [isNearLeft, setIsNearLeft] = useState(false);
  const [isNearRight, setIsNearRight] = useState(false);

  useEffect(() => {
    if (!dom) return;

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;

      const { top, bottom, left, right } = dom.getBoundingClientRect();

      setIsInTopOrLeft(Math.abs(clientY - top) <= distance);
      setIsInBottomOrRight(Math.abs(clientY - bottom) <= distance);
      setIsInTopOrLeftOrBottomOrRight(
        clientX < left + distance || clientX > right - distance
      );

      // Individual edge detection
      setIsNearTop(Math.abs(clientY - top) <= distance);
      setIsNearBottom(Math.abs(clientY - bottom) <= distance);
      setIsNearLeft(Math.abs(clientX - left) <= distance);
      setIsNearRight(Math.abs(clientX - right) <= distance);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [distance, dom]);

  return {
    isInTopOrLeft,
    isInBottomOrRight,
    isInTopOrLeftOrBottomOrRight,
    isNearTop,
    isNearBottom,
    isNearLeft,
    isNearRight,
    cref,
  };
}

export function useIsMouseOver(id) {
  const dom = document.querySelector(`[node-id="${id}"]`);
  const [isMouseOver, setIsMouseOver] = useState(false);

  useEffect(() => {
    const handleMouseOver = () => {
      setIsMouseOver(true);
    };

    const handleMouseOut = () => {
      setIsMouseOver(false);
    };

    dom.addEventListener("mouseover", handleMouseOver);
    dom.addEventListener("mouseout", handleMouseOut);

    return () => {
      dom.removeEventListener("mouseover", handleMouseOver);
      dom.removeEventListener("mouseout", handleMouseOut);
    };
  }, [dom]);

  return isMouseOver;
}
