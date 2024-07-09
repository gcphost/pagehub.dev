import { useRef } from 'react';
import { ViewportList } from 'react-viewport-list';

export default ({ items, row, className }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div className={className} ref={ref}>
      {items.length}
      <ViewportList
        viewportRef={ref}
        items={items}
        itemSize={items.length}
        initialPrerender={30}
      >
        {(item) => row(item, item)}
      </ViewportList>
    </div>
  );
};
