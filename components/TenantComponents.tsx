import { useTenant, useTenantBranding, useTenantSettings } from '../utils/tenantStore'

// Example component that shows/hides based on tenant settings
export const ConditionalToolbar = ({ children }) => {
  const settings = useTenantSettings()

  if (!settings.showToolbar) {
    return null
  }

  return <>{children}</>
}

// Example component that uses tenant branding colors
export const BrandedButton = ({ children, className = "", ...props }) => {
  const branding = useTenantBranding()

  const style = {
    backgroundColor: branding.primaryColor || '#3b82f6',
    color: branding.accentColor || '#ffffff',
    ...props.style
  }

  return (
    <button
      className={`px-4 py-2 rounded ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  )
}

// Example component that shows tenant name
export const TenantHeader = () => {
  const tenant = useTenant()

  if (!tenant) return null

  return (
    <div className="bg-gray-100 p-2 text-sm">
      <span className="font-semibold">{tenant.name}</span>
      {tenant.branding?.logo && (
        <img
          src={tenant.branding.logo}
          alt={`${tenant.name} logo`}
          className="h-6 w-auto ml-2 inline"
        />
      )}
    </div>
  )
}
