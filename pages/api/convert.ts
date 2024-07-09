import * as htmlparser2 from "htmlparser2";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  const _content = `<div class="items-start border-solid flex flex-col justify-center leading-6 p-8">
  <h1 class="text-yellow-300 text-[3.00rem] leading-[3.00rem] p-2">TechFest</h1>
  <h2 class="text-[3.00rem] leading-[4.13rem] mb-2">Space : The Timeless Infinity
  </h2>
  <p class="text-gray-50 leading-6 mb-4">Explore your favourite events and
    register now to showcase your talent and win exciting prizes.</p>
  <a class="rounded text-yellow-300 cursor-pointer leading-6 p-2" href="https://tailwindcomponents.com/#">Explore Now</a>
</div>`;

  // console.log(
  //  JSON.stringify({
  //    content: _content,
  //  })
  // );

  let { content } = req.body;

  // content = _content;
  content = content.replace(/\n/g, "");
  content = content.replace(/\s{2,}/g, " "); // replace any sequence of 2 or more whitespace characters with a single space

  const parsedData = [];

  const nodeLookup = {
    div: "Container",
    section: "Container",
    main: "Container",
    a: "Text",
    text: "Text",
    p: "Text",
    h1: "Text",
    h2: "Text",
    h3: "Text",
    h4: "Text",
    h5: "Text",
    h6: "Text",
    h7: "Text",
    img: "Image",
    abbr: "Text",
    acronym: "Text",
    address: "Text",
    article: "Container",
    aside: "Container",
    // audio: "Media",
    b: "Text",
    bdi: "Text",
    bdo: "Text",
    big: "Text",
    blockquote: "Text",
    // body: "Container",
    br: "Text",
    button: "Button",
    // canvas: "Canvas",
    caption: "Text",
    cite: "Text",
    code: "Text",
    col: "Text",
    colgroup: "Text",
    data: "Text",
    datalist: "Text",
    dd: "Text",
    del: "Text",
    details: "Container",
    dfn: "Text",
    // dialog: "",
    form: "Form",
    input: "FormElement",
    select: "FormElement",
    textarea: "FormElement",
  };

  const parseHtml = (html) => {
    const parsedData = { tag: "html", children: [], props: {} };
    let currentTag: any = parsedData;

    const parser = new htmlparser2.Parser(
      {
        onopentag(tagName, attributes) {
          const tagData: any = {
            type: nodeLookup[tagName],
            props: {
              ...attributes,
              canDelete: true,
              canEditName: true,
              canDrag: true,
            },

            children: [],
            parent: currentTag,
          };

          if (tagData.type === "Image") {
            tagData.props.videoId = tagData.props.src;
          }

          if (attributes.class) {
            tagData.props.className = attributes.class.split(" ");
          } else {
            tagData.props.className = [];
          }
          currentTag.children.push(tagData);
          currentTag = tagData;
        },
        ontext(text) {
          const trimmedText = text.trim();
          if (trimmedText !== "") {
            currentTag.props.text = trimmedText;
          }
        },
        onclosetag(tagName) {
          if (currentTag.parent) {
            currentTag = currentTag.parent;
          }
        },
      },
      { decodeEntities: true }
    );

    parser.write(html);
    parser.end();

    const cleanData = removeParent(parsedData.children);

    return cleanData;
  };

  const removeParent = (children) => {
    const cleanChildren = children.map((child) => {
      if (child.children && Array.isArray(child.children)) {
        child.children = removeParent(child.children);
      }
      delete child.parent;
      return child;
    });
    return cleanChildren;
  };

  const o = parseHtml(content);
  console.dir(o, { depth: null });

  res.status(200).json({ ok: true, result: o });
}
