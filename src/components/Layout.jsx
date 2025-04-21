const Layout = ({ children }) => {
    return (
        <>
            <a href="#main-content" className="skip-link">
                Saltar al contenido principal
            </a>
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "Tu Tienda",
                    "url": "https://tudominio.com",
                    "logo": "https://tudominio.com/logo.png",
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+1-234-567-8900",
                        "contactType": "customer service"
                    }
                })}
            </script>
            <header role="banner" aria-label="Encabezado principal">
                <nav role="navigation" aria-label="Navegación principal">
                    {/* navegación */}
                </nav>
            </header>
            <main role="main" id="main-content">
                {children}
            </main>
            <footer role="contentinfo" aria-label="Pie de página">
                {/* footer */}
            </footer>
        </>
    );
}

export default Layout; 