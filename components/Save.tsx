import { UnsavedChangesAtom } from "components/editor/Viewport";
import { SaveToServer } from "components/editor/Viewport/lib";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SessionTokenAtom, SettingsAtom } from "utils/atoms";

export const Save = ({ result }) => {
  const [unsavedChanges, setUnsavedChanged] =
    useRecoilState(UnsavedChangesAtom);

  const [settings, setSettings] = useRecoilState(SettingsAtom);
  const sessionToken = useRecoilValue(SessionTokenAtom);

  const [last, setLast] = useState({});

  useEffect(() => {
    setSettings(result);
    // Components are now loaded from Background node in Header.tsx and Toolbox.tsx
    // No longer using localStorage
  }, [result, setSettings]);

  useEffect(() => {
    if (!last || !Object.keys(last).length) {
      setLast(unsavedChanges);
      return;
    }

    if (!unsavedChanges || last === unsavedChanges) return;

    console.log("🔄 Auto-save triggered");
    SaveToServer(
      unsavedChanges,
      true,
      settings,
      setSettings,
      sessionToken,
    ).then(() => {
      console.log("✅ Auto-save completed");
      setUnsavedChanged(null);
      setLast(unsavedChanges);
    });
  }, [
    last,
    setSettings,
    setUnsavedChanged,
    settings,
    unsavedChanges,
    sessionToken,
  ]);

  return <></>;
};

export default Save;
