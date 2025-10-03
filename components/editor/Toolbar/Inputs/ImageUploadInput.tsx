import { useNode } from "@craftjs/core";
import {
  DeleteMedia,
  GetSignedUrl,
  SaveMedia,
} from "components/editor/Viewport/lib";
import { useState } from "react";
import { TbAlertTriangle, TbUpload } from "react-icons/tb";
import { useRecoilValue } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { getCdnUrl } from "utils/cdn";
import Spinner from "../Helpers/Spinner";

import { Wrap } from "../ToolbarStyle";

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

const handleMediaDeletion = async (mediaId, settings) => {
  if (mediaId) {
    await DeleteMedia(mediaId, settings);
  }
};

export const ImageUploadInput: any = ({
  full = false,
  multiple = false,
  propKey,
  typeKey,
  onChange,
  index,
  label = "Upload Image",
  accept = "image/*",
  ...props
}) => {
  const {
    actions: { setProp },
    nodeProps,
  } = useNode((node) => ({
    nodeProps: node.data.props,
  }));

  const [errors, setErrors] = useState([]);
  const [value] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const settings = useRecoilValue(SettingsAtom);

  let timeout;

  const handleChange = async (e) => {
    if (timeout) clearTimeout(timeout);

    setSaved(false);
    setErrors([]);
    setLoading(true);
    setEnabled(false);

    updateNodeProps(setProp, true, false);

    const mediaId = nodeProps[propKey];

    const files = handleFileSelection(e, setErrors);
    const _saved = [];

    if (files.length) {
      await handleMediaDeletion(mediaId, settings);
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
      });
    }, 500);

    timeout = setTimeout(() => {
      setSaved(false);
      updateNodeProps(setProp, false, false);
    }, 3000);
  };

  if (loading) label = "Uploading";
  if (saved) label = "Saved";
  if (errors.length) label = "Error";

  const mediaId = nodeProps[propKey];
  const hasUploadedImage = mediaId && nodeProps[typeKey] === "cdn";
  const imageUrl = hasUploadedImage ? getCdnUrl(mediaId) : null;

  if (hasUploadedImage && !loading && !saved) {
    label = "Change Image";
  }

  return (
    <Wrap props={props}>
      <label
        htmlFor="files"
        className={`flex gap-3 h-12 bg-primary-500 rounded-md btn text-base ${!enabled ? "opacity-50" : ""
          } ${hasUploadedImage ? "relative overflow-hidden" : ""}`}
      >
        {hasUploadedImage && imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
        <div className="relative z-10 flex gap-3">
          <div className="">
            {errors.length ? <TbAlertTriangle /> : null}
            {!loading && !errors.length && <TbUpload />}
            {loading && <Spinner />}
          </div>{" "}
          {label}
        </div>
      </label>
      <input
        id="files"
        className="hidden"
        type="file"
        multiple={multiple}
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
    </Wrap>
  );
};
