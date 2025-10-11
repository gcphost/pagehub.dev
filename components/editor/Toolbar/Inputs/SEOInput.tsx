import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { ImageUploadInput } from "./ImageUploadInput";

const SEOInput = () => (
  <>
    <ToolbarSection title="SEO - Basic">
      <ToolbarItem
        propKey="pageTitle"
        propType="component"
        type="textarea"
        rows={2}
        label="Title"
        placeholder="Page title (50-60 characters)"
      />

      <ToolbarItem
        propKey="pageDescription"
        propType="component"
        type="textarea"
        rows={3}
        label="Description"
        placeholder="Meta description (150-160 characters)"
      />

      <ToolbarItem
        propKey="pageKeywords"
        propType="component"
        type="text"
        label="Keywords"
        placeholder="keyword1, keyword2, keyword3"
      />

      <ToolbarItem
        propKey="pageAuthor"
        propType="component"
        type="text"
        label="Author"
        placeholder="Author name"
      />
    </ToolbarSection>

    <ToolbarSection title="SEO - Social Media (Open Graph)" subtitle={true}>
      <ToolbarItem
        propKey="ogTitle"
        propType="component"
        type="text"
        label="OG Title"
        placeholder="Leave empty to use page title"
      />

      <ToolbarItem
        propKey="ogDescription"
        propType="component"
        type="textarea"
        rows={2}
        label="OG Description"
        placeholder="Leave empty to use page description"
      />

      <ImageUploadInput
        propKey="ogImage"
        label="OG Image"
        help="Recommended: 1200x630px. This appears when sharing on social media."
      />

      <ToolbarItem
        propKey="ogType"
        propType="component"
        type="select"
        label="OG Type"
      >
        <option value="website">Website</option>
        <option value="article">Article</option>
        <option value="product">Product</option>
        <option value="profile">Profile</option>
      </ToolbarItem>
    </ToolbarSection>

    <ToolbarSection title="SEO - Twitter/X Card" subtitle={true}>
      <ToolbarItem
        propKey="twitterCard"
        propType="component"
        type="select"
        label="Card Type"
      >
        <option value="summary_large_image">Summary Large Image</option>
        <option value="summary">Summary</option>
      </ToolbarItem>

      <ToolbarItem
        propKey="twitterSite"
        propType="component"
        type="text"
        label="Twitter Site"
        placeholder="@yourusername"
      />

      <ToolbarItem
        propKey="twitterCreator"
        propType="component"
        type="text"
        label="Twitter Creator"
        placeholder="@authorusername"
      />
    </ToolbarSection>

    <ToolbarSection title="SEO - Advanced" subtitle={true}>
      <ToolbarItem
        propKey="canonicalUrl"
        propType="component"
        type="text"
        label="Canonical URL"
        placeholder="Leave empty for auto-generated"
      />

      <ToolbarItem
        propKey="robots"
        propType="component"
        type="select"
        label="Robots"
      >
        <option value="">Default (index, follow)</option>
        <option value="noindex">No Index</option>
        <option value="nofollow">No Follow</option>
        <option value="noindex, nofollow">No Index, No Follow</option>
      </ToolbarItem>

      <ToolbarItem
        propKey="themeColor"
        propType="component"
        type="text"
        label="Theme Color"
        placeholder="#000000"
      />
    </ToolbarSection>
  </>
);

export default SEOInput;
