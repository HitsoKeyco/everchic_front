const navLinks = () => {
    const routes = [];
    routes.push({
        to: '/',
        text: 'Home',
        private: false
    });

    routes.push({
        to: '/products',
        text: 'Productos',
        private: false
    });
    
    // routes.push({
    //     to: '/gallery',
    //     text: 'Galeria',
    //     private: false
    // });
    
    routes.push({
        to: '/faqs',
        text: 'FAQs',
        private: false
    });

    routes.push({
        to: '/profile',
        text: 'Mi Perfil',
        class: 'isActive',
        private: true
    });

    return routes

}

export default navLinks