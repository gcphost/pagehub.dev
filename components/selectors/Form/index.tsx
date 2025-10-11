import { Element, useEditor, useNode } from "@craftjs/core";
import { DeleteNodeController } from "components/editor/NodeControllers/DeleteNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import TextSettingsNodeTool from "components/editor/NodeControllers/Tools/TextSettingsNodeTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { SaveSubmissions } from "components/editor/Viewport/lib";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { SettingsAtom } from "utils/atoms";

import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import { Button } from "../Button";
import { Container } from "../Container";
import { FormElement } from "../FormElement";
import { Text } from "../Text";
import { useScrollToSelected } from "../lib";
import { FormSettings } from "./FormSettings";

export const FormDrop = ({
  children,
  canDelete = true,
  action = "",
  method = "POST",
  submissions = [],
  formType = "subscribe",
  ...props
}) => {
  const {
    id,
    connectors: { connect, drag },
  } = useNode();

  const { enabled, query } = useEditor((state) => ({
    enabled: state.options.enabled,
    ...getClonedState(props, state),
  }));

  useScrollToSelected(id, enabled);

  props = setClonedProps(props, query);

  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const settings = useRecoilValue(SettingsAtom);

  useEffect(() => {
    const fnu = () => {
      setLoaded(true);
      setLoading(false);
    };

    document.querySelector("iframe").addEventListener("load", fnu, true);

    return document.querySelector("iframe").removeEventListener("load", fnu);
  }, []);

  return (
    <Container
      {...props}
      canDelete={canDelete}
      type="form"
      action={action}
      method={method}
      target="iframe"
      role="form"
      aria-label={props.formName || "Contact form"}
      onSubmit={async (e: any) => {
        e.preventDefault();
        if (enabled) return;

        setLoaded(false);
        setLoading(true);

        if (props.type === "iframe") return;

        const form = e.target;
        const fields = form.querySelectorAll("input, select, textarea");
        const formData: any = {};
        const additional: any = {};

        if (props.mailto) {
          additional.mailTo = props.mailto;
        }
        if (props.formName) {
          additional.formName = props.formName;
        }

        fields.forEach((field) => {
          if (field.type !== "file") {
            // selects??
            formData[field.name] = field.value;
          }
        });

        SaveSubmissions(formData, settings, additional);

        setTimeout(() => {
          setLoaded(true);
          setLoading(false);
        }, 1000);
      }}
    >
      {!loading &&
        !loaded &&
        (!enabled || !props.view || props.view === "") &&
        children}
      {(loading || (enabled && props.view === "loading")) && (
        <Element
          canvas
          id="loadingTextContainer"
          is={Container}
          canDelete={true}
          canEditName={true}
          mobile={{
            display: "flex",
            justifyContent: "justify-center",
            flexDirection: "flex-col",
            width: "w-full",
            gap: "gap-3",
            px: "px-6",
            py: "py-6",
          }}
          desktop={{
            flexDirection: "flex-row",
          }}
          custom={{
            displayName: "Loading Text Container",
            id: "loadingTextContainer",
          }}
        >
          <Element
            canvas
            id="loadingText"
            is={Text}
            custom={{ displayName: "Loading Text", id: "loadingText" }}
            canDelete={true}
            canEditName={true}
            text={props.loading || "Sending..."}
          />
        </Element>
      )}
      {(loaded || (enabled && props.view === "loaded")) && (
        <Element
          canvas
          id="sentTextContainer"
          is={Container}
          canDelete={true}
          canEditName={true}
          mobile={{
            display: "flex",
            justifyContent: "justify-center",
            flexDirection: "flex-col",
            width: "w-full",
            gap: "gap-3",
            px: "px-6",
            py: "py-6",
          }}
          desktop={{
            flexDirection: "flex-row",
          }}
          custom={{
            displayName: "Sent Text Container",
            id: "sentTextContainer",
          }}
        >
          <Element
            canvas
            id="sentText"
            is={Text}
            custom={{ displayName: "Sent Text", id: "sentText" }}
            canDelete={true}
            canEditName={true}
            text={"Thank you!"}
          />
        </Element>
      )}
    </Container>
  );
};

FormDrop.craft = {
  ...Container.craft,
  canDelete: true,
  canDrag: () => true,

  rules: {
    ...Container.craft.rules,
    canMoveIn: (nodes) =>
      nodes.every(
        (node) =>
          node.data?.type !== "Form" && node.data?.props?.type !== "form",
      ),
  },
  displayName: "Form",
  related: {
    toolbar: FormSettings,
  },
};

