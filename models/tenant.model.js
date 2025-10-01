const mongoose = require("mongoose");

const TenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    domain: String, // Custom domain for the editor/builder
    domains: [{ type: String, index: true }], // Array of domains for static sites
    subdomain: { type: String, unique: true, required: true },
    theme: String,
    branding: {
      logo: String,
      primaryColor: String,
      secondaryColor: String,
      accentColor: String,
    },
    settings: {
      siteTitle: String,
      showToolbar: { type: Boolean, default: true },
      showSidebar: { type: Boolean, default: true },
      allowCustomCSS: { type: Boolean, default: false },
      restrictedComponents: [String],
    },
    webhooks: {
      onSave: String,
      onLoad: String,
      fetchPage: String,
      fetchPageList: String,
    },
  },
  { timestamps: true }
);

// Index domains array for fast lookups
TenantSchema.index({ domains: 1 });

const Tenant = mongoose.models.Tenant || mongoose.model("Tenant", TenantSchema);

module.exports = Tenant;
