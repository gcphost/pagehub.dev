import { Element } from '@craftjs/core';
import { Tooltip } from 'components/layout/Tooltip';
import { AiOutlineAlert, AiOutlineIdcard } from 'react-icons/ai';
import { BsPostcard } from 'react-icons/bs';
import {
  TbLayoutColumns,
  TbLayoutRows,
  TbQuestionMark,
} from 'react-icons/tb';
import { Container } from '../../../selectors/Container';
import { RenderToolComponent } from './lib';

export const RenderSectionComponent = ({
  text = <></>,
  display = <></>,
  ...props
}) => (
  <RenderToolComponent
    element={Container}
    renderer={text || display}
    {...props}
  />
);

const column = (displayName = '') => (
  <Element
    is={Container}
    canvas
    custom={{ displayName: displayName || 'Column Container' }}
    canDelete={true}
    canEditName={true}
    root={{}}
    key={Date.toString()}
    mobile={{
      display: 'flex',
      justifyContent: 'justify-center',
      flexDirection: 'flex-col',
      width: 'w-full',
      gap: 'gap-8',
      py: 'py-6',
      px: 'px-3',
    }}
    desktop={{ flexDirection: 'flex-col' }}
  />
);

const row = (displayName = '') => (
  <Element
    is={Container}
    canvas
    key={Date.toString()}
    custom={{ displayName: displayName || 'Row Container' }}
    canDelete={true}
    canEditName={true}
    root={{}}
    mobile={{
      display: 'flex',
      justifyContent: 'justify-center',
      flexDirection: 'flex-row',
      width: 'w-full',
      gap: 'gap-8',
      py: 'py-6',
      px: 'px-3',
    }}
  />
);

export const sectionToolboxItems = [
  // {
  //  title: "Sections",
  //  content: [],
  // },
  {
    title: 'Layout',
    content: [
      <RenderSectionComponent
        key="row1"
        text={
          <div className="flex flex-row gap-3 justify-between items-center border p-3 rounded-md w-full hover:bg-gray-100">
            <div className="flex flex-row gap-3 items-center">
              <TbLayoutRows /> Row
            </div>
            <Tooltip
              content="Rows allow you to place content horizontal across the layout."
              placement="left"
            >
              <TbQuestionMark />
            </Tooltip>
          </div>
        }
        mobile={{
          display: 'flex',
          justifyContent: 'justify-center',
          flexDirection: 'flex-row',
          width: 'w-full',
          gap: 'gap-8',
          height: 'h-auto',
          py: 'py-6',
          px: 'px-3',
        }}
        desktop={{}}
        custom={{ displayName: 'Row' }}
      />,

      <RenderSectionComponent
        key="col"
        text={
          <div className="flex flex-row gap-3 justify-between items-center border p-3 rounded-md w-full hover:bg-gray-100">
            <div className="flex flex-row gap-3 items-center">
              <TbLayoutColumns /> Column
            </div>
            <Tooltip
              content="Columns allow you to place content vertically across the layout."
              placement="left"
            >
              <TbQuestionMark />
            </Tooltip>
          </div>
        }
        mobile={{
          display: 'flex',
          justifyContent: 'justify-center',
          flexDirection: 'flex-col',
          width: 'w-full',
          gap: 'gap-8',
          height: 'h-auto',
          py: 'py-6',
          px: 'px-3',
        }}
        desktop={{}}
        custom={{ displayName: 'Column' }}
      />,
    ],
  },
  {
    title: 'Sections',
    content: [
      <RenderSectionComponent
        key="hero"
        text={
          <div className="flex flex-row gap-3 justify-between items-center border p-3 rounded-md w-full hover:bg-gray-100">
            <div className="flex flex-row gap-3 items-center">
              <BsPostcard /> Hero
            </div>
            <Tooltip
              content="A hero is a large, attention-grabbing banner or section at the top of a webpage."
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
          py: 'py-6',
          px: 'px-3',
        }}
        desktop={{ flexDirection: 'flex-row', height: 'h-full' }}
        type="heroContainer"
        custom={{ displayName: 'Hero' }}
      />,
      <RenderSectionComponent
        key="card"
        text={
          <div className="flex flex-row gap-3 justify-between items-center border p-3 rounded-md w-full hover:bg-gray-100">
            <div className="flex flex-row gap-3 items-center">
              <AiOutlineIdcard /> Card
            </div>
            <Tooltip
              content="A card is a compact, self-contained unit that displays information in a structured way."
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
          py: 'py-6',
          px: 'px-3',
        }}
        desktop={{ flexDirection: 'flex-row', height: 'h-full' }}
        type="cardContainer"
        custom={{ displayName: 'Card' }}
      />,
      <RenderSectionComponent
        key="cta"
        text={
          <div className="flex flex-row gap-3 justify-between items-center border p-3 rounded-md w-full hover:bg-gray-100">
            <div className="flex flex-row gap-3 items-center">
              <AiOutlineAlert /> Call to Attention
            </div>
            <Tooltip
              content="A call to action is a prompt that encourages users to take a specific action."
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
          py: 'py-6',
          px: 'px-3',
        }}
        desktop={{ flexDirection: 'flex-row', height: 'h-full' }}
        type="ctaContainer"
        custom={{ displayName: 'Call to Attention' }}
      />,
    ],
  },
];
