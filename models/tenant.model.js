const mongoose = require("mongoose");

const TenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    domain: String,
    subdomain: { type: String, unique: true, required: true },
    theme: String,
    branding: {
      logo: String,
      primaryColor: String,
      secondaryColor: String,
      accentColor: String,
    },
    settings: {
      showToolbar: { type: Boolean, default: true },
      showSidebar: { type: Boolean, default: true },
      allowCustomCSS: { type: Boolean, default: false },
      restrictedComponents: [String],
    },
    webhooks: {
      onSave: String,
      onLoad: String,
    },
  },
  { timestamps: true }
);

const Tenant = mongoose.models.Tenant || mongoose.model("Tenant", TenantSchema);

module.exports = Tenant;
