import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({ 
  title = "EverChic - Moda y Estilo", 
  description = "Descubre la mejor selección de moda y accesorios en EverChic. Encuentra las últimas tendencias y productos exclusivos.",
  keywords = "moda, accesorios, ropa, estilo, tendencias, compras online",
  ogTitle = "EverChic - Moda y Estilo",
  ogDescription = "Descubre la mejor selección de moda y accesorios en EverChic",
  ogImage = "https://everchic.com/og-image.jpg",
  ogUrl = "https://everchic.com",
  twitterCard = "summary_large_image"
}) => {
  return (
    <Helmet>
      {/* Meta tags básicos */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={ogUrl} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={ogUrl} />
    </Helmet>
  );
};

export default SEOHelmet; 