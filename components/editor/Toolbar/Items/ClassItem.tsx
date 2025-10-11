import { useEditor, useNode } from "@craftjs/core";
import { ViewAtom } from "components/editor/Viewport";
import { changeProp } from "components/editor/Viewport/lib";
import { RootClassGenProps } from "components/selectors";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { useRecoilValue } from "recoil";
import { AllStyles, classNameToVar } from "utils/tailwind";

import { ToolbarItemProps } from "../ToolbarItem";
import { Card, CardLight, Wrap } from "../ToolbarStyle";

const Input = ({ value, changed, nodeProps, setProp }) => {
  const classes = Array.isArray(value) ? value : [];
  const [classInput, setClassInput] = useState("");

  // Define conflicting class groups
  const conflictGroups = {
    flex: ["flex-row", "flex-row-reverse", "flex-col", "flex-col-reverse"],
    justify: [
      "justify-start",
      "justify-end",
      "justify-center",
      "justify-between",
      "justify-around",
      "justify-evenly",
    ],
    items: [
      "items-start",
      "items-end",
      "items-center",
      "items-baseline",
      "items-stretch",
    ],
    text: ["text-left", "text-center", "text-right", "text-justify"],
    float: ["float-left", "float-right", "float-none"],
    clear: ["clear-left", "clear-right", "clear-both", "clear-none"],
    display: [
      "block",
      "inline-block",
      "inline",
      "flex",
      "inline-flex",
      "table",
      "inline-table",
      "table-caption",
      "table-cell",
      "table-column",
      "table-column-group",
      "table-footer-group",
      "table-header-group",
      "table-row-group",
      "table-row",
      "flow-root",
      "grid",
      "inline-grid",
      "contents",
      "list-item",
      "hidden",
    ],
    position: ["static", "fixed", "absolute", "relative", "sticky"],
    overflow: [
      "overflow-auto",
      "overflow-hidden",
      "overflow-clip",
      "overflow-visible",
      "overflow-scroll",
    ],
    whitespace: [
      "whitespace-normal",
      "whitespace-nowrap",
      "whitespace-pre",
      "whitespace-pre-line",
      "whitespace-pre-wrap",
      "whitespace-break-spaces",
    ],
  };

  const removeConflictingClasses = (newClass, existingClasses) => {
    // Find which conflict group the new class belongs to
    const conflictGroup = Object.values(conflictGroups).find((group) =>
      group.includes(newClass),
    );

    if (!conflictGroup) {
      return existingClasses; // No conflicts to remove
    }

    // Remove any existing classes from the same conflict group
    return existingClasses.filter((cls) => !conflictGroup.includes(cls));
  };

  const save = (input = null) => {
    const data = (input || classInput)
      .split(" ")
      .filter((_) => !classes.includes(_));

    if (!data.length) return;

    // Separate responsive classes from regular classes
    const responsiveClasses = data.filter((cls) =>
      breakpoints.some((bp) => cls.startsWith(bp)),
    );
    const regularClasses = data.filter(
      (cls) => !breakpoints.some((bp) => cls.startsWith(bp)),
    );

    // Handle responsive classes
    responsiveClasses.forEach((cls) => {
      if (cls.startsWith("sm:")) {
        // sm: classes go to mobile
        const baseClass = cls.substring(3); // Remove 'sm:' prefix

        // Get current mobile classes and remove conflicts
        const currentMobileClasses = Object.keys(nodeProps.mobile || {})
          .filter((key) => nodeProps.mobile[key] === nodeProps.mobile[key])
          .map((key) => nodeProps.mobile[key]);

        const cleanedMobileClasses = removeConflictingClasses(
          baseClass,
          currentMobileClasses,
        );

        // Remove conflicting classes from mobile
        cleanedMobileClasses.forEach((conflictClass) => {
          changeProp({
            propKey: conflictClass,
            value: "",
            setProp,
            view: "mobile",
            propType: "class",
          });
        });

        // Add the new class
        changeProp({
          propKey: baseClass,
          value: baseClass,
          setProp,
          view: "mobile",
          propType: "class",
        });
      } else if (
        cls.startsWith("md:") ||
        cls.startsWith("lg:") ||
        cls.startsWith("xl:") ||
        cls.startsWith("2xl:")
      ) {
        // md: and larger go to desktop
        const baseClass = cls.substring(cls.indexOf(":") + 1); // Remove prefix

        // Get current desktop classes and remove conflicts
        const currentDesktopClasses = Object.keys(nodeProps.desktop || {})
          .filter((key) => nodeProps.desktop[key] === nodeProps.desktop[key])
          .map((key) => nodeProps.desktop[key]);

        const cleanedDesktopClasses = removeConflictingClasses(
          baseClass,
          currentDesktopClasses,
        );

        // Remove conflicting classes from desktop
        cleanedDesktopClasses.forEach((conflictClass) => {
          changeProp({
            propKey: conflictClass,
            value: "",
            setProp,
            view: "desktop",
            propType: "class",
          });
        });

        // Add the new class
        changeProp({
          propKey: baseClass,
          value: baseClass,
          setProp,
          view: "desktop",
          propType: "class",
        });
      }
    });

    // Handle regular classes (add to main classes array)
    if (regularClasses.length > 0) {
      const cl = [...(classes || [])];

      // Remove conflicts for each new class
      regularClasses.forEach((newClass) => {
        const cleanedClasses = removeConflictingClasses(newClass, cl);
        cl.length = 0; // Clear array
        cl.push(...cleanedClasses); // Add cleaned classes
        cl.push(newClass); // Add new class
      });

      changed(cl);
    }

    setClassInput("");
  };

  const del = (key) => {
    const cl = [...(classes || [])];

    delete cl[key];

    changed(cl);
  };

  const [matches, setMatches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Tailwind responsive breakpoints
  const breakpoints = ["sm:", "md:", "lg:", "xl:", "2xl:"];

  useEffect(() => {
    if (classInput.length < 2) return;

    // Check if input contains a responsive prefix
    const hasBreakpoint = breakpoints.some((bp) => classInput.startsWith(bp));

    let searchTerm = classInput;
    let responsiveMatches = [];

    if (hasBreakpoint) {
      // Extract the breakpoint and class
      const breakpoint = breakpoints.find((bp) => classInput.startsWith(bp));
      const classAfterBreakpoint = classInput.substring(breakpoint.length);

      // Find matches for the class after the breakpoint
      const baseMatches = AllStyles.filter((s) =>
        s?.includes(classAfterBreakpoint),
      );

      // Create responsive versions
      responsiveMatches = baseMatches.map((cls) => `${breakpoint}${cls}`);
    } else {
      // Regular search + generate responsive suggestions
      const baseMatches = AllStyles.filter((s) => s?.includes(classInput));

      // Add responsive versions for the first few matches
      responsiveMatches = baseMatches
        .slice(0, 5)
        .flatMap((cls) => breakpoints.map((bp) => `${bp}${cls}`));

      // Combine base matches with responsive suggestions
      responsiveMatches = [...baseMatches, ...responsiveMatches];
    }

    const matches = responsiveMatches
      .filter((item) => !classes?.includes(item))
      .slice(0, 4);

    setMatches(matches);
    setSelectedIndex(0); // Reset selection when matches change
  }, [classInput, classes]);

  const searched = !!(classInput && matches.length);

  const _nodeProps = nodeProps ? { ...nodeProps } : {};

  const delNodeProp = (prop, view) => {
    Object.keys(nodeProps[view])
      .filter((_) => nodeProps[view][_] === prop)
      .forEach((_) =>
        changeProp({
          propKey: _,
          value: "",
          setProp,
          view,
          propType: view === "root" ? "root" : "class",
        }),
      );
  };

  const propClasses = Object.keys(_nodeProps.root || {})
    .filter((_) => _ !== "style")
    .filter((_) => !classes?.includes(_))
    .filter((_) => _ !== "hover")
    .filter((_) => RootClassGenProps.includes(_))
    .map((_) => _nodeProps.root[_]);

  const mobileClasses = Object.keys(_nodeProps.mobile || {})
    .filter((_) => !classes?.includes(_))
    .filter((_) => _ !== "hover")
    .map((_) => _nodeProps.mobile[_]);

  const desktopClasses = Object.keys(_nodeProps.desktop || {})
    .filter((_) => !classes?.includes(_))
    .filter((_) => _ !== "hover")
    .map((_) => _nodeProps.desktop[_]);

  return (
    <div className="relative z-10 flex flex-col gap-6">
      <label
        htmlFor="search"
        className="sr-only text-sm font-medium text-foreground"
      >
        Search
      </label>
      <div className="input-wrapper relative">
        <input
          type="search"
          id="search"
          className="input-plain h-7"
          placeholder="Class Search"
          required
          autoComplete="off"
          onChange={(event) => setClassInput(event.target.value)}
          onKeyDown={(e) => {
            // Tab completion
            if (e.key === "Tab" && matches.length > 0) {
              e.preventDefault();

              // Check if current input has a responsive prefix
              const hasBreakpoint = breakpoints.some((bp) =>
                classInput.startsWith(bp),
              );

              if (hasBreakpoint) {
                // If we're typing with a prefix, complete with the first responsive match
                const responsiveMatch = matches.find((match) =>
                  match.startsWith(classInput.split(":")[0] + ":"),
                );
                setClassInput(responsiveMatch || matches[0]);
              } else {
                // Regular completion
                setClassInput(matches[0]);
              }
            }

            // Arrow key navigation
            if (e.key === "ArrowDown" && matches.length > 0) {
              e.preventDefault();
              setSelectedIndex((prev) =>
                Math.min(prev + 1, matches.length - 1),
              );
            }

            if (e.key === "ArrowUp" && matches.length > 0) {
              e.preventDefault();
              setSelectedIndex((prev) => Math.max(prev - 1, 0));
            }

            // Enter to select highlighted item (only if there's a selection)
            if (e.key === "Enter" && matches.length > 0 && selectedIndex >= 0 && selectedIndex !== 0) {
              e.preventDefault();
              setClassInput(matches[selectedIndex]);
            }
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              save();
            }
          }}
          value={classInput}
        />
        {/* Ghost text suggestion - behind input */}
        {classInput?.length > 0 &&
          matches.length > 0 &&
          matches[0].startsWith(classInput) && (
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center px-3">
              <span className="invisible">{classInput}</span>
              <span className="font-mono text-muted-foreground">
                {matches[0].slice(classInput.length)}
              </span>
            </div>
          )}
        <button type="submit" className="btn-search" onClick={() => save()}>
          <TbSearch />
        </button>
      </div>

      {searched && (
        <div className="absolute top-10 w-full overflow-hidden rounded-md border border-border bg-muted text-muted-foreground">
          <div className="scrollbar flex max-h-60 w-full flex-wrap gap-2 overflow-auto p-2">
            {matches.map((mat, k) => (
              <CardLight
                key={k}
                value={mat}
                onClick={() => save(mat)}
                className={
                  k === selectedIndex
                    ? "rounded-md bg-accent text-accent-foreground ring-2 ring-accent"
                    : ""
                }
              />
            ))}
          </div>
          {matches.length > 0 && (
            <div className="mt-2 border-t border-border bg-primary p-2 text-xs text-muted-foreground">
              <div className="flex flex-wrap gap-1">
                <span>
                  Press{" "}
                  <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                    Tab
                  </kbd>{" "}
                  to complete
                </span>
                <span>
                  Use{" "}
                  <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                    ↑↓
                  </kbd>{" "}
                  to navigate
                </span>
                <span>
                  Press{" "}
                  <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                    Enter
                  </kbd>{" "}
                  to select
                </span>
              </div>
              <div className="mt-1">
                Use{" "}
                <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                  sm:
                </kbd>{" "}
                for mobile,{" "}
                <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                  md:
                </kbd>
                ,{" "}
                <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                  lg:
                </kbd>
                ,{" "}
                <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                  xl:
                </kbd>
                ,{" "}
                <kbd className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                  2xl:
                </kbd>{" "}
                for desktop
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex w-full items-center justify-between border-b border-border pb-1.5 ">
        <p className="text-xs">Assigned Classes</p>

        <div className="flex gap-1 text-foreground">
          <div className="text-xxs inline-flex rounded bg-primary px-0.5 text-primary-foreground">
            Component
          </div>
          <div className="text-xxs inline-flex rounded bg-background px-0.5 text-foreground">
            User
          </div>
          <div className="text-xxs inline-flex rounded bg-secondary px-0.5 text-secondary-foreground">
            Mobile
          </div>
          <div className="text-xxs inline-flex rounded bg-accent px-0.5 text-accent-foreground">
            Desktop
          </div>
        </div>
      </div>

      <div className="-mt-3 flex flex-wrap gap-1.5">
        {propClasses?.map((_, key) => (
          <Card key={key} value={_} onClick={() => delNodeProp(_, "root")} />
        ))}

        {classes?.map((_, key) => (
          <Card
            key={key}
            value={_}
            onClick={() => del(key)}
            bgColor="bg-background text-foreground"
          />
        ))}

        {mobileClasses?.map((_, key) => (
          <Card
            key={key}
            value={_}
            onClick={() => delNodeProp(_, "mobile")}
            bgColor="bg-secondary text-secondary-foreground"
          />
        ))}

        {desktopClasses?.map((_, key) => (
          <Card
            key={key}
            value={_}
            onClick={() => delNodeProp(_, "desktop")}
            bgColor="bg-accent text-accent-foreground"
          />
        ))}
      </div>
    </div>
  );
};

export const ClassItem = ({
  full = false,
  propKey,
  ...props
}: ToolbarItemProps) => {
  const {
    actions: { setProp },
    nodeProps,
    id,
  } = useNode((node) => ({
    nodeProps: node.data.props,
    id: node.id,
  }));

  const { query, actions } = useEditor();
  const propValue = (nodeProps || {})[propKey];
  const view = useRecoilValue(ViewAtom);

  const value = propValue;

  const changed = (va) => {
    const remaining = [];

    if (!va.filter((_) => _).length) {
      return changeProp({
        propKey: "className",
        value: [],
        setProp,
        propType: "component",
        query,
        actions,
        nodeId: id,
      });
    }

    va.forEach((value) => {
      const propKey = classNameToVar(value);

      if (propKey) {
        return changeProp({
          propKey,
          value,
          setProp,
          propType: "class",
          view,
          query,
          actions,
          nodeId: id,
        });
      }

      remaining.push(value);
    });

    if (remaining.length) {
      changeProp({
        propKey,
        value: remaining.filter((_) => _),
        setProp,
        propType: "component",
        query,
        actions,
        nodeId: id,
      });
    }
  };

  let lab = value;

  if (props.valueLabels && props.valueLabels[value]) {
    lab = props.valueLabels[value];
  }

  return (
    <Wrap props={props} lab={lab} propKey={propKey}>
      <Input
        nodeProps={{ ...nodeProps }}
        value={value}
        changed={changed}
        setProp={setProp}
      />
    </Wrap>
  );
};
