export const ParseTree = ({ tree }) => {
  if (!tree) return null;

  const getval = (val) => {
    const to = typeof val;

    if (to === "string") return val;

    if (to === "boolean") return val ? "true" : "false";

    if (to === "object") return <ParseTree tree={val} />;

    return to;
  };

  return (
    <>
      {Object.keys(tree).map((key) => {
        const to = typeof tree[key];
        return (
          <div
            key={key}
            className={`flex gap-3 p-1.5 ${
              to === "object" ? "flex-col" : "flex-row justify-between"
            }`}
          >
            <div className="font-bold">{key}:</div>
            <div
              className={`${
                to === "object"
                  ? "p1.5 ml-3 w-full rounded-md border border-border"
                  : ""
              }`}
            >
              {getval(tree[key])}
            </div>
          </div>
        );
      })}
    </>
  );
};
