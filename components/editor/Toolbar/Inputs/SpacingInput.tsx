import { TabBody } from '../Tab';
import { FlexInput } from './FlexInput';
import { MarginInput } from './MarginInput';
import { PaddingInput } from './PaddingInput';
import { SizeInput } from './SizeInput';

export const SpacingInput = () => (
  <TabBody
    jumps={[
      {
        title: 'Flex',
        content: <div className="text-sm">Flex</div>,
      },
      {
        title: 'Size',
        content: <div className="text-sm">Size</div>,
      },

      {
        title: 'Margin',
        content: <div className="text-sm">Margin</div>,
      },
      {
        title: 'Padding',
        content: <div className="text-sm">Padding</div>,
      },
    ]}
  >
    <FlexInput />

    <SizeInput />

    <MarginInput />
    <PaddingInput />
  </TabBody>
);
