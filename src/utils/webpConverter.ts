/**
 * Utility to convert image files (PNG, JPG, JPEG, BMP) to WebP format on the client side.
 * Reduces file sizes by 70-80% before uploading to Hostinger server or saving to CMS.
 */

export const convertToWebP = async (
  file: File,
  quality: number = 0.85,
  maxWidth: number = 1920
): Promise<File> => {
  // If already webp or svg or gif, skip conversion
  if (
    file.type === 'image/webp' ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  ) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback to original file
          return;
        }

        // Smooth rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file); // Fallback to original
              return;
            }

            // Create new WebP File object
            const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const webpName = `${originalName}.webp`;

            const webpFile = new File([blob], webpName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => resolve(file);
    };

    reader.onerror = () => resolve(file);
  });
};

/**
 * Format image URL to enforce WebP parameters if using Unsplash or known image CDNs
 */
export const getOptimizedImageUrl = (url: string): string => {
  if (!url) return '';
  
  // If Unsplash URL, append WebP format & compression params
  if (url.includes('images.unsplash.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('fm', 'webp');
    urlObj.searchParams.set('q', '80');
    return urlObj.toString();
  }

  return url;
};
