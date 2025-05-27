import React, { useEffect, useRef, useState } from 'react';

const LazyImage = ({ src, alt, ...rest }) => {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    let observer;
    if (imgRef.current && !loadedSrc) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setLoadedSrc(src);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '100px' }
      );
      observer.observe(imgRef.current);
    }
    return () => observer && observer.disconnect();
  }, [src, loadedSrc]);

  return <img ref={imgRef} src={loadedSrc} alt={alt} loading="lazy" {...rest} />;
};

export default LazyImage;
