const Label = ({ value }) => {
  return <label>{value}</label>;
};

export const ToolbarDropdown = ({
  title,
  value,
  onChange,
  children,
  placeholder,
  valueLabels = [],
  wrap = null,
}: any) => {
  if (!children) {
    const res = [];
    res.push(
      <option value="" key={valueLabels.length}>
        None
      </option>
    );

    res.push(...valueLabels.map((_, k) => <option key={k}>{_}</option>));

    children = res;
  }

  return (
    <>
      {title && (
        <div className="mb-2 block">
          <Label value={title} />
        </div>
      )}

      <select
        className={`${
          wrap || "input"
        } active:outline-none focus:outline-none focus:border-transparent active:border-transparent`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </>
  );
};
