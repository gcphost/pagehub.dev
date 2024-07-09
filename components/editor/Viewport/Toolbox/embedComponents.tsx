import { Tooltip } from 'components/layout/Tooltip';
import { TbCode, TbLock } from 'react-icons/tb';
import { Embed } from '../../../selectors/Embed';
import { RenderToolComponent } from './lib';

export const RenderEmbedComponent = ({ display, ...props }) => (
  <RenderToolComponent
    element={Embed}
    mobile={{ width: 'w-full' }}
    display={display}
    {...props}
  />
);

export const EmbedToolbox = {
  title: 'Embeds',
  content: [
    <RenderEmbedComponent
      key="1"
      display={
        <div className="flex flex-row gap-3 justify-between items-center border p-3 rounded-md w-full hover:bg-gray-100">
          <div className="flex flex-row gap-3 items-center">
            <TbCode /> Embedded Code
          </div>
          <Tooltip content="Requires paid upgrade." placement="left">
            <TbLock />
          </Tooltip>
        </div>
      }
      custom={{ displayName: 'Embedded coded' }}
    />,
  ],
};
