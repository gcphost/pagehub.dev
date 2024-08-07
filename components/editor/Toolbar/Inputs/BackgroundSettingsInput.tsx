import { TailwindStyles } from "utils/tailwind";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { FileUploadInput } from "./FileUploadInput";

export const BackgroundSettingsInput = ({ props }) => (
  <>
    <FileUploadInput
      props={props}
      propKey="backgroundImage"
      typeKey="backgroundImageType"
      contentKey="backgroundImage"
    />

    {props?.backgroundImage && (
      <ToolbarSection title="Image Settings" subtitle={true}>
        <ToolbarSection full={2}>
          <ToolbarItem
            propKey={"backgroundRepeat"}
            propType="class"
            type="select"
            label={"Repeat"}
          >
            <option value="">None</option>
            {TailwindStyles.backgroundRepeat.map((_, k) => (
              <option key={_}>{_}</option>
            ))}
          </ToolbarItem>

          <ToolbarItem
            propKey={"backgroundSize"}
            propType="class"
            type="select"
            label={"Size"}
          >
            <option value="">None</option>
            {TailwindStyles.backgroundSize.map((_, k) => (
              <option key={_}>{_}</option>
            ))}
          </ToolbarItem>
        </ToolbarSection>

        <ToolbarSection full={2}>
          <ToolbarItem
            propKey={"backgroundOrigin"}
            propType="class"
            type="select"
            label={"Origin"}
          >
            <option value="">None</option>
            {TailwindStyles.backgroundOrigin.map((_, k) => (
              <option key={_}>{_}</option>
            ))}
          </ToolbarItem>

          <ToolbarItem
            propKey={"backgroundPosition"}
            propType="class"
            type="select"
            label={"Position"}
          >
            <option value="">None</option>
            {TailwindStyles.backgroundPosition.map((_, k) => (
              <option key={_}>{_}</option>
            ))}
          </ToolbarItem>
        </ToolbarSection>

        <ToolbarItem
          propKey={"backgroundAttachment"}
          propType="class"
          type="select"
          label={"Attachment"}
        >
          <option value="">None</option>
          {TailwindStyles.backgroundAttachment.map((_, k) => (
            <option key={_}>{_}</option>
          ))}
        </ToolbarItem>
      </ToolbarSection>
    )}
  </>
);
