import { UnsavedChangesAtom } from "components/editor/Viewport";
import { SaveToServer } from "components/editor/Viewport/lib";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { SessionTokenAtom, SettingsAtom } from "utils/atoms";
import { ComponentsAtom } from "utils/lib";

export const Save = ({ result }) => {
  const [unsavedChanges, setUnsavedChanged] =
    useRecoilState(UnsavedChangesAtom);

  const [settings, setSettings] = useRecoilState(SettingsAtom);
  const sessionToken = useRecoilValue(SessionTokenAtom);
  const setComponents = useSetRecoilState(ComponentsAtom);

  const [last, setLast] = useState({});

  useEffect(() => {
    setSettings(result);
    const components = JSON.parse(localStorage.getItem("components")) || [];

    setComponents(components);
  }, [result, setComponents, setSettings]);

  useEffect(() => {
    if (!last || !Object.keys(last).length) {
      setLast(unsavedChanges);
      return;
    }

    if (!unsavedChanges || last === unsavedChanges) return;

    SaveToServer(unsavedChanges, true, settings, setSettings, sessionToken).then(() => {
      setUnsavedChanged(null);
      setLast(unsavedChanges);
    });
  }, [last, setSettings, setUnsavedChanged, settings, unsavedChanges, sessionToken]);

  return <></>;
};

export default Save;
