import { useEditor, useNode } from "@craftjs/core";
import {
  GetSignedUrl,
  SaveMedia,
} from "components/editor/Viewport/lib";
import { Tooltip } from "components/layout/Tooltip";
import { useState } from "react";
import { TbAlertTriangle, TbCode, TbPhoto, TbPhotoOff, TbUpload } from "react-icons/tb";
import { useRecoilValue } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { getMediaContent, registerMediaWithBackground } from "utils/lib";
import Spinner from "../Helpers/Spinner";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { MediaManagerModal } from "./MediaManagerModal";

const handleFileSelection = (e, setErrors) => {
  const errors = [];
  const files = [];

  for (let i = 0; i < e.target?.files?.length; i++) {
    const _file = e.target.files[i];
    files.push(_file);
  }

  setErrors(errors);
  return files;
};

const uploadFiles = async (files, settings, setErrors) => {
  const _saved = [];

  const geturl = await GetSignedUrl();
  const signedURL = geturl?.result?.uploadURL;

  if (!signedURL) {
    setErrors([{ error: "Failed to upload", file: files[0] }]);
  } else {
    for (const file of files) {
      const res = await SaveMedia(file, signedURL);
      if (res?.result?.id) _saved.push(res.result.id);
    }
  }

  return _saved;
};

const updateNodeProps = (
  setProp,
  isLoading,
  loaded,
  propKey = null,
  typeKey = null,
  id = null
) => {
  setProp((_props) => {
    _props.isLoading = isLoading;
    _props.loaded = loaded;
    if (id) {
      _props[propKey] = id;
      _props[typeKey] = "cdn";
    }
  }, 3000);
};

export const MediaInput = (propa) => {
  const props = { ...propa };
  const { props: nodeProps, id: componentId } = useNode((node) => ({
    props: node.data.props,
    id: node.id,
  }));

  const {
    actions: { setProp },
  } = useNode();

  const { query, actions } = useEditor();

  const { propKey, typeKey, contentKey, accept = "image/*" } = props;

  const [errors, setErrors] = useState([]);
  const [value] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [showMediaBrowser, setShowMediaBrowser] = useState(false);

  const settings = useRecoilValue(SettingsAtom);

  let timeout;

  const handleChange = async (e) => {
    if (timeout) clearTimeout(timeout);

    setSaved(false);
    setErrors([]);
    setLoading(true);
    setEnabled(false);

    updateNodeProps(setProp, true, false);

    const files = handleFileSelection(e, setErrors);
    const _saved = [];

    if (files.length) {
      const savedFiles = await uploadFiles(files, settings, setErrors);
      _saved.push(...savedFiles);
    }

    setLoading(false);
    setEnabled(true);
    setSaved(true);

    updateNodeProps(setProp, false, true);

    setTimeout(() => {
      _saved.forEach((id) => {
        updateNodeProps(setProp, false, true, propKey, typeKey, id);
        registerMediaWithBackground(query, actions, id, "cdn", componentId);
      });
    }, 500);

    timeout = setTimeout(() => {
      setSaved(false);
      updateNodeProps(setProp, false, false);
    }, 3000);
  };

  const handleBrowseSelect = (selectedMediaId: string) => {
    if (!selectedMediaId) return;

    setProp((_props) => {
      _props[propKey] = selectedMediaId;
      _props[typeKey] = "cdn";
    });

    registerMediaWithBackground(query, actions, selectedMediaId, "reference", componentId);

    setShowMediaBrowser(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  let label = "Upload";
  if (loading) label = "Uploading";
  if (saved) label = "Saved";
  if (errors.length) label = "Error";

  const mediaId = nodeProps[propKey];
  const hasUploadedImage = !!mediaId;
  const imageUrl = hasUploadedImage ? getMediaContent(query, mediaId) : null;

  if (hasUploadedImage && !loading && !saved) {
    label = "Change";
  }

  const currentType = nodeProps[typeKey] || "cdn";

  return (
    <>
      <ToolbarSection title={props.title} full={2}>
        {/* Upload/Browse buttons - only show when in cdn mode */}
        {currentType === "cdn" && (
          <div className="flex gap-2 w-full">
            <label
              htmlFor={`files-${componentId}`}
              className={`btn w-full ${!enabled ? "opacity-50" : ""} ${hasUploadedImage ? "relative overflow-hidden" : ""}`}
            >
              {hasUploadedImage && imageUrl && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              )}
              <div className="relative z-10 flex gap-2 items-center">
                {errors.length ? <TbAlertTriangle /> : null}
                {!loading && !errors.length && <TbUpload />}
                {loading && <Spinner />}
                {label}
              </div>
            </label>

            <button
              onClick={() => setShowMediaBrowser(true)}
              className="btn"
              title="Browse media library"
            >
              <TbPhoto />
              Browse
            </button>
          </div>
        )}

        {/* URL input - show when in img mode */}
        {currentType === "img" && (
          <ToolbarItem
            propKey={propKey}
            propType="component"
            type="text"
            labelHide={true}
            placeholder="https://...."
          />
        )}

        <input
          id={`files-${componentId}`}
          className="hidden"
          type="file"
          value={value}
          onChange={handleChange}
          accept={accept}
        />

        {errors.length ? (
          <div className="py-3 whitespace-nowrap">
            {errors.map((error, key) => (
              <div key={key}>{error.error}</div>
            ))}
          </div>
        ) : null}


        {/* SVG textarea - show when in svg mode */}
        {currentType === "svg" && (
          <ToolbarItem
            propKey={contentKey}
            propType="component"
            type="textarea"
            rows={6}
            label=""
            labelHide={true}
            placeholder="<svg>...</svg>"
          />
        )}

        {/* Type selector using ToolbarItem */}
        <ToolbarItem
          propKey={typeKey}
          propType="component"
          type="radio"
          labelHide={true}
          cols={true}
          options={[
            {
              label: (
                <Tooltip content="Upload File" arrow={false}>
                  <TbUpload />
                </Tooltip>
              ),
              value: "cdn",
            },
            {
              label: (
                <Tooltip content="URL" arrow={false}>
                  <TbPhoto />
                </Tooltip>
              ),
              value: "img",
            },
            {
              label: (
                <Tooltip content="SVG" arrow={false}>
                  <TbCode />
                </Tooltip>
              ),
              value: "svg",
            },
            {
              label: (
                <Tooltip content="None" arrow={false}>
                  <TbPhotoOff />
                </Tooltip>
              ),
              value: "",
            },
          ].filter(option => option.value !== currentType)}
        />
      </ToolbarSection>
      {/* Media Browser Modal */}
      <MediaManagerModal
        isOpen={showMediaBrowser}
        onClose={() => setShowMediaBrowser(false)}
        onSelect={handleBrowseSelect}
        selectionMode={true}
      />


    </>
  );
};

