const mongoose = require("mongoose");

// Import the Tenant model
const Tenant = require("../models/tenant.model");

async function createTestTenant() {
  try {
    // Connect to MongoDB using the same pattern as the app
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/buildapage";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create test tenant with custom branding colors
    const testTenant = new Tenant({
      name: "Color Test Tenant",
      subdomain: "subdomain",
      domain: null, // No custom domain for now
      branding: {
        primaryColor: "#ff6b6b", // Red primary
        secondaryColor: "#4ecdc4", // Teal secondary
        accentColor: "#ffe66d", // Yellow accent
      },
      settings: {
        showToolbar: true,
        showSidebar: true,
        allowCustomCSS: true,
        restrictedComponents: [],
      },
      webhooks: {
        onSave: "/api/test-webhook", // Internal test webhook
        onLoad: "/api/test-webhook", // Internal test webhook
      },
      theme: "default",
    });

    // Save the tenant
    await testTenant.save();
    console.log("Test tenant created successfully:", testTenant);

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error creating test tenant:", error);
    process.exit(1);
  }
}

// Run the script
createTestTenant();
