import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

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
  }, [fullTitle]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="UniSportX" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO; 