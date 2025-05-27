import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Simple virtualization component to render large lists efficiently.
 * @param {Array} items - List of items to display
 * @param {number} itemHeight - Height of a single item in pixels
 * @param {number} height - Height of the container in pixels
 * @param {function} renderItem - Render function for each item
 */
const VirtualizedList = ({ items, itemHeight, height, renderItem }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const onScroll = e => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(height / itemHeight);
  const offsetY = startIndex * itemHeight;
  const visibleItems = items.slice(startIndex, startIndex + visibleCount + 1);

  useEffect(() => {
    const node = containerRef.current;
    if (node && node.scrollTop !== scrollTop) {
      node.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{ overflowY: 'auto', height }}
    >
      <div style={{ position: 'relative', height: totalHeight }}>
        <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
          {visibleItems.map((item, index) => renderItem(item, startIndex + index))}
        </div>
      </div>
    </div>
  );
};

VirtualizedList.propTypes = {
  items: PropTypes.array.isRequired,
  itemHeight: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  renderItem: PropTypes.func.isRequired
};

export default VirtualizedList;
