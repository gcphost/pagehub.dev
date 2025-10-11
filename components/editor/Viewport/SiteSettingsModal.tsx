import { ROOT_NODE, useEditor } from "@craftjs/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { TbX } from "react-icons/tb";
import { HTMLCodeInput } from "../Toolbar/Inputs/HTMLCodeInput";
import { StandaloneImagePicker } from "./StandaloneImagePicker";

interface SiteSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SiteSettingsModal = ({
  isOpen,
  onClose,
}: SiteSettingsModalProps) => {
  const { actions, query } = useEditor();

  // UI State
  const [activeTab, setActiveTab] = useState<"branding" | "code" | "ai">(
    "branding",
  );

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

  // AI Settings
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiStyleTags, setAiStyleTags] = useState<string[]>([]);

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

          // Load AI settings from ROOT_NODE
          const ai = props.ai || {};
          setAiPrompt(ai.prompt || "");
          setAiStyleTags(ai.styleTags || []);
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

        // AI settings as nested object
        props.ai = {
          prompt: aiPrompt,
          styleTags: aiStyleTags,
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-background/80 fixed inset-0 z-[9997] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9998] border border-border bg-background shadow-xl"
        style={{
          margin: "40px auto",
          maxWidth: "600px",
          width: "calc(100% - 80px)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-accent px-4 py-3 text-accent-foreground">
            <h2 className="text-2xl font-bold text-foreground">
              Site Settings
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-2xl text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <TbX />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border bg-muted">
            <button
              onClick={() => setActiveTab("branding")}
              className={`flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "branding"
                  ? "border-b-2 border-primary bg-background text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Branding
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "ai"
                  ? "border-b-2 border-primary bg-background text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              AI
            </button>

            <button
              onClick={() => setActiveTab("code")}
              className={`flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "code"
                  ? "border-b-2 border-primary bg-background text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Custom Code
            </button>
          </div>

          {/* Content */}
          <div className="scrollbar flex-1 space-y-4 overflow-y-auto bg-background p-6 text-foreground">
            {/* Custom Code Tab */}
            {activeTab === "code" && (
              <div className="space-y-6">
                <HTMLCodeInput
                  value={headerCode}
                  onChange={setHeaderCode}
                  label="Header Code"
                  height="200px"
                  placeholder="<style>...</style>&#10;<script>...</script>"
                  helpText="Custom CSS and JavaScript injected into the &lt;head&gt; of every page"
                />

                <HTMLCodeInput
                  value={footerCode}
                  onChange={setFooterCode}
                  label="Footer Code"
                  height="200px"
                  placeholder="<script>...</script>"
                  helpText="Scripts injected before the closing &lt;/body&gt; tag"
                />
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === "branding" && (
              <div className="space-y-6">
                <div className="mb-4 space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Branding & Company Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your company details and branding assets for customization
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Favicon
                  </label>
                  <StandaloneImagePicker
                    value={favicon}
                    onChange={setFavicon}
                    label="Upload Favicon"
                    help="Recommended: .ico, .png, or .gif. Appears in browser tabs."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Company Type
                  </label>
                  <input
                    type="text"
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., ecommerce, finance, technology"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Company Location
                  </label>
                  <input
                    type="text"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Los Angeles, CA"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Address
                  </label>
                  <textarea
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    rows={2}
                    className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="123 Main St, Suite 100&#10;Los Angeles, CA 90001"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Website
                  </label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="https://www.company.com"
                  />
                </div>

                <div className="mt-4 rounded-md border border-border bg-muted p-4 text-muted-foreground">
                  <p className="text-sm text-primary">
                    <strong>💡 Tip:</strong> Use variables in your text and
                    buttons like{" "}
                    <code className="rounded bg-background px-2 py-1 text-foreground">
                      {"{{company.name}}"}
                    </code>
                    ,{" "}
                    <code className="rounded bg-background px-2 py-1 text-foreground">
                      {"{{company.email}}"}
                    </code>
                    ,{" "}
                    <code className="rounded bg-background px-2 py-1 text-foreground">
                      {"{{company.phone}}"}
                    </code>
                    , or{" "}
                    <code className="rounded bg-background px-2 py-1 text-foreground">
                      {"{{year}}"}
                    </code>{" "}
                    to automatically display these values throughout your site.
                  </p>
                </div>
              </div>
            )}

            {/* AI Tab */}
            {activeTab === "ai" && (
              <div className="space-y-6">
                <div className="mb-4 space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    AI Content Generator
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Customize how AI improves your content with a custom prompt
                    and style preferences
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Custom AI Prompt
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={3}
                    maxLength={200}
                    className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Make the copy more engaging, clear, and compelling while keeping the same core message..."
                  />
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Brief instructions for how AI should improve your content
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {aiPrompt.length}/200
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-foreground">
                    Style Tags
                  </label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "engaging",
                        "vibrant",
                        "professional",
                        "friendly",
                        "clear",
                        "compelling",
                        "concise",
                        "persuasive",
                        "creative",
                        "confident",
                        "trustworthy",
                        "modern",
                      ].map((tag) => (
                        <label
                          key={tag}
                          className="flex cursor-pointer items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={aiStyleTags.includes(tag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAiStyleTags([...aiStyleTags, tag]);
                              } else {
                                setAiStyleTags(
                                  aiStyleTags.filter((t) => t !== tag),
                                );
                              }
                            }}
                            className="rounded border-border text-accent focus:ring-ring"
                          />
                          <span className="text-sm capitalize text-foreground">
                            {tag}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Select style preferences to guide AI content generation
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-md border border-border bg-muted p-4 text-muted-foreground">
                  <p className="text-sm text-primary">
                    <strong>💡 Tip:</strong> Your custom prompt and selected
                    style tags will be used by the AI wand tool in the text
                    editor to improve your content. Leave the prompt empty to
                    use default behavior.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-border bg-muted p-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2 font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};
