import { ROOT_NODE } from "@craftjs/core";

// Default placeholder values for company variables
const DEFAULT_VALUES: Record<string, string> = {
  "company.name": "Acme Inc.",
  "company.type": "technology",
  "company.location": "Los Angeles, CA",
  "company.address": "123 Main St, Suite 100 Los Angeles, CA 90001",
  "company.phone": "(555) 123-4567",
  "company.email": "contact@acme.com",
  "company.website": "https://www.acme.com",
};

/**
 * Replaces variables in text with values from ROOT_NODE props
 * Supports syntax like: {{company.name}}, {{company.email}}, {{year}}, etc.
 * Uses default placeholder values when variables are not set.
 *
 * @param text - The text containing variable placeholders
 * @param query - The Craft.js query object to access ROOT_NODE
 * @returns Text with variables replaced by actual values or defaults
 */
export const replaceVariables = (
  text: string | undefined,
  query: any,
): string => {
  if (!text || typeof text !== "string") return text || "";

  try {
    const root = query.node(ROOT_NODE).get();
    if (!root) return text;

    const rootProps = root.data.props;

    // Replace variables like {{company.name}}, {{company.email}}, etc.
    return text.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
      const trimmedVar = variable.trim();

      // Handle special dynamic variables
      if (trimmedVar === "year") {
        return new Date().getFullYear().toString();
      }

      // Parse nested properties (e.g., "company.name" -> rootProps.company.name)
      const parts = trimmedVar.split(".");
      let value: any = rootProps;

      for (const part of parts) {
        if (value && typeof value === "object" && part in value) {
          value = value[part];
        } else {
          // Variable not found, use default placeholder if available
          const defaultValue = DEFAULT_VALUES[trimmedVar];
          return defaultValue !== undefined ? defaultValue : match;
        }
      }

      // Return the value if found and not empty, otherwise use default
      if (value !== undefined && value !== null && value !== "") {
        return String(value);
      }

      // Use default placeholder if available, otherwise return original
      const defaultValue = DEFAULT_VALUES[trimmedVar];
      return defaultValue !== undefined ? defaultValue : match;
    });
  } catch (e) {
    console.error("Error replacing variables:", e);
    return text;
  }
};

/**
 * Get available variables from ROOT_NODE for display/autocomplete
 */
export const getAvailableVariables = (query: any): string[] => {
  try {
    const root = query.node(ROOT_NODE).get();
    if (!root) return [];

    const rootProps = root.data.props;
    const variables: string[] = [];

    // Add company variables if they exist
    if (rootProps.company && typeof rootProps.company === "object") {
      Object.keys(rootProps.company).forEach((key) => {
        if (rootProps.company[key]) {
          variables.push(`company.${key}`);
        }
      });
    }

    return variables;
  } catch (e) {
    console.error("Error getting available variables:", e);
    return [];
  }
};
