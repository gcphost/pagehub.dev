import React, { useEffect, useState } from "react";
import { TbX } from "react-icons/tb";
import { useRecoilState } from "recoil";
import { DeviceDimensionsAtom } from "./index";

const devicePresets = [
  { name: "iPhone 12 Pro", width: 390, height: 844 },
  { name: "iPhone 12 Pro Max", width: 428, height: 926 },
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "iPhone 13 Mini", width: 375, height: 812 },
  { name: "iPhone 14", width: 390, height: 844 },
  { name: "iPhone 14 Pro", width: 393, height: 852 },
  { name: "iPhone 14 Pro Max", width: 430, height: 932 },
  { name: "Pixel 5", width: 393, height: 851 },
  { name: "Pixel 7", width: 412, height: 915 },
  { name: "Samsung Galaxy S21", width: 360, height: 800 },
  { name: "Samsung Galaxy S22", width: 360, height: 780 },
  { name: "iPad Mini", width: 744, height: 1133 },
  { name: "iPad Air", width: 820, height: 1180 },
  { name: 'iPad Pro 11"', width: 834, height: 1194 },
  { name: "Custom", width: 375, height: 667 },
];

interface DeviceSelectorProps {
  onClose: () => void;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({ onClose }) => {
  const [deviceDimensions, setDeviceDimensions] =
    useRecoilState(DeviceDimensionsAtom);
  const [selectedDevice, setSelectedDevice] = useState(devicePresets[0]);
  const [customWidth, setCustomWidth] = useState(deviceDimensions.width);
  const [customHeight, setCustomHeight] = useState(deviceDimensions.height);
  const [showDropdown, setShowDropdown] = useState(false);

  // Update Recoil state when dimensions change
  useEffect(() => {
    setDeviceDimensions({ width: customWidth, height: customHeight });
  }, [customWidth, customHeight, setDeviceDimensions]);

  const handleDeviceChange = (device: (typeof devicePresets)[0]) => {
    setSelectedDevice(device);
    setCustomWidth(device.width);
    setCustomHeight(device.height);
    setShowDropdown(false);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCustomWidth(value);
    if (selectedDevice.name !== "Custom") {
      setSelectedDevice({
        ...selectedDevice,
        name: "Custom",
        width: value,
        height: customHeight,
      });
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCustomHeight(value);
    if (selectedDevice.name !== "Custom") {
      setSelectedDevice({
        ...selectedDevice,
        name: "Custom",
        width: customWidth,
        height: value,
      });
    }
  };

  return (
    <div className="mx-auto flex w-fit items-center gap-3 text-xs text-muted-foreground">
      {/* Device Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <span className="whitespace-nowrap">{selectedDevice.name}</span>
          <svg
            className="size-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            {/* Dropdown */}
            <div className="scrollbar-dark absolute left-0 top-full z-50 mt-1 max-h-96 w-56 overflow-y-auto rounded border border-border bg-muted text-muted-foreground shadow-lg">
              {devicePresets.map((device) => (
                <button
                  key={device.name}
                  onClick={() => handleDeviceChange(device)}
                  className={`w-full px-4 py-2 text-left transition-colors hover:bg-muted ${
                    selectedDevice.name === device.name ? "bg-muted" : ""
                  }`}
                >
                  <div className="font-medium">{device.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {device.width} × {device.height}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Dimensions */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={customWidth}
          onChange={handleWidthChange}
          className="w-12 bg-transparent text-center transition-colors hover:text-foreground focus:outline-none"
          placeholder="W"
        />
        <span>×</span>
        <input
          type="number"
          value={customHeight}
          onChange={handleHeightChange}
          className="w-12 bg-transparent text-center transition-colors hover:text-foreground focus:outline-none"
          placeholder="H"
        />
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="transition-colors hover:text-foreground"
        title="Exit device mode"
      >
        <TbX className="size-4" />
      </button>
    </div>
  );
};
