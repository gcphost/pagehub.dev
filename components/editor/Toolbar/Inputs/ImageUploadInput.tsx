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
import Spinner from "../Helpers/Spinner";

import { Wrap } from "../ToolbarStyle";

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

  const [file, setFile] = useState([]);
  const [errors, setErrors] = useState([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const settings = useRecoilValue(SettingsAtom);

  let timeout;
  const handleChange = (e) => {
    return new Promise((resolve) => {
      const asyncFunction = async () => {
        if (timeout) clearTimeout(timeout);

        setSaved(false);
        setFile([]);
        setErrors([]);
        setLoading(true);
        setEnabled(false);

        setProp((_props) => {
          _props.isLoading = true;
          _props.loaded = false;
        }, 3000);

        const type = nodeProps[typeKey];
        const mediaId = nodeProps[propKey];

        const errors = [];
        const files = [];

        for (let i = 0; i < e.target?.files?.length; i++) {
          const _file = e.target.files[i];
          // if (_file.size > 2097152) {
          //   errors.push({ error: "File size too large", file: _file });
          // } else
          files.push(_file);
        }

        const _saved = [];

        if (files.length) {
          if (type && mediaId) {
            await DeleteMedia(mediaId, settings);
          }

          const geturl = await GetSignedUrl();
          const signedURL = geturl?.result?.uploadURL;

          if (!signedURL) {
            errors.push({ error: "Failed to upload", file: file[0] });
          } else {
            for (const file of files) {
              const res = await SaveMedia(file, signedURL);
              if (res?.result?.id) _saved.push(res.result.id);
            }
          }
        }

        setFile(files);
        setErrors(errors);
        setLoading(false);
        setEnabled(true);
        setSaved(true);

        setProp((_props) => {
          _props.isLoading = false;
          _props.loaded = true;
        }, 3000);

        setTimeout(() => {
          _saved.forEach((id) => {
            setProp((_props) => {
              _props[propKey] = id;
              _props[typeKey] = "cdn";
            }, 3000);
          });
        }, 500);

        timeout = setTimeout(() => {
          setSaved(false);
          setProp((_props) => {
            _props.loaded = false;
          }, 3000);
        }, 3000);

        resolve(true);
      };

      asyncFunction();
    });
  };

  if (loading) label = "Uploading";
  if (saved) label = "Saved";
  if (errors.length) label = "Error";

  return (
    <Wrap props={props}>
      <label
        htmlFor="files"
        className={`flex gap-3 h-12 bg-violet-500 rounded-md btn text-base ${
          !enabled ? "opacity-50" : ""
        }`}
      >
        <div className="">
          {errors.length ? <TbAlertTriangle /> : null}
          {!loading && !errors.length && <TbUpload />}
          {loading && <Spinner />}
        </div>{" "}
        {label}
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
