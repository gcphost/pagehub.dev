export function getColors(dom, props) {
  let color;

  if (props?.root?.background && props?.root?.color) {
    return { background: props.root.background, basecolor: props.root.color };
  }

  if (dom) {
    const domstyl = window.getComputedStyle(dom);
    color = domstyl;
  }

  let basecolor;
  let background;

  if (color) {
    let _color = color.getPropertyValue("color");

    let bg = "";
    const base = "";

    const myElement = dom;
    let currentElement = myElement;
    while (currentElement && currentElement.tagName !== "BODY") {
      const style = window.getComputedStyle(currentElement);

      const backgroundColor = style.getPropertyValue("background-color");
      if (backgroundColor !== "rgba(0, 0, 0, 0)") {
        bg = backgroundColor;
        if (!_color) _color = style.getPropertyValue("color");
        break;
      }
      currentElement = currentElement.parentElement;
    }

    background = bg.replace(/\s/g, "");

    if (!_color) {
      basecolor = props?.root?.color
        ? `${props?.root?.color} border-${props?.root?.color.split("text-")[1]}`
        : "text-foreground border-foreground";
    }

    if (_color) {
      if (_color.replace(/\s/g, "") == background.replace(/\s/g, "")) {
        _color = invertColor(_color);
      }
      basecolor = `text-[${_color.replace(/\s/g, "")}] border-[${_color.replace(
        /\s/g,
        ""
      )}]`;
    }
  }

  if (background) {
    background = background
      ? `bg-[${background}]`
      : props?.root?.background
        ? props.root.background
        : "";
  }

  return { background, basecolor };
}

export function invertColor(color: string): string {
  let invertedColor = "";

  // Check if color is in RGB format
  const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (rgbMatch) {
    const r = 255 - parseInt(rgbMatch[1], 10);
    const g = 255 - parseInt(rgbMatch[2], 10);
    const b = 255 - parseInt(rgbMatch[3], 10);
    invertedColor = `rgb(${r}, ${g}, ${b})`;
  }

  // Check if color is in RGBA format
  const rgbaMatch = color.match(
    /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)$/
  );
  if (rgbaMatch) {
    const r = 255 - parseInt(rgbaMatch[1], 10);
    const g = 255 - parseInt(rgbaMatch[2], 10);
    const b = 255 - parseInt(rgbaMatch[3], 10);
    const a = parseFloat(rgbaMatch[4]);
    invertedColor = `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // Check if color is in HEX format
  const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (hexMatch) {
    const r = 255 - parseInt(hexMatch[1], 16);
    const g = 255 - parseInt(hexMatch[2], 16);
    const b = 255 - parseInt(hexMatch[3], 16);
    invertedColor = `#${((r << 16) | (g << 8) | b)
      .toString(16)
      .padStart(6, "0")}`;
  }

  return invertedColor;
}
