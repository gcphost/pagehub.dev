import { Editor, Frame, Element } from '@craftjs/core';
import { ColorPickerDialog } from 'components/editor/Toolbar/Tools/ColorPickerDialog';
import { FontFamilyDialog } from 'components/editor/Toolbar/Tools/FontFamilyDialog';
import { IconDialogDialog } from 'components/editor/Toolbar/Tools/IconDialog';
import { PatternDialog } from 'components/editor/Toolbar/Tools/PatternDialog';
import { ToolTipDialog } from 'components/editor/Toolbar/Tools/TooltipDialog';
import { Background } from 'components/selectors/Background';
import { Container } from 'components/selectors/Container';
import { Divider } from 'components/selectors/Divider';
import { Embed } from 'components/selectors/Embed';
import { OnlyText, Text } from 'components/selectors/Text';
import debounce from 'lodash.debounce';
import lz from 'lzutf8';
import { NextSeo } from 'next-seo';
import { useSetRecoilState } from 'recoil';
import { siteDescription, siteTitle } from 'utils/lib';
import { templates } from 'utils/templates';

import { RenderNodeNewer } from 'components/editor/RenderNodeNewer';
import { Toolbar } from 'components/editor/Toolbar';

import { UnsavedChangesAtom, Viewport } from 'components/editor/Viewport';
import DebugPanel from 'components/editor/Viewport/DebugPanel';
import { Form, FormDrop } from 'components/selectors/Form';
import { FormElement, OnlyFormElement } from 'components/selectors/FormElement';
import { Save } from '../../components/Save';
import { Button, OnlyButtons } from '../../components/selectors/Button';
import { Image } from '../../components/selectors/Image';
import { Video } from '../../components/selectors/Video';

