import { Tooltip } from 'components/layout/Tooltip';
import { TbForms, TbLock } from 'react-icons/tb';
import { Form } from '../../../selectors/Form';
import { RenderToolComponent } from './lib';

export const RenderFormComponent = ({ text }) => (
  <RenderToolComponent
    element={Form}
    type="save"
    display={
      <div className="flex flex-row gap-3 justify-between items-center border p-3 rounded-md w-full hover:bg-gray-100">
        <div className="flex flex-row gap-3 items-center">
          <TbForms /> {text}
        </div>
        <Tooltip content="Requires paid upgrade." placement="left">
          <TbLock />
        </Tooltip>
      </div>
    }
  />
);

export const FormToolbox = {
  title: 'Forms',
  content: [
    <RenderFormComponent key="1" text="Subscribe" />,
    <RenderFormComponent key="2" text="Contact" />,
  ],
};
