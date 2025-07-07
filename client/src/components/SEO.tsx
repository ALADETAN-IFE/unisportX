import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'video';
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = 'UniSportX - University Sports Highlights & Community Platform',
  description = 'Share and watch university sports highlights, connect with athletes and fans, and celebrate victories together. Join the ultimate university sports community platform.',
  keywords = 'university sports, sports highlights, student athletes, university community, sports videos, campus sports, athletic highlights, university sports platform',
  image = 'http://res.cloudinary.com/dserpv6p5/image/upload/v1750828847/elkerqp2puqenfu1b5bi.png',
  url = 'https://unisport-x.vercel.app/',
  type = 'website',
  structuredData
}) => {
  const fullTitle = title.includes('UniSportX') ? title : `${title} | UniSportX`;
  const fullUrl = url.startsWith('http') ? url : `https://unisport-x.vercel.app${url}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update primary meta tags
    updateMetaTag('title', fullTitle);
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Update Open Graph tags
    updateMetaTag('og:type', type, 'og:type');
    updateMetaTag('og:url', fullUrl, 'og:url');
    updateMetaTag('og:title', fullTitle, 'og:title');
    updateMetaTag('og:description', description, 'og:description');
    updateMetaTag('og:image', image, 'og:image');
    updateMetaTag('og:image:width', '1200', 'og:image:width');
    updateMetaTag('og:image:height', '630', 'og:image:height');
    updateMetaTag('og:site_name', 'UniSportX', 'og:site_name');
    updateMetaTag('og:locale', 'en_US', 'og:locale');

    // Update Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image', 'twitter:card');
    updateMetaTag('twitter:url', fullUrl, 'twitter:url');
    updateMetaTag('twitter:title', fullTitle, 'twitter:title');
    updateMetaTag('twitter:description', description, 'twitter:description');
    updateMetaTag('twitter:image', image, 'twitter:image');

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // Add structured data
    if (structuredData) {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Reset to default values when component unmounts
      document.title = 'UniSportX - University Sports Highlights & Community Platform';
    };
  }, [fullTitle, description, keywords, fullUrl, image, type, structuredData]);

  return null; // This component doesn't render anything
};

export default SEO; 