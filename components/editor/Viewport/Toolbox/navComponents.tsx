import { Element } from "@craftjs/core";
import { Button } from "components/selectors/Button";
import { ButtonList } from "components/selectors/ButtonList";
import { Container } from "components/selectors/Container";
import {
  TbBrandTwitter,
  TbDeviceMobile,
  TbLayoutNavbar,
  TbMinus,
  TbPill
} from "react-icons/tb";
import { RenderToolComponent, ToolboxItemDisplay } from "./lib";

// Social media icons
const socialIcons = {
  twitter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.98-.49-.98-.98s.49-.98.98-.98.98.49.98.98-.49.98-.98.98zm-2.448 9.281c-1.297 0-2.448-.49-3.323-1.297-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297z"/></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
};

export const NavToolbox = {
  title: "Navigation",
  content: [
    <RenderToolComponent
      key="mobile-menu"
      display={<ToolboxItemDisplay icon={TbDeviceMobile} label="Mobile Menu" />}
      element={ButtonList}
      custom={{ displayName: "Mobile Menu" }}
      root={{
      }}
      mobile={{
        display: "flex",
        justifyContent: "justify-between",
        alignItems: "items-center",
        gap: "gap-2"
      }}
    >
      <Element
        is={Button}
        custom={{ displayName: "Home" }}
        text="Home"
        url="#"
        root={{
        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
          display: "hidden"
        }}
        desktop={{
          display: "block"
        }}
      />

      <Element
        is={Button}
        custom={{ displayName: "About Us" }}
        text="About Us"
        url="#"
        root={{
        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
          display: "hidden"
        }}
        desktop={{
          display: "block"
        }}
      />

      <Element
        is={Button}
        custom={{ displayName: "Contact us" }}
        text="Contact us"
        url="#"
        root={{
        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
          display: "hidden"
        }}
        desktop={{
          display: "block"
        }}
      />

      {/* Hamburger Button */}
      <Button
        text="Hamburger Button"
        url=""
        clickType="click"
        clickDirection="show"
        clickValue="mobile-menu"
        icon={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>`}
        iconOnly={true}
        root={{

          border: "border-0"
        }}
        mobile={{
          display: "block",
          p: "p-2"
        }}
        desktop={{
          display: "hidden"
        }}
      />

      {/* Mobile Navigation Overlay */}
      <Element
        canvas
        id={`mobile-menu`}
        is={Container}
        custom={{ displayName: "Mobile Menu Overlay" }}
        canDelete={false}
        canEditName={false}
        root={{
          background: "bg-black",
          bgOpacity: "bg-opacity-50",
        }}
        mobile={{
          display: "hidden",
          position: "absolute",
          height: "h-full",
          width: "w-full",
          top: "top-0",
          left: "left-0",
          right: "right-0",
          bottom: "bottom-0",
          zIndex: "z-50"
        }}
        desktop={{
          display: "hidden",
        }}
        clickType="click"
        clickDirection="close"
        clickValue={`mobile-menu`}
      >
        <Element
          canvas
          id={`mobile-menu-panel`}
          is={Container}
          custom={{ displayName: "Mobile Menu Panel" }}
          canDelete={false}
          canEditName={false}
          root={{
            background: "bg-white",
            shadow: "shadow-xl",
          }}
          mobile={{
            position: "absolute",
            height: "h-full",
            width: "w-80",
            maxWidth: "max-w-sm",
            transform: "transform"
          }}
          clickType="click"
          clickDirection="stop"
        >


          {/* Mobile Nav Header */}
          <Element
            canvas
            id={`mobile-menu-header`}
            is={Container}
            custom={{ displayName: "Mobile Nav Header" }}
            canDelete={false}
            canEditName={false}
            root={{
              borderBottom: "border-b"
            }}
            mobile={{
              display: "flex",
              alignItems: "items-center",
              justifyContent: "justify-between",
              p: "p-4"
            }}
          >


            <Element
              canvas
              id={`mobile-menu-close`}
              is={Button}
              custom={{ displayName: "Mobile Nav Close" }}
              canDelete={false}
              canEditName={false}
              clickType="click"
              clickDirection="hide"
              clickValue={`mobile-menu`}
              text="×"
              url=""
              root={{

                border: "border-0"
              }}
              mobile={{
                p: "p-2",
                fontSize: "text-xl",
                fontWeight: "font-bold"
              }}
            />
          </Element>



          {/* Mobile Navigation Items - Uses ButtonList */}
          <Element
            canvas
            id={`mobile-menu-items`}
            is={ButtonList}
            custom={{ displayName: "Mobile Navigation" }}
            canDelete={false}
            canEditName={false}
            root={{

              border: "border-0",
            }}
            mobile={{
              display: "flex",
              flexDirection: "flex-col",
              gap: "gap-2",
              width: "w-full",
            }}
          />
        </Element>
      </Element>
    </RenderToolComponent>,

    <RenderToolComponent
      key="social-nav"
      display={<ToolboxItemDisplay icon={TbBrandTwitter} label="Social Nav" />}
      element={ButtonList}
      custom={{ displayName: "Social Nav" }}
      root={{
        background: "bg-gray-50",
        radius: "rounded-lg",
        px: "px-4",
        py: "py-2"
      }}
      mobile={{
        display: "flex",
        flexDirection: "flex-row",
        alignItems: "items-center",
        gap: "gap-4"
      }}
      desktop={{
        display: "flex",
        flexDirection: "flex-row",
        alignItems: "items-center",
        gap: "gap-4"
      }}
    >
      <Element
        is={Button}
        custom={{ displayName: "Twitter" }}
        text="Twitter"
        icon={socialIcons.twitter}
        iconOnly={true}
        url="#"
        root={{
          background: "bg-blue-500",
          color: "text-white",
          radius: "rounded-lg",

          shadow: "shadow-lg"
        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
      <Element
        is={Button}
        custom={{ displayName: "Facebook" }}
        text="Facebook"
        icon={socialIcons.facebook}
        iconOnly={true}
        url="#"
        root={{
          background: "bg-blue-600",
          color: "text-white",
          radius: "rounded-lg",

          shadow: "shadow-lg"
        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
      <Element
        is={Button}
        custom={{ displayName: "Instagram" }}
        text="Instagram"
        icon={socialIcons.instagram}
        iconOnly={true}
        url="#"
        root={{
          background: "bg-gradient-to-r from-purple-500 to-pink-500",
          color: "text-white",
          radius: "rounded-lg",

          shadow: "shadow-lg"
        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
      <Element
        is={Button}
        custom={{ displayName: "LinkedIn" }}
        text="LinkedIn"
        icon={socialIcons.linkedin}
        iconOnly={true}
        url="#"
        root={{
          background: "bg-blue-700",
          color: "text-white",
          radius: "rounded-lg",

          shadow: "shadow-lg"
        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
    </RenderToolComponent>,
    <RenderToolComponent
      key="plain-nav"
      display={<ToolboxItemDisplay icon={TbMinus} label="Plain Nav" />}
      element={ButtonList}
      custom={{ displayName: "Plain Nav" }}
      root={{
        background: "bg-gray-100",
        radius: "rounded-lg",
        px: "px-3",
        py: "py-2"
      }}
      mobile={{
        display: "flex",
        flexDirection: "flex-row",
        alignItems: "items-center",
        gap: "gap-3"
      }}
      desktop={{
        display: "flex",
        flexDirection: "flex-row",
        alignItems: "items-center",
        gap: "gap-3"
      }}
    >
      <Element
        is={Button}
        custom={{ displayName: "Home" }}
        text="Home"
        url="#"
        root={{



        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
      <Element
        is={Button}
        custom={{ displayName: "About" }}
        text="About"
        url="#"
        root={{



        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
      <Element
        is={Button}
        custom={{ displayName: "Services" }}
        text="Services"
        url="#"
        root={{



        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
      <Element
        is={Button}
        custom={{ displayName: "Contact" }}
        text="Contact"
        url="#"
        root={{



        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
    </RenderToolComponent>,
    <RenderToolComponent
      key="minimal-nav"
      display={<ToolboxItemDisplay icon={TbLayoutNavbar} label="Minimal Nav" />}
      element={ButtonList}
      custom={{ displayName: "Minimal Nav" }}
      root={{

        px: "px-2",
        py: "py-1"
      }}
      mobile={{
        display: "flex",
        flexDirection: "flex-row",
        alignItems: "items-center",
        gap: "gap-4"
      }}
      desktop={{
        display: "flex",
        flexDirection: "flex-row",
        alignItems: "items-center",
        gap: "gap-4"
      }}
    >
      <Element
        is={Button}
        custom={{ displayName: "Home" }}
        text="Home"
        url="#"
        root={{



        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
      <Element
        is={Button}
        custom={{ displayName: "About" }}
        text="About"
        url="#"
        root={{



        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
      <Element
        is={Button}
        custom={{ displayName: "Services" }}
        text="Services"
        url="#"
        root={{



        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
      <Element
        is={Button}
        custom={{ displayName: "Contact" }}
        text="Contact"
        url="#"
        root={{



        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
    </RenderToolComponent>,
    <RenderToolComponent
      key="pill-nav"
      display={<ToolboxItemDisplay icon={TbPill} label="Pill Nav" />}
      element={ButtonList}
      custom={{ displayName: "Pill Nav" }}
      root={{
        background: "bg-gray-100",
        radius: "rounded-full",
        px: "px-2",
        py: "py-1"
        ,
        shadow: "shadow-lg"
      }}
      mobile={{
        display: "flex",
        flexDirection: "flex-row",
        alignItems: "items-center",
        gap: "gap-1"
      }}
      desktop={{
        display: "flex",
        flexDirection: "flex-row",
        alignItems: "items-center",
        gap: "gap-1"
      }}
    >
      <Element
        is={Button}
        custom={{ displayName: "Home" }}
        text="Home"
        url="#"
        root={{


          radius: "rounded-full",

        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
      <Element
        is={Button}
        custom={{ displayName: "About" }}
        text="About"
        url="#"
        root={{


          radius: "rounded-full",

        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
      <Element
        is={Button}
        custom={{ displayName: "Contact" }}
        text="Contact"
        url="#"
        root={{


          radius: "rounded-full",

        }}
        mobile={{
          p: "p-[var(--ph-button-padding)]",
        }}
      />
    </RenderToolComponent>,
  ],
  classes: {
    content: "p-3 grid grid-cols-2 gap-3",
  },
};
