import { ToolbarItem } from '../ToolbarItem';
import { ToolbarSection } from '../ToolbarSection';

export default () => (
  <>
    <ToolbarSection title="Control">
      <p className="py-3">Toggle a components visiblity.</p>
      <ToolbarSection full={2}>
        <ToolbarItem
          propKey="clickType"
          type="select"
          labelHide={true}
          label="Type"
          cols={true}
          propType="component"
        >
          <option value="">None</option>
          {['click', 'hover'].map((_, k) => (
            <option key={_}>{_}</option>
          ))}
        </ToolbarItem>

        <ToolbarItem
          propKey="clickDirection"
          type="select"
          labelHide={true}
          label="Direction"
          cols={true}
          propType="component"
        >
          {['toggle', 'show', 'hide'].map((_, k) => (
            <option key={_}>{_}</option>
          ))}
        </ToolbarItem>

        <ToolbarItem
          propKey="clickValue"
          propType="component"
          type="text"
          label="Component"
          placeholder="ID of a comoponent"
          labelHide={true}
        />
      </ToolbarSection>
    </ToolbarSection>
  </>
);
