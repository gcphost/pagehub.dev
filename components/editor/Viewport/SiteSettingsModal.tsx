import { ROOT_NODE, useEditor } from "@craftjs/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { TbX } from "react-icons/tb";
import { StandaloneImagePicker } from "./StandaloneImagePicker";

interface SiteSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SiteSettingsModal = ({ isOpen, onClose }: SiteSettingsModalProps) => {
  const { actions, query } = useEditor();

  // UI State
  const [activeTab, setActiveTab] = useState<"general" | "code" | "branding">("general");

  // Site Settings
  const [favicon, setFavicon] = useState("");
  const [headerCode, setHeaderCode] = useState("");
  const [footerCode, setFooterCode] = useState("");

  // Branding / Company Settings
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  useEffect(() => {
    if (isOpen) {
      try {
        const root = query.node(ROOT_NODE).get();
        if (root) {
          const props = root.data.props;

          setFavicon(props.ico || "");
          setHeaderCode(props.header || "");
          setFooterCode(props.footer || "");

          // Load company settings from ROOT_NODE
          const company = props.company || {};
          setCompanyName(company.name || "");
          setCompanyType(company.type || "");
          setCompanyLocation(company.location || "");
          setCompanyAddress(company.address || "");
          setCompanyPhone(company.phone || "");
          setCompanyEmail(company.email || "");
          setCompanyWebsite(company.website || "");
        }
      } catch (e) {
        console.error("Error loading site settings:", e);
      }
    }
  }, [isOpen, query]);

  const handleSave = () => {
    try {
      // Save everything to ROOT_NODE props
      actions.setProp(ROOT_NODE, (props) => {
        // Favicon and custom code
        props.ico = favicon;
        if (favicon) {
          props.icoType = "cdn";
        }
        props.header = headerCode;
        props.footer = footerCode;

        // Company settings as nested object
        props.company = {
          name: companyName,
          type: companyType,
          location: companyLocation,
          address: companyAddress,
          phone: companyPhone,
          email: companyEmail,
          website: companyWebsite,
        };
      });

      onClose();
    } catch (e) {
      console.error("Error saving site settings:", e);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-2xl w-full max-w-3xl h-[85vh] max-h-[800px] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              <TbX />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === "general"
                  ? "text-primary-600 border-b-2 border-primary-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === "code"
                  ? "text-primary-600 border-b-2 border-primary-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                Custom Code
              </button>
              <button
                onClick={() => setActiveTab("branding")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === "branding"
                  ? "text-primary-600 border-b-2 border-primary-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                Branding
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* General Tab */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon
                  </label>
                  <StandaloneImagePicker
                    value={favicon}
                    onChange={setFavicon}
                    label="Upload Favicon"
                    help="Recommended: .ico, .png, or .gif. Appears in browser tabs."
                  />
                </div>
              </div>
            )}

            {/* Custom Code Tab */}
            {activeTab === "code" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Code
                  </label>
                  <textarea
                    value={headerCode}
                    onChange={(e) => setHeaderCode(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm bg-gray-50"
                    placeholder="<style>...</style>&#10;<script>...</script>"
                    spellCheck={false}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Custom CSS and JavaScript injected into the &lt;head&gt; of every page
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Code
                  </label>
                  <textarea
                    value={footerCode}
                    onChange={(e) => setFooterCode(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm bg-gray-50"
                    placeholder="<script>...</script>"
                    spellCheck={false}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Scripts injected before the closing &lt;/body&gt; tag
                  </p>
                </div>
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === "branding" && (
              <div className="space-y-6">
                <div className="space-y-1 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                  <p className="text-sm text-gray-500">
                    Your company details for branding and customization
                  </p>

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Type
                  </label>
                  <input
                    type="text"
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="e.g., ecommerce, finance, technology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Location
                  </label>
                  <input
                    type="text"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Los Angeles, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="123 Main St, Suite 100&#10;Los Angeles, CA 90001"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="https://www.company.com"
                  />
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs text-blue-800">
                    <strong>💡 Tip:</strong> Use variables in your text and buttons like{" "}
                    <code className="bg-blue-100 px-1 py-0.5 rounded">{"{{company.name}}"}</code>,{" "}
                    <code className="bg-blue-100 px-1 py-0.5 rounded">{"{{company.email}}"}</code>,{" "}
                    <code className="bg-blue-100 px-1 py-0.5 rounded">{"{{company.phone}}"}</code>, or{" "}
                    <code className="bg-blue-100 px-1 py-0.5 rounded">{"{{year}}"}</code>{" "}
                    to automatically display these values throughout your site.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

