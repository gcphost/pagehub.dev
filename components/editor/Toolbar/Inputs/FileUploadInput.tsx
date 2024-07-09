import { useNode } from '@craftjs/core';
import { Tooltip } from 'components/layout/Tooltip';
import {
  TbCode,
  TbPhoto,
  TbPhotoOff,
  TbSettings,
  TbUpload,
} from 'react-icons/tb';
import { ItemAdvanceToggle } from '../Helpers/ItemSelector';
import { ToolbarItem } from '../ToolbarItem';
import { ToolbarSection } from '../ToolbarSection';
import { ImageUploadInput } from './ImageUploadInput';

export const FileUploadInput = (propa) => {
  const props = { ...propa };
  const { props: a } = useNode((node) => ({
    props: node.data.props,
  }));

  props.props = a;

  const { typeKey } = props;

  return (
    <>
      <ToolbarSection title={props.title}>
        {(!props.props[typeKey] || props.props[typeKey] === 'cdn') && (
          <ImageUploadInput
            propKey={props.propKey}
            typeKey={props.typeKey}
            accept={props.accept}
            labelHide={true}
          />
        )}

        {props.props[typeKey] === 'img' && (
          <ToolbarItem
            propKey={props.propKey}
            propType="component"
            type="text"
            labelHide={true}
            placeholder="https://...."
          />
        )}
      </ToolbarSection>

      {props.props[typeKey] === 'svg' && (
        <ToolbarItem
          propKey={props.contentKey}
          propType="component"
          type="textarea"
          rows={6}
          label=""
          labelHide={true}
          placeholder="<svg>...</svg>"
        />
      )}

      <ItemAdvanceToggle
        propKey={props.propKey}
        title={
          <>
            <TbSettings /> Use a URL, SVG, or remove instead
          </>
        }
      >
        <ToolbarItem
          propKey={props.typeKey}
          propType="component"
          type="radio"
          labelHide={true}
          cols={true}
          options={[
            {
              label: (
                <Tooltip content="Upload File" arrow={false}>
                  <TbUpload />
                </Tooltip>
              ),
              value: 'cdn',
            },
            {
              label: (
                <Tooltip content="URL" arrow={false}>
                  <TbPhoto />
                </Tooltip>
              ),
              value: 'img',
            },

            {
              label: (
                <Tooltip content="SVG" arrow={false}>
                  <TbCode />
                </Tooltip>
              ),
              value: 'svg',
            },
            {
              label: (
                <Tooltip content="None" arrow={false}>
                  <TbPhotoOff />
                </Tooltip>
              ),
              value: '',
            },
          ]}
        />
      </ItemAdvanceToggle>
    </>
  );
};
