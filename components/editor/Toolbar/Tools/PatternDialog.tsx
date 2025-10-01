import { useEffect, useMemo, useRef, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { atom, useRecoilState } from "recoil";
import { generatePattern } from "utils/lib";
import { Dialog } from "./Dialog";

export const PatternDialogAtom = atom({
  key: "patternDialog",
  default: {
    enabled: false,
    prefix: "",
    changed: null,
    e: null,
  } as any,
});

export const PatternDialog = () => {
  const [dialog, setDialog] = useRecoilState(PatternDialogAtom);
  const [patterns, setPatterns] = useState([]);
  const [category, setCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    fetch("/api/patterns", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then((res) => {
      res.json().then((re) => {
        setPatterns(re);
      });
    });
  }, []);

  const changed = (value) => {
    if (dialog.changed) {
      setDialog({ ...dialog, value, enabled: false });
      dialog.changed(value);
    }
  };

  // Get unique categories from tags
  const categories = useMemo(() => {
    const allTags = new Set<string>();
    patterns.forEach((p) => {
      if (p.tags && p.tags.length > 0) {
        p.tags.forEach((tag) => allTags.add(tag));
      }
    });
    return ["all", "stroke", "fill", ...Array.from(allTags).sort()].slice(0, 10); // Limit to 10 categories
  }, [patterns]);

  const filteredPatterns = useMemo(() => {
    let filtered = patterns;

    // Filter by category
    if (category !== "all") {
      if (category === "stroke" || category === "fill") {
        filtered = filtered.filter((p) => p.mode === category);
      } else {
        filtered = filtered.filter((p) => p.tags && p.tags.includes(category));
      }
    }

    // Filter by search
    if (searchValue) {
      filtered = filtered.filter((p) =>
        p.title.search(
          new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
        ) > -1
      );
    }

    return filtered;
  }, [patterns, category, searchValue]);

  const handleSearch = (value) => {
    setSearchValue(value);
    if (listRef.current) {
      listRef.current.scrollTo(0);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    if (listRef.current) {
      listRef.current.scrollTo(0);
    }
  };

  // List configuration
  const containerWidth = 400;
  const containerHeight = 400;
  const itemHeight = 50;

  const Row = ({ index, style }) => {
    const pattern = filteredPatterns[index];
    const patt = generatePattern({
      root: {
        pattern,
        patternVerticalPosition: 0,
        patternHorizontalPosition: 0,
        patternStroke: 1,
        patternZoom: 0,
        patternAngle: 0,
        patternSpacingX: 0,
        patternSpacingY: 0,
        patternColor1: "rgba(0,0,0,100)",
        patternColor2: "rgba(0,0,0,100)",
        patternColor3: "rgba(0,0,0,100)",
        patternColor4: "rgba(0,0,0,100)",
      },
    });

    return (
      <div style={style}>
        <button
          id={`pattern-${pattern.slug}`}
          className={`w-full flex flex-row cursor-pointer hover:bg-gray-100 p-2 rounded-md ${dialog.value?.slug === pattern.slug ? "bg-gray-100" : ""
            }`}
          onClick={(e) => changed(pattern)}
        >
          <div className="pointer-events-none flex gap-3 items-center h-6 w-full justify-between">
            <div className="w-1/2 truncate whitespace-nowrap text-sm">
              {pattern.title}
            </div>
            <div
              className="w-1/2 h-full border border-gray-500 bg-white/50 rounded-lg"
              style={{
                backgroundImage: patt ? `url(${patt})` : null,
              }}
            ></div>
          </div>
        </button>
      </div>
    );
  };

  return (
    <Dialog
      dialogAtom={PatternDialogAtom}
      dialogName="pattern"
      value={dialog?.value?.slug}
      items={filteredPatterns}
      height={containerHeight + 120}
      width={containerWidth}
      customOnSearch={handleSearch}
      customRenderer={
        <div className="flex flex-col h-full overflow-hidden">
          {/* Category Tabs - Scrollable with max height */}
          <div className="flex-shrink-0 max-h-20 overflow-y-auto scrollbar mb-2">
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-2.5 py-1 rounded text-xs font-medium ${category === cat
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Count */}
          <div className="flex-shrink-0 text-xs text-gray-500 mb-2">
            {filteredPatterns.length} pattern
            {filteredPatterns.length !== 1 ? "s" : ""}
          </div>

          {/* Virtualized List - Takes remaining space, scrolls independently */}
          <div className="flex-1 min-h-0 overflow-hidden -mx-3 px-3">
            <List
              ref={listRef}
              height={containerHeight}
              itemCount={filteredPatterns.length}
              itemSize={itemHeight}
              width={containerWidth - 24}
              className="scrollbar"
            >
              {Row}
            </List>
          </div>
        </div>
      }
    />
  );
};
