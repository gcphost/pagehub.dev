import { Element, useEditor, useNode } from "@craftjs/core";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import TextSettingsNodeTool from "components/editor/NodeControllers/Tools/TextSettingsNodeTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { TabAtom } from "components/editor/Viewport";
import { SaveSubmissions } from "components/editor/Viewport/lib";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { selectAfterAdding } from "utils/lib";

import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import { Button } from "../Button";
import { Container } from "../Container";
import { FormElement } from "../FormElement";
import { Text } from "../Text";
import { useScrollToSelected } from "../lib";
import { FormSettings } from "./FormSettings";

export const FormDrop = ({
  children,
  canDelete = false,
  action = "",
  method = "POST",
  submissions = [],
  ...props
}) => {
  const { id } = useNode();

  const { actions, enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  useScrollToSelected(id, enabled);
  selectAfterAdding(
    actions.selectNode,
    useSetRecoilState(TabAtom),
    id,
    enabled
  );

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
      canDelete={false}
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
      {!loading && !loaded && !props.view && children}
      {(loading || enabled || props.view === "loading") && (
        <Element
          canvas
          id="loadingTextContainer"
          is={Container}
          canDelete={true}
          canEditName={true}
          mobile={{
            display: "flex",
            justifyContent: "justify-center",
            flexDirection: "flex-row",
            width: "w-full",
            gap: "gap-3",
            px: "px-6",
            py: "py-6",
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
      {(loaded || enabled || props.view === "loaded") && (
        <Element
          canvas
          id="sentTextContainer"
          is={Container}
          canDelete={true}
          canEditName={true}
          mobile={{
            display: "flex",
            justifyContent: "justify-center",
            flexDirection: "flex-row",
            width: "w-full",
            gap: "gap-3",
            px: "px-6",
            py: "py-6",
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
  // ...Container.craft,
  canDelete: false,
  rules: {
    canMoveIn: (nodes) =>
      nodes.every(
        (node) =>
          node.data?.type !== "Form" && node.data?.props?.type !== "form"
      ),
  },
  displayName: "Form",
  related: {
    toolbar: FormSettings,
  },
};

export const Form = (props: any) => {
  const { query } = useEditor((state) => getClonedState(props, state));

  props = setClonedProps(props, query);

  return (
    <Container {...props}>
      {
        <Element
          canvas
          is={FormDrop}
          id="formDrop"
          canDelete={false}
          mobile={{
            py: "py-3",
            px: "px-3",
            mx: "mx-auto",
            display: "flex",
            justifyContent: "justify-center",
            flexDirection: "flex-col",
            width: "w-full",
            gap: "gap-3",
          }}
          desktop={{ flexDirection: "flex-col", alignItems: "items-center" }}
          root={{}}
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
              flexDirection: "flex-row",
              width: "w-full",
              gap: "gap-3",
              px: "px-6",
              py: "py-6",
            }}
            custom={{ displayName: "Form Container" }}
          >
            <Element
              canvas
              is={Container}
              id="itemContainer"
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
              custom={{ displayName: "Item Container" }}
            >
              <Element
                canvas
                is={Text}
                custom={{ displayName: "Leading Text" }}
                canDelete={true}
                canEditName={true}
              />

              <Element
                canvas
                is={FormElement}
                custom={{ displayName: "Email Input" }}
                type="email"
                placeholder="Email"
                canDelete={true}
                canEditName={true}
                root={{ color: "text-black", background: "bg-white" }}
                name="email"
              />
            </Element>
          </Element>

          <Element
            canvas
            is={Button}
            custom={{ displayName: "Submit Button" }}
            buttons={[{ type: "submit", text: "Submit" }]}
            mobile={{ px: "px-6", py: "py-3" }}
            canDelete={true}
            canEditName={true}
          />
        </Element>
      }
    </Container>
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
          node.data?.type !== "Form" && node.data?.props?.type !== "form"
      ),
  },
  displayName: "Form Parent",
  props: {
    tools: () => {
      const baseControls = [
        <NameNodeController
          position="top"
          align="end"
          placement="start"
          key="formNameController"
        />,
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
