import { useState } from 'react';

function AccordionMenu(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  return (
    <div className={`flex flex-col  w-full   ${props.classes?.body}`}>
      {props.items.map((item, index) => (
        <div key={index} className={' w-full'}>
          <div
            className={`flex px-3 py-6 flex-row justify-between cursor-pointer ${props.classes?.header}`}
            onClick={() => handleClick(index)}
          >
            <div className="">{item.title}</div>
            <div className="">{activeIndex === index ? '-' : '+'}</div>
          </div>
          <div
            className={` ${activeIndex === index ? 'block' : 'hidden'} ${
              item?.classes?.content || props.classes?.content
            }`}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AccordionMenu;
