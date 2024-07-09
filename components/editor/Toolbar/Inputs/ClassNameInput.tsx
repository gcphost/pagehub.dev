import { ClassItem } from '../Items/ClassItem';
import { ToolbarItem } from '../ToolbarItem';
import { ToolbarSection } from '../ToolbarSection';

export const ClassNameInput = () => (
    <>
      <ToolbarSection>
        <ToolbarItem
          propKey="style"
          propType="root"
          type="textarea"
          rows={3}
          label="CSS"
          placeholder="color:Tomato; border-style: dotted;"
          labelHide={true}
        />
      </ToolbarSection>
      <ToolbarSection>
        <ClassItem
          propKey="className"
          type="className"
          propType="component"
          label="Classes"
          labelHide={true}
        />
      </ToolbarSection>
    </>
);
