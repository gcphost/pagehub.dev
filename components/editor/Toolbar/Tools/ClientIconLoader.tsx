import React from "react";

export const ClientIconLoader = ({ value }) => {
  // TMP legacy
  if (!value || value.startsWith("Fa")) {
    return null;
  }

  return React.createElement("svg", {
    dangerouslySetInnerHTML: { __html: value },
    fill: "currentColor",
  });
};
export default ClientIconLoader;