export const Form = (props: any) => {
  const formType = props.formType || "subscribe";

  // Base styles for form inputs - using style guide
  const inputBaseStyles = {
    root: {
      border: "border",
      borderWidth: "border-[var(--ph-input-border-width)]",
      borderStyle: "border-solid",
      borderColor: "border-[color:var(--ph-input-border-color)]",
      radius: "rounded-[var(--ph-input-border-radius)]",
      background: "bg-[var(--ph-input-bg-color)]",
      color: "text-[color:var(--ph-input-text-color)]",
      placeholderColor:
        "placeholder:text-[color:var(--ph-input-placeholder-color)]",
      focus: {
        ring: "ring ring-[var(--ph-input-focus-ring)]",
        ringColor: "ring-[color:var(--ph-input-focus-ring-color)]",
        outline: "outline-none",
      },
    },
    mobile: {
      p: "p-[var(--ph-input-padding)]",
      width: "w-full",
    },
  };

  return (
    <FormDrop
      canDelete={true}
      formType={formType}
      mobile={{
        mx: "mx-auto",
        display: "flex",
        justifyContent: "justify-center",
        flexDirection: "flex-col",
        width: "w-full",
        gap: "gap-3",
      }}
      desktop={{ flexDirection: "flex-col", alignItems: "items-center" }}
      root={{}}
      {...props}
    >
      <Element
        canvas
        id="formContainer"
        is={Container}
        canDelete={true}
        canEditName={true}
        mobile={{
          display: "flex",
          justifyContent: "justify-center",
          flexDirection: "flex-col",
          width: "w-full",
          gap: "gap-3",
          mx: "mx-auto",
        }}
        custom={{ displayName: "Fields" }}
      >
        {formType === "contact" && (
          <Element
            canvas
            id="formNameInput"
            is={FormElement}
            custom={{ displayName: "Name Input" }}
            type="text"
            placeholder="Your name"
            canDelete={true}
            canEditName={true}
            {...inputBaseStyles}
            name="name"
          />
        )}

        <Element
          canvas
          id="formEmailInput"
          is={FormElement}
          custom={{ displayName: "Email Input" }}
          type="email"
          placeholder="your@email.com"
          canDelete={true}
          canEditName={true}
          {...inputBaseStyles}
          name="email"
        />

        {formType === "contact" && (
          <Element
            canvas
            id="formMessageInput"
            is={FormElement}
            custom={{ displayName: "Message Input" }}
            type="textarea"
            placeholder="Your message..."
            canDelete={true}
            canEditName={true}
            {...inputBaseStyles}
            name="message"
          />
        )}
      </Element>

      <Element
        canvas
        id="formSubmitButton"
        is={Button}
        custom={{ displayName: "Submit Button" }}
        type="submit"
        text={formType === "subscribe" ? "Subscribe" : "Send Message"}
        root={{
          background: "bg-transparent",
          color: "text-palette:Primary",
          radius: "style:borderRadius",
          border: "border",
          borderColor: "border-palette:Primary",
          fontFamily: "style:headingFontFamily",
        }}
        mobile={{
          p: "style:buttonPadding",
          fontWeight: "style:headingFont",
          textAlign: "text-center",
          display: "flex",
          justifyContent: "justify-center",
          alignItems: "items-center",
          gap: "gap-4",
        }}
        canDelete={true}
        canEditName={true}
      />
    </FormDrop>
  );
};

Form.craft = {
  // ...Container.craft,
  canDelete: true,
  rules: {
    canDrag: () => true,
    canMoveIn: (nodes) =>
      nodes.every(
        (node) =>
          node.data?.type !== "Form" && node.data?.props?.type !== "form",
      ),
  },
  displayName: "Form",
  related: {
    toolbar: FormSettings,
  },
  props: {
    tools: () => {
      const baseControls = [
        <HoverNodeController
          key="formHoverController"
          position="top"
          align="start"
          placement="end"
          alt={{
            position: "bottom",
            align: "start",
            placement: "start",
          }}
        />,

        <DeleteNodeController key="formDelete" />,
        <ToolNodeController
          position="bottom"
          align="start"
          key="formSettingsController"
        >
          <TextSettingsNodeTool />
        </ToolNodeController>,
      ];

      return [...baseControls];
    },
  },
};
