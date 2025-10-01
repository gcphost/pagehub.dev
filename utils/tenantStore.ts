import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { injectTenantColors, removeTenantColors } from "./tenantColors";

export interface Tenant {
  _id: string;
  name: string;
  domain: string;
  subdomain: string;
  theme: string;
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
  settings?: {
    showToolbar?: boolean;
    showSidebar?: boolean;
    allowCustomCSS?: boolean;
    restrictedComponents?: string[];
  };
  webhooks?: {
    onSave?: string;
    onLoad?: string;
  };
}

// Atoms
export const tenantAtom = atom<Tenant | null>({
  key: "tenantAtom",
  default: null,
});

export const tenantLoadingAtom = atom<boolean>({
  key: "tenantLoadingAtom",
  default: false,
});

// Selectors
export const tenantBrandingSelector = selector({
  key: "tenantBrandingSelector",
  get: ({ get }) => {
    const tenant = get(tenantAtom);
    return tenant?.branding || {};
  },
});

export const tenantSettingsSelector = selector({
  key: "tenantSettingsSelector",
  get: ({ get }) => {
    const tenant = get(tenantAtom);
    return tenant?.settings || {};
  },
});

export const tenantThemeSelector = selector({
  key: "tenantThemeSelector",
  get: ({ get }) => {
    const tenant = get(tenantAtom);
    return tenant?.theme || "default";
  },
});

// Helper hooks for common use cases
export const useTenant = () => {
  return useRecoilValue(tenantAtom);
};

export const useSetTenant = () => {
  const setTenant = useSetRecoilState(tenantAtom);

  return (tenant: Tenant | null) => {
    setTenant(tenant);

    // Inject tenant colors when tenant is set
    if (tenant?.branding) {
      injectTenantColors(tenant.branding);
    } else {
      removeTenantColors();
    }
  };
};

export const useTenantState = () => {
  return useRecoilState(tenantAtom);
};

export const useTenantLoading = () => {
  return useRecoilValue(tenantLoadingAtom);
};

export const useSetTenantLoading = () => {
  return useSetRecoilState(tenantLoadingAtom);
};

export const useTenantBranding = () => {
  return useRecoilValue(tenantBrandingSelector);
};

export const useTenantSettings = () => {
  return useRecoilValue(tenantSettingsSelector);
};

export const useTenantTheme = () => {
  return useRecoilValue(tenantThemeSelector);
};

// Helper hook to update branding
export const useUpdateTenantBranding = () => {
  const [tenant, setTenant] = useRecoilState(tenantAtom);

  return (branding: Partial<Tenant["branding"]>) => {
    if (!tenant) return;

    const updatedTenant = {
      ...tenant,
      branding: { ...tenant.branding, ...branding },
    };

    setTenant(updatedTenant);

    // Inject updated colors
    if (updatedTenant.branding) {
      injectTenantColors(updatedTenant.branding);
    }
  };
};

// Helper hook to update settings
export const useUpdateTenantSettings = () => {
  const [tenant, setTenant] = useRecoilState(tenantAtom);

  return (settings: Partial<Tenant["settings"]>) => {
    if (!tenant) return;

    setTenant({
      ...tenant,
      settings: { ...tenant.settings, ...settings },
    });
  };
};
