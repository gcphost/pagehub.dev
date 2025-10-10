import { useEditor } from "@craftjs/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { TbChevronDown, TbX } from "react-icons/tb";
import { StandaloneImagePicker } from "./StandaloneImagePicker";

const sluggit = require("slug");

interface PageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string | null;
}

export const PageSettingsModal = ({ isOpen, onClose, pageId }: PageSettingsModalProps) => {
  const { actions, query } = useEditor();
  const [pageName, setPageName] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [isHomePage, setIsHomePage] = useState(false);
  const [is404Page, setIs404Page] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState<"basic" | "seo" | "advanced">("basic");
  const [ogExpanded, setOgExpanded] = useState(false);
  const [twitterExpanded, setTwitterExpanded] = useState(false);

  // SEO Fields
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [pageKeywords, setPageKeywords] = useState("");
  const [pageAuthor, setPageAuthor] = useState("");
  const [pageImage, setPageImage] = useState("");

  // Open Graph
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogType, setOgType] = useState("website");

  // Twitter
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [twitterSite, setTwitterSite] = useState("");
  const [twitterCreator, setTwitterCreator] = useState("");

  // Advanced
  const [canonicalUrl, setCanonicalUrl] = useState("");

  useEffect(() => {
    if (isOpen && pageId) {
      try {
        const node = query.node(pageId).get();
        if (node) {
          const props = node.data.props;
          const custom = node.data.custom;

          setPageName(custom?.displayName || "Untitled Page");
          setIsHomePage(props.isHomePage || false);
          setIs404Page(props.is404Page || false);

          // Generate slug from display name
          const generatedSlug = sluggit(custom?.displayName || "untitled-page", "-");
          setPageSlug(generatedSlug);
          setAutoSlug(true);

          // SEO
          setPageTitle(props.pageTitle || "");
          setPageDescription(props.pageDescription || "");
          setPageKeywords(props.pageKeywords || "");
          setPageAuthor(props.pageAuthor || "");
          setPageImage(props.pageImage || "");

          // Open Graph
          setOgTitle(props.ogTitle || "");
          setOgDescription(props.ogDescription || "");
          setOgImage(props.ogImage || "");
          setOgType(props.ogType || "website");

          // Twitter
          setTwitterCard(props.twitterCard || "summary_large_image");
          setTwitterSite(props.twitterSite || "");
          setTwitterCreator(props.twitterCreator || "");

          // Advanced
          setCanonicalUrl(props.canonicalUrl || "");
        }
      } catch (e) {
        console.error("Error loading page settings:", e);
      }
    }
  }, [isOpen, pageId, query]);

  const handleSave = () => {
    if (!pageId) return;

    try {
      // Update display name
      actions.setCustom(pageId, (custom) => {
        custom.displayName = pageName;
      });

      // Update all props
      actions.setProp(pageId, (props) => {
        props.isHomePage = isHomePage;
        props.is404Page = is404Page;

        // SEO
        props.pageTitle = pageTitle;
        props.pageDescription = pageDescription;
        props.pageKeywords = pageKeywords;
        props.pageAuthor = pageAuthor;
        props.pageImage = pageImage;

        // Open Graph
        props.ogTitle = ogTitle;
        props.ogDescription = ogDescription;
        props.ogImage = ogImage;
        props.ogType = ogType;

        // Twitter
        props.twitterCard = twitterCard;
        props.twitterSite = twitterSite;
        props.twitterCreator = twitterCreator;

        // Advanced
        props.canonicalUrl = canonicalUrl;
      });

      onClose();
    } catch (e) {
      console.error("Error saving page settings:", e);
    }
  };

  const handlePageNameChange = (newName: string) => {
    setPageName(newName);

    // Auto-generate slug if enabled
    if (autoSlug) {
      const generatedSlug = sluggit(newName || "untitled-page", "-");
      setPageSlug(generatedSlug);
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setPageSlug(newSlug);
    setAutoSlug(false); // Disable auto-slug once user manually edits
  };

  if (!isOpen || !pageId) return null;

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
            <h2 className="text-2xl font-bold text-gray-900">Page Settings</h2>
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
                onClick={() => setActiveTab("basic")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === "basic"
                  ? "text-primary-600 border-b-2 border-primary-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                Basic
              </button>
              <button
                onClick={() => setActiveTab("seo")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === "seo"
                  ? "text-primary-600 border-b-2 border-primary-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                SEO
              </button>
              <button
                onClick={() => setActiveTab("advanced")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === "advanced"
                  ? "text-primary-600 border-b-2 border-primary-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                Advanced
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Basic Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                {/* Page Name & URL - Same Line */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Name
                    </label>
                    <input
                      type="text"
                      value={pageName}
                      onChange={(e) => handlePageNameChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-400"
                      placeholder="Enter page name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">/</span>
                      <input
                        type="text"
                        value={isHomePage ? "" : pageSlug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        disabled={isHomePage}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                        placeholder={isHomePage ? "home" : "page-url"}
                      />
                    </div>
                  </div>
                </div>

                {/* Home Page Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Home Page</div>
                    <div className="text-xs text-gray-500 mt-1">Set as root URL (/)</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsHomePage(!isHomePage)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isHomePage ? "bg-primary-600" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isHomePage ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>

                {/* 404 Page Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <div className="text-sm font-medium text-gray-900">404 Page</div>
                    <div className="text-xs text-gray-500 mt-1">Show when route not found</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIs404Page(!is404Page)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${is404Page ? "bg-primary-600" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${is404Page ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>

                {/* Page Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Image
                  </label>
                  <StandaloneImagePicker
                    value={pageImage}
                    onChange={setPageImage}
                    label="Upload Image"
                    help="Featured image for this page"
                  />
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === "seo" && (
              <div className="space-y-6">
                {/* Basic SEO */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <textarea
                      value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      placeholder="Page title (50-60 characters)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={pageDescription}
                      onChange={(e) => setPageDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      placeholder="Meta description (150-160 characters)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keywords
                      </label>
                      <input
                        type="text"
                        value={pageKeywords}
                        onChange={(e) => setPageKeywords(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        placeholder="keyword1, keyword2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author
                      </label>
                      <input
                        type="text"
                        value={pageAuthor}
                        onChange={(e) => setPageAuthor(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        placeholder="Author name"
                      />
                    </div>
                  </div>
                </div>

                {/* Open Graph - Collapsible */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOgExpanded(!ogExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">Open Graph (Social Media)</span>
                      <span className="text-xs text-gray-500">Optional</span>
                    </div>
                    <TbChevronDown
                      className={`text-gray-500 transition-transform ${ogExpanded ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {ogExpanded && (
                    <div className="p-4 space-y-4 bg-white border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OG Title
                        </label>
                        <input
                          type="text"
                          value={ogTitle}
                          onChange={(e) => setOgTitle(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          placeholder="Leave empty to use page title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OG Description
                        </label>
                        <textarea
                          value={ogDescription}
                          onChange={(e) => setOgDescription(e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          placeholder="Leave empty to use page description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OG Image
                        </label>
                        <StandaloneImagePicker
                          value={ogImage}
                          onChange={setOgImage}
                          label="Upload OG Image"
                          help="Recommended: 1200x630px"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OG Type
                        </label>
                        <select
                          value={ogType}
                          onChange={(e) => setOgType(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        >
                          <option value="website">Website</option>
                          <option value="article">Article</option>
                          <option value="product">Product</option>
                          <option value="profile">Profile</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Twitter - Collapsible */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setTwitterExpanded(!twitterExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">Twitter/X Card</span>
                      <span className="text-xs text-gray-500">Optional</span>
                    </div>
                    <TbChevronDown
                      className={`text-gray-500 transition-transform ${twitterExpanded ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {twitterExpanded && (
                    <div className="p-4 space-y-4 bg-white border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Type
                        </label>
                        <select
                          value={twitterCard}
                          onChange={(e) => setTwitterCard(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        >
                          <option value="summary_large_image">Summary Large Image</option>
                          <option value="summary">Summary</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Site
                          </label>
                          <input
                            type="text"
                            value={twitterSite}
                            onChange={(e) => setTwitterSite(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            placeholder="@yourusername"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Creator
                          </label>
                          <input
                            type="text"
                            value={twitterCreator}
                            onChange={(e) => setTwitterCreator(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            placeholder="@authorusername"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === "advanced" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canonical URL
                  </label>
                  <input
                    type="text"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Leave empty for auto-generated"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Specify a canonical URL to prevent duplicate content issues
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