function App({
  data, slug, result, session
}) {
  data = lz.decompress(lz.decodeBase64(data));

  console.log(result);

  if (data) {
    try {
      JSON.parse(data);
    } catch (e) {
      console.error(e);
      data = null;
    }
  }
  const setUnsavedChanged = useSetRecoilState(UnsavedChangesAtom);

  const editorComponents = {
    Background,
    Container,
    Text,
    OnlyFormElement,
    OnlyText,
    Form,
    FormDrop,
    FormElement,
    OnlyButtons,
    Button,
    Video,
    Image,
    Embed,
    Divider,
  };

  // const { setIsOpen } = useTour();
  // useEffect(() => setIsOpen(true), []);

  const debug = false;

  return (
    <div className="h-screen w-screen">
      <NextSeo
        title={`${
          result?.title || result?.domain || result?.subdomain || slug
        } - ${siteTitle}`}
        description={siteDescription}
        canonical="https://pagehub.dev/"
      />

      <ToolTipDialog />

      <Editor
        resolver={editorComponents}
        enabled={true}
        onRender={RenderNodeNewer}
        indicator={{
          success: 'currentColor',
          error: 'rgb(153 27 27)',
          transition: 'currentColor',
          thickness: 10,
        }}
        onNodesChange={debounce((query) => {
          setUnsavedChanged(query.serialize());
        }, 1000)}
      >
        <div
          className="flex flex-row w-full h-screen overflow-hidden fixed bg-gray-200"
          data-base={true}
        >
          <Toolbar />

          <ColorPickerDialog />
          <FontFamilyDialog />
          <IconDialogDialog />
          <PatternDialog />

          {debug && <DebugPanel />}

          <Save result={result} />

          <Viewport>
            <Frame data={data}>
              <Element
                canvas
                type="background"
                is={Background}
                data-renderer={true}
                custom={{ displayName: 'Background' }}
                pallet={[]}
                root={{
                  background: 'bg-white',
                  color: 'text-black',
                }}
                mobile={{
                  height: 'h-full',
                  width: 'w-screen',
                  gap: 'gap-3',
                  display: 'flex',
                  flexDirection: 'flex-col',
                  overflow: 'overflow-auto',
                }}
                desktop={{}}
              >
                <Element
                  canvas
                  is={Container}
                  type="page"
                  canDelete={false}
                  canEditName={true}
                  isHomePage={true}
                  root={{}}
                  mobile={{
                    mx: 'mx-auto',
                    display: 'flex',
                    justifyContent: 'justify-start',
                    alignItems: 'items-center',
                    flexDirection: 'flex-col',
                    width: 'w-full',
                    gap: 'gap-3',
                    py: 'py-12',
                  }}
                  desktop={{}}
                  custom={{ displayName: 'Home Page' }}
                >
                  <Element
                    canvas
                    is={Container}
                    canDelete={true}
                    canEditName={true}
                    root={{}}
                    mobile={{
                      py: 'py-3',
                      px: 'px-3',
                      mx: 'mx-auto',

                      display: 'flex',
                      justifyContent: 'justify-center',
                      alignItems: 'items-center',
                      flexDirection: 'flex-col',
                      width: 'w-full',
                      gap: 'gap-3',
                    }}
                    desktop={{
                      py: 'py-12',
                      px: 'px-12',
                      flexDirection: 'flex-row',
                      alignItems: 'items-start',
                    }}
                    custom={{ displayName: 'Content' }}
                  >
                    <Element
                      canvas
                      is={Container}
                      canDelete={true}
                      canEditName={true}
                      root={{}}
                      mobile={{
                        py: 'py-3',
                        px: 'px-3',
                        mx: 'mx-auto',
                        display: 'flex',
                        justifyContent: 'justify-center',
                        alignItems: 'items-center',
                        flexDirection: 'flex-col',
                        width: 'w-full',
                        gap: 'gap-3',
                      }}
                      desktop={{}}
                      custom={{ displayName: 'Left Container' }}
                    >
                      <Element
                        canvas
                        is={Text}
                        canDelete={true}
                        canEditName={true}
                        text=""
                        root={{}}
                        mobile={{
                          fontSize: 'text-3xl',
                          fontWeight: 'font-bold',
                        }}
                        desktop={{}}
                        custom={{ displayName: 'Header Text' }}
                      />
                    </Element>

                    <Element
                      canvas
                      is={Container}
                      canDelete={true}
                      canEditName={true}
                      root={{}}
                      mobile={{
                        py: 'py-3',
                        px: 'px-3',
                        mx: 'mx-auto',
                        display: 'flex',
                        justifyContent: 'justify-center',
                        alignItems: 'items-center',
                        flexDirection: 'flex-col',
                        width: 'w-full',
                        gap: 'gap-3',
                      }}
                      desktop={{}}
                      custom={{ displayName: 'Right Container' }}
                    />
                  </Element>
                </Element>
              </Element>
            </Frame>
          </Viewport>
        </div>
      </Editor>
    </div>
  );
}

export async function getServerSideProps({ req, query }) {
  const host = req.headers.host.split('.');
  const subdomain = host.length === 2 ? host[0] : '';

  let data = '';

  let json = null;
  let result = null;

  if (query?.slug?.length) {
    const template = Object.keys(templates).find(
      (_) => templates[_].href === query.slug[0]
    );

    if (template) {
      data = templates[template].content;
    } else {
      const res = await fetch(
        `${process.env.API_ENDPOINT}/page/${query.slug[0]}`
      );

      try {
        result = await res.json();
      } catch (e) {
        console.error(e);
      }

      if (result) {
        data = result.draft || result.content || '';
      }
    }

    json = data ? lz.decompress(lz.decodeBase64(data)) : null;
  }

  return {
    props: {
      subdomain,
      data: json ? lz.encodeBase64(lz.compress(json)) : null,
      slug: query?.slug?.length ? query.slug[0] : '',
      domain: process.env.DOMAIN,
      result,
    }, // will be passed to the page component as props
  };
}

export default App;
