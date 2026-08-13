const fs = require('fs');
let code = fs.readFileSync('src/components/BlogPostPage.tsx', 'utf8');

const targetUseEffect = `  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) {
      document.title = isRtl ? post.titleAr : post.titleEn;
    }
  }, [post, isRtl]);`;

const replaceUseEffect = `  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) {
      const pageTitle = isRtl ? post.titleAr : post.titleEn;
      const excerpt = isRtl ? post.excerptAr : post.excerptEn;
      
      document.title = pageTitle + ' - ' + (cmsData.settings.siteTitleAr || 'Shera Scrap');
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', excerpt || '');

      // Update OG Tags
      const setOgMeta = (property, content) => {
        let meta = document.querySelector(\`meta[property="\${property}"]\`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      setOgMeta('og:title', pageTitle);
      setOgMeta('og:description', excerpt || '');
      if (post.featuredImage) {
        setOgMeta('og:image', post.featuredImage);
      }
    }
  }, [post, isRtl, cmsData.settings.siteTitleAr]);`;

code = code.replace(targetUseEffect, replaceUseEffect);
fs.writeFileSync('src/components/BlogPostPage.tsx', code);
console.log("Patched BlogPostPage for SEO tags.");
