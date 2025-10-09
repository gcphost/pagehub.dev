import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { fetchGoogleFonts, getFunkyFonts, getPopularFonts, loadGoogleFont } from "utils/googleFonts";
import { fonts } from "utils/tailwind";
import { Dialog } from "./Dialog";

export const FontFamilyDialogAtom = atom({
  key: "fontFamily",
  default: {
    enabled: false,
    prefix: "",
    changed: null,
    e: null,
  } as any,
});

export const FontFamilyDialog = () => {
  const [dialog, setDialog] = useRecoilState(FontFamilyDialogAtom);
  const [allFonts, setAllFonts] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all Google Fonts on mount
  useEffect(() => {
    const loadFonts = async () => {
      try {
        setLoading(true);

        // Fetch all fonts from Google Fonts API
        const googleFonts = await fetchGoogleFonts();

        // Convert to array format for compatibility: [["Font Name"]]
        const popularFonts = getPopularFonts();
        const funkyFonts = getFunkyFonts();

        // Organize fonts: Popular first, then Funky, then all others alphabetically
        const popularList = popularFonts.map(f => [f]);
        const funkyList = funkyFonts.filter(f => !popularFonts.includes(f)).map(f => [f]);
        const otherFonts = googleFonts
          .filter(f => !popularFonts.includes(f.family) && !funkyFonts.includes(f.family))
          .map(f => [f.family])
          .sort((a, b) => a[0].localeCompare(b[0]));

        const allFontsList = [...popularList, ...funkyList, ...otherFonts];
        setAllFonts(allFontsList);
      } catch (error) {
        console.error("Error loading fonts:", error);
        // Fallback to legacy fonts
        setAllFonts(fonts);
      } finally {
        setLoading(false);
      }
    };

    loadFonts();
  }, []);

  const changed = (value) => {
    if (!dialog.changed) return;

    // Lazy load the selected font
    if (value && value[0]) {
      loadGoogleFont(value[0], ["400", "700"]);
    }

    setDialog({ ...dialog, value, enabled: false });
    dialog.changed(value);
  };

  // Show loading state while fetching
  if (loading) {
    return (
      <Dialog
        dialogAtom={FontFamilyDialogAtom}
        dialogName="fontFamily"
        value={dialog.value}
        items={fonts} // Use legacy fonts during loading
        onSearch={(_, value) =>
          _[0].search(
            new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
          ) > -1
        }
        callback={(_, k) => (
          <button
            id={`fontFamily-${_}`}
            className={`w-full flex flex-row cursor-pointer hover:bg-gray-100 p-3 rounded-md  md:text-xl ${dialog.value === _ ? "bg-gray-100" : ""
              }`}
            style={{ fontFamily: (_ || []).join(", ") }}
            key={k}
            onClick={(e) => changed(_)}
          >
            {_.join(", ")}
          </button>
        )}
      />
    );
  }

  return (
    <Dialog
      dialogAtom={FontFamilyDialogAtom}
      dialogName="fontFamily"
      value={dialog.value}
      items={allFonts}
      onSearch={(_, value) =>
        _[0].search(
          new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
        ) > -1
      }
      callback={(_, k) => (
        <button
          id={`fontFamily-${_}`}
          className={`w-full flex flex-row cursor-pointer hover:bg-gray-100 p-3 rounded-md  md:text-xl ${dialog.value === _ ? "bg-gray-100" : ""
            }`}
          style={{ fontFamily: (_ || []).join(", ") }}
          key={k}
          onClick={(e) => changed(_)}
          onMouseEnter={() => {
            // Preload font on hover for instant preview
            if (_[0]) loadGoogleFont(_[0], ["400"]);
          }}
        >
          {_.join(", ")}
        </button>
      )}
    />
  );
};
