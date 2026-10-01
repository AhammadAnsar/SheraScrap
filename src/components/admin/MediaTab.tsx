import React from 'react';
import MediaLibraryModal from './MediaLibraryModal';

interface MediaTabProps {
  lang: 'ar' | 'en';
}

export default function MediaTab({ lang }: MediaTabProps) {
  const isRtl = lang === 'ar';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <MediaLibraryModal
        isOpen={true}
        isInline={true}
        onClose={() => {}}
        onSelectImage={(url) => {
          navigator.clipboard.writeText(url);
          alert(isRtl ? `تم نسخ رابط الصورة: ${url}` : `Copied image URL: ${url}`);
        }}
        isRtl={isRtl}
      />
    </div>
  );
}
