const navLinks = () => {
    const routes = [];
    routes.push({
        to: '/',
        text: 'Home'
    });

    routes.push({
        to: '/products',
        text: 'Productos'
    });

    routes.push({
        to: '/tracking',
        text: 'Pedidos'
    });

    routes.push({
        to: '/galery',
        text: 'Galeria'
    });

    routes.push({
        to: '/purchases',
        text: 'Mis compras'
    });

    routes.push({
        to: '/faqs',
        text: 'FAQs'
    });
    return routes

}

export default navLinks