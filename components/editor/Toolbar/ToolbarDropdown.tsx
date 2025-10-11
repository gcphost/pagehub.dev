import { v4 as uuidv4 } from "uuid";

const Label = ({ value }) => <label>{value}</label>;

export const ToolbarDropdown = ({
  title,
  value,
  onChange,
  children,
  placeholder,
  valueLabels = [],
  wrap = null,
  append,
}: any) => {
  if (!children) {
    const res = [];
    res.push(
      <option value="" key={valueLabels.length}>
        None
      </option>,
    );

    res.push(...valueLabels.map((_) => <option key={uuidv4()}>{_}</option>));

    children = res;
  }

  return (
    <>
      {title && (
        <div className="mb-2 block">
          <Label value={title} />
        </div>
      )}

      {wrap === "control" ? (
        // Control mode - no background wrapper
        <div className="flex w-full items-center gap-2">
          <select
            className="input-plain flex-1 focus:border-transparent focus:outline-none active:border-transparent active:outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onMouseDown={() => {
              // Blur any focused contentEditable element BEFORE dropdown opens
              const activeEl = document.activeElement as HTMLElement;
              if (activeEl && activeEl.contentEditable === "true") {
                activeEl.blur();
              }
            }}
            aria-label={title || placeholder || "Select option"}
          >
            {children}
          </select>
          {append && (
            <div className="flex shrink-0 items-center gap-0.5">{append}</div>
          )}
        </div>
      ) : (
        // Default mode - wrap in BgWrap
        <div className="input-wrapper flex w-full items-center gap-2">
          <select
            className="input-plain flex-1 focus:border-transparent focus:outline-none active:border-transparent active:outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onMouseDown={() => {
              // Blur any focused contentEditable element BEFORE dropdown opens
              const activeEl = document.activeElement as HTMLElement;
              if (activeEl && activeEl.contentEditable === "true") {
                activeEl.blur();
              }
            }}
            aria-label={title || placeholder || "Select option"}
          >
            {children}
          </select>
          {append && (
            <div className="flex shrink-0 items-center gap-0.5">{append}</div>
          )}
        </div>
      )}
    </>
  );
};
