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

export const PageSettingsModal = ({
  isOpen,
  onClose,
  pageId,
}: PageSettingsModalProps) => {
  const { actions, query } = useEditor();
  const [pageName, setPageName] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [isHomePage, setIsHomePage] = useState(false);
  const [is404Page, setIs404Page] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState<"basic" | "seo" | "advanced">(
    "basic",
  );
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
          const generatedSlug = sluggit(
            custom?.displayName || "untitled-page",
            "-",
          );
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
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-muted text-muted-foreground"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="flex h-[85vh] max-h-[800px] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-background shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-2xl font-bold text-foreground">
              Page Settings
            </h2>
            <button
              onClick={onClose}
              className="text-2xl text-muted-foreground hover:text-foreground"
            >
              <TbX />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-border bg-muted text-muted-foreground">
            <div className="flex">
              <button
                onClick={() => setActiveTab("basic")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "basic"
                    ? "border-b-2 border-primary bg-background text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                Basic
              </button>
              <button
                onClick={() => setActiveTab("seo")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "seo"
                    ? "border-b-2 border-primary bg-background text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                SEO
              </button>
              <button
                onClick={() => setActiveTab("advanced")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "advanced"
                    ? "border-b-2 border-primary bg-background text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Page Name
                    </label>
                    <input
                      type="text"
                      value={pageName}
                      onChange={(e) => handlePageNameChange(e.target.value)}
                      className="w-full rounded-md border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Enter page name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      URL Slug
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">/</span>
                      <input
                        type="text"
                        value={isHomePage ? "" : pageSlug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        disabled={isHomePage}
                        className="flex-1 rounded-md border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:text-muted-foreground"
                        placeholder={isHomePage ? "home" : "page-url"}
                      />
                    </div>
                  </div>
                </div>

                {/* Home Page Toggle */}
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted p-4 text-muted-foreground">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Home Page
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Set as root URL (/)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsHomePage(!isHomePage)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isHomePage ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`inline-block size-4 rounded-full bg-background transition-transform${
                        isHomePage ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* 404 Page Toggle */}
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted p-4 text-muted-foreground">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      404 Page
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Show when route not found
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIs404Page(!is404Page)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      is404Page ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`inline-block size-4 rounded-full bg-background transition-transform${
                        is404Page ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Page Image */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
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
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Meta Title
                    </label>
                    <textarea
                      value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                      rows={2}
                      className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Page title (50-60 characters)"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Meta Description
                    </label>
                    <textarea
                      value={pageDescription}
                      onChange={(e) => setPageDescription(e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Meta description (150-160 characters)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Keywords
                      </label>
                      <input
                        type="text"
                        value={pageKeywords}
                        onChange={(e) => setPageKeywords(e.target.value)}
                        className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="keyword1, keyword2"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Author
                      </label>
                      <input
                        type="text"
                        value={pageAuthor}
                        onChange={(e) => setPageAuthor(e.target.value)}
                        className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Author name"
                      />
                    </div>
                  </div>
                </div>

                {/* Open Graph - Collapsible */}
                <div className="overflow-hidden rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setOgExpanded(!ogExpanded)}
                    className="flex w-full items-center justify-between bg-muted p-4 text-muted-foreground transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Open Graph (Social Media)
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Optional
                      </span>
                    </div>
                    <TbChevronDown
                      className={`text-muted-foreground transition-transform ${
                        ogExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {ogExpanded && (
                    <div className="space-y-4 border-t border-border bg-background p-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">
                          OG Title
                        </label>
                        <input
                          type="text"
                          value={ogTitle}
                          onChange={(e) => setOgTitle(e.target.value)}
                          className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Leave empty to use page title"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">
                          OG Description
                        </label>
                        <textarea
                          value={ogDescription}
                          onChange={(e) => setOgDescription(e.target.value)}
                          rows={2}
                          className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Leave empty to use page description"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">
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
                        <label className="mb-2 block text-sm font-medium text-foreground">
                          OG Type
                        </label>
                        <select
                          value={ogType}
                          onChange={(e) => setOgType(e.target.value)}
                          className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                <div className="overflow-hidden rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setTwitterExpanded(!twitterExpanded)}
                    className="flex w-full items-center justify-between bg-muted p-4 text-muted-foreground transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Twitter/X Card
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Optional
                      </span>
                    </div>
                    <TbChevronDown
                      className={`text-muted-foreground transition-transform ${
                        twitterExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {twitterExpanded && (
                    <div className="space-y-4 border-t border-border bg-background p-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">
                          Card Type
                        </label>
                        <select
                          value={twitterCard}
                          onChange={(e) => setTwitterCard(e.target.value)}
                          className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="summary_large_image">
                            Summary Large Image
                          </option>
                          <option value="summary">Summary</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-foreground">
                            Site
                          </label>
                          <input
                            type="text"
                            value={twitterSite}
                            onChange={(e) => setTwitterSite(e.target.value)}
                            className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="@yourusername"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-foreground">
                            Creator
                          </label>
                          <input
                            type="text"
                            value={twitterCreator}
                            onChange={(e) => setTwitterCreator(e.target.value)}
                            className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Canonical URL
                  </label>
                  <input
                    type="text"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    className="w-full rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Leave empty for auto-generated"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Specify a canonical URL to prevent duplicate content issues
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t bg-muted p-6 text-muted-foreground">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2 font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-foreground transition-colors hover:bg-primary"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};
