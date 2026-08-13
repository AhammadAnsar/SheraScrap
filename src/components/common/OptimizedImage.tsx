import React, { useState } from 'react';
import { getOptimizedImageUrl } from '../../utils/webpConverter';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean; // Set true for above-the-fold hero images
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  fallbackSrc = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80&fm=webp',
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const optimizedSrc = error ? fallbackSrc : getOptimizedImageUrl(src);

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      // @ts-ignore fetchpriority HTML attribute
      fetchPriority={priority ? 'high' : 'low'}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      className={`${className} transition-opacity duration-300 ${
        loaded ? 'opacity-100' : 'opacity-80'
      }`}
      {...props}
    />
  );
};

export default OptimizedImage;
