import { Tooltip } from 'components/layout/Tooltip';
import { RiImageAddLine } from 'react-icons/ri';
import { TbListNumbers, TbQuestionMark } from 'react-icons/tb';
import { Image } from '../../../selectors/Image';
import { RenderToolComponent } from './lib';
import { RenderSectionComponent } from './sectionComponents';

export const RenderImageComponent = ({ text = '', display, ...props }) => (
  <RenderToolComponent
    element={Image}
    type="cdn"
    display={display}
    text={text}
    {...props}
  />
);

export const ListToolbox = {
  title: 'Lists',
  content: [
    <RenderImageComponent
      key="1"
      mobile={{
        objectFit: 'object-cover',
        minHeight: 'min-h-[120px]',
        height: 'h-96',
        width: 'w-full',
        display: 'flex',
        overflow: 'overflow-hidden',
      }}
      desktop={{ height: 'h-auto' }}
      display={
        <div className="flex flex-row gap-3 justify-between items-center border p-3 rounded-md w-full hover:bg-gray-100">
          <div className="flex flex-row gap-3 items-center">
            <TbListNumbers /> Item List
          </div>
          <Tooltip
            content="Inline images can go anywhere and will be displayed inline with the content."
            placement="left"
          >
            <TbQuestionMark />
          </Tooltip>
        </div>
      }
      custom={{ displayName: 'Inline Image' }}
    />,
    <RenderSectionComponent
      key="image1"
      display={
        <div className="flex flex-row gap-3 justify-between items-center border p-3 rounded-md w-full hover:bg-gray-100">
          <div className="flex flex-row gap-3 items-center">
            <RiImageAddLine /> Background Image
          </div>
          <Tooltip
            content="Background images are shown behind other content, these allow you to add additional components on top of the background."
            placement="left"
          >
            <TbQuestionMark />
          </Tooltip>
        </div>
      }
      mobile={{
        display: 'flex',
        minHeight: 'min-h-[120px]',
        justifyContent: 'justify-center',
        flexDirection: 'flex-col',
        width: 'w-full',
        gap: 'gap-8',
        backgroundSize: 'bg-cover',
        backgroundPosition: 'bg-center',
        alignItems: 'items-center',
        height: 'h-96',
      }}
      desktop={{ flexDirection: 'flex-row', height: 'h-full' }}
      type="imageContainer"
      custom={{ displayName: 'Image Background' }}
    />,
  ],
};
