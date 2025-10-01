import React from "react";

export const ClientIconLoader = ({ value }) => {
  // TMP legacy
  if (!value || value.startsWith("Fa")) {
    return null;
  }

  return React.createElement("svg", {
    dangerouslySetInnerHTML: { __html: value },
    fill: "currentColor",
    width: "100%",
    height: "100%",
    viewBox: "0 0 24 24",
  });
};
export default ClientIconLoader;
