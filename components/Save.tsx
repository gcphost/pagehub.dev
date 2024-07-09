import { UnsavedChangesAtom } from "components/editor/Viewport";
import { SaveToServer } from "components/editor/Viewport/lib";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { ComponentsAtom } from "utils/lib";

export const Save = ({ result }) => {
  // const { query, actions } = useEditor();

  const [unsavedChanges, setUnsavedChanged] =
    useRecoilState(UnsavedChangesAtom);

  const [settings, setSettings] = useRecoilState(SettingsAtom);
  const setComponents = useSetRecoilState(ComponentsAtom);
  // const [isolate, setIsolate] = useRecoilState(IsolateAtom);

  const [last, setLast] = useState({});

  useEffect(() => {
    setSettings(result);
    const components = JSON.parse(localStorage.getItem("components")) || [];

    setComponents(components);
  }, [result]);

  useEffect(() => {
    // localStorage.setItem("isolated", "");
    // const pageCount = getPageCount(query);
    // if (pageCount?.length === 1 && !isolate)
    //  isolatePage(isolate, query, pageCount[0], actions, setIsolate);
  }, [last]);

  useEffect(() => {
    if (!last || !Object.keys(last).length) {
      setLast(unsavedChanges);
      return;
    }

    if (!unsavedChanges || last === unsavedChanges) return;

    SaveToServer(unsavedChanges, true, settings, setSettings).then(() => {
      setUnsavedChanged(null);
      setLast(unsavedChanges);
    });
  }, [unsavedChanges]);

  return <></>;
};

export default Save;
