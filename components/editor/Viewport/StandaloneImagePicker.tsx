import { useEditor } from "@craftjs/core";
import {
  GetSignedUrl,
  SaveMedia,
} from "components/editor/Viewport/lib";
import { useState } from "react";
import { TbAlertTriangle, TbPhoto, TbTrash, TbUpload } from "react-icons/tb";
import { useRecoilValue } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { getMediaContent } from "utils/lib";
import Spinner from "../Toolbar/Helpers/Spinner";
import { MediaManagerModal } from "../Toolbar/Inputs/MediaManagerModal";

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

interface StandaloneImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  help?: string;
}

export const StandaloneImagePicker = ({
  value,
  onChange,
  label = "Upload Image",
  help,
}: StandaloneImagePickerProps) => {
  const { query } = useEditor();
  const [errors, setErrors] = useState([]);
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

    const files = handleFileSelection(e, setErrors);

    if (files.length) {
      const savedFiles = await uploadFiles(files, settings, setErrors);
      if (savedFiles.length > 0) {
        onChange(savedFiles[0]);
      }
    }

    setLoading(false);
    setEnabled(true);
    setSaved(true);

    timeout = setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handleBrowseSelect = (selectedMediaId: string) => {
    if (!selectedMediaId) return;
    onChange(selectedMediaId);
    setShowMediaBrowser(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    onChange("");
  };

  let displayLabel = label;
  if (loading) displayLabel = "Uploading";
  if (saved) displayLabel = "Saved";
  if (errors.length) displayLabel = "Error";

  const hasUploadedImage = !!value;
  const mediaContent = hasUploadedImage ? getMediaContent(query, value) : null;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <label
          htmlFor={`file-upload-${label}`}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${errors.length
            ? "border-red-500 bg-red-50 text-red-700"
            : saved
              ? "border-green-500 bg-green-50 text-green-700"
              : loading
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-primary-500 bg-gray-50 hover:bg-primary-50 text-gray-700"
            } ${!enabled && "opacity-50 cursor-not-allowed"}`}
        >
          {loading ? (
            <Spinner />
          ) : errors.length ? (
            <TbAlertTriangle className="text-xl" />
          ) : (
            <TbUpload className="text-xl" />
          )}
          <span className="text-sm font-medium">{displayLabel}</span>
          <input
            id={`file-upload-${label}`}
            type="file"
            onChange={handleChange}
            disabled={!enabled}
            accept="image/*"
            className="hidden"
          />
        </label>

        <button
          type="button"
          onClick={() => setShowMediaBrowser(true)}
          className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center gap-2 text-gray-700"
        >
          <TbPhoto className="text-xl" />
          <span className="text-sm font-medium">Browse</span>
        </button>

        {hasUploadedImage && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-3 border-2 border-red-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all flex items-center gap-2 text-red-600"
          >
            <TbTrash className="text-xl" />
          </button>
        )}
      </div>

      {help && <p className="text-xs text-gray-500">{help}</p>}

      {errors.length > 0 && (
        <div className="text-sm text-red-600">
          {errors.map((err, idx) => (
            <div key={idx}>{err.error}</div>
          ))}
        </div>
      )}

      {hasUploadedImage && mediaContent && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={mediaContent}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <MediaManagerModal
        isOpen={showMediaBrowser}
        onClose={() => setShowMediaBrowser(false)}
        onSelect={handleBrowseSelect}
        selectionMode={true}
      />
    </div>
  );
};

