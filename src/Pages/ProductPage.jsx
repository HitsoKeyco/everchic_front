import { useState, useEffect } from 'react';
import Fetchproducts from './js/Fetchproducts';
import { Box, Autocomplete, TextField, Typography, Backdrop, CircularProgress, Pagination, Stack, Tab, Tabs } from '@mui/material';
import CardProduct from '../components/CardProduct';
import SEOHelmet from '../components/SEOHelmet';

const ProductPage = () => {
    const {
        products,
        collections,
        categories,
        loading,        
        fetchProducts,
        fetchCategories,
        fetchCollections,
        fetchProductsByCategory,
        fetchProductsByCollection,
        fetchProductsByTags,
    } = Fetchproducts();

    // cantidad de productos por página
    const quantityProducts = 24;

    // Estados
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0 });
    const [activeTab, setActiveTab] = useState(0);
    const [searchTag, setSearchTag] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [debouncedSearchTag, setDebouncedSearchTag] = useState(searchTag);

    // Cargar productos categorías y colecciones solo una vez
    useEffect(() => {
        fetchProducts(1, quantityProducts);
        fetchCategories();
        fetchCollections();
    }, [fetchCategories, fetchCollections, fetchProducts]);

    useEffect(() => {
        // Actualizar la paginación cuando se actualicen los productos
        if (products?.total && products?.totalPages) {
            setPagination({ currentPage: products?.currentPage || 1, totalPages: products?.totalPages || 0 });
        }
    }, [products]);

    // Manejo de cambios en filtros de búsqueda con debounce
    const handleSearchChange = (event) => {
        const newSearchTag = event.target.value;
        setSearchTag(newSearchTag);
    };

    // Aplicar el debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTag(searchTag);
        }, 1000);

        return () => {
            clearTimeout(timer); // Limpiar el temporizador anterior si cambia el valor de searchTag
        };
    }, [searchTag]);

    useEffect(() => {
        // Llamada a fetchProductsByTags cuando el searchTag es actualizado por el debounce
        if (debouncedSearchTag) {
            updateProducts(1, debouncedSearchTag, selectedCategory, selectedCollection);
        } else {
            updateProducts(1, '', selectedCategory, selectedCollection);
        }
    }, [debouncedSearchTag, selectedCategory, selectedCollection]);

    const handleCategoryChange = (_, value) => {
        setSelectedCategory(value?.id || null); // Guardar el ID de la categoría
        updateProducts(1, searchTag, value?.id, selectedCollection);
    };

    const handleCollectionChange = (_, value) => {
        setSelectedCollection(value?.id || null); // Guardar el ID de la colección
        updateProducts(1, searchTag, selectedCategory, value?.id);
    };

    const updateProducts = (page, searchTag, category, collection) => {
        if (searchTag) {
            fetchProductsByTags(page, quantityProducts, searchTag);
        } else if (category) {
            fetchProductsByCategory(page, quantityProducts, category); // Pasar el ID de la categoría
        } else if (collection) {
            fetchProductsByCollection(page, quantityProducts, collection); // Pasar el ID de la colección
        } else {
            fetchProducts(page, quantityProducts);
        }
    };

    // Manejo de cambio de tab (Buscar, Categoría, Colección)
    const handleTabChange = (_, newValue) => {
        setActiveTab(newValue);
    };

    // Función de paginación
    const handlePageChange = (_, newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        updateProducts(newPage, searchTag, selectedCategory, selectedCollection); // Actualizar productos según la página y filtros
    };

    return (
        <>
            <SEOHelmet 
                title="EverChic - Productos | Calcetines de Diseño"
                description="Explora nuestra colección de calcetines únicos. Encuentra calcetines de personajes de series animadas, tejidos o sublimados. Más de 500 modelos disponibles."
                keywords="calcetines, calcetines de diseño, calcetines de personajes, calcetines sublimados, calcetines tejidos, moda, accesorios, compras online"
                ogTitle="EverChic - Colección de Calcetines de Diseño"
                ogDescription="Descubre nuestra exclusiva colección de calcetines con personajes de series animadas"
                ogImage="https://everchic.com/images/products-og.jpg"
                ogUrl="https://everchic.com/productos"
            />
            <Box sx={{
                minHeight: '100vh',
                maxWidth: "1260px",
                margin: "auto",
                marginTop: "60px",
                padding: "10px",
                paddingTop: "30px",
                display: "flex",
                flexDirection: "column",
                '@media (min-width:600px)': { marginTop: '150px' }
            }}>
                <Box sx={{ paddingBottom: '15px', maxWidth: '500px' }}>
                    <Tabs value={activeTab} style={{ paddingBottom: "15px" }} onChange={handleTabChange} variant="fullWidth">
                        <Tab label="Buscar" />
                        <Tab label="Categoría" />
                        <Tab label="Colección" />
                    </Tabs>

                    {activeTab === 0 && (
                        <TextField
                            id="filter-search"
                            sx={{ marginTop: '15px' }}
                            label="Escriba aquí alguna referencia o tag"
                            variant="outlined"
                            fullWidth
                            value={searchTag}
                            onChange={handleSearchChange}
                        />
                    )}

                    {activeTab === 1 && (
                        <Autocomplete
                            id="filter-category"
                            options={categories}
                            getOptionLabel={(option) => option.name || ""}
                            value={selectedCategory ? categories.find(cat => cat.id === selectedCategory) : null}
                            onChange={handleCategoryChange}
                            renderInput={(params) => <TextField {...params} sx={{ marginTop: '15px' }} label="Seleccione una categoría" variant="outlined" />}
                        />
                    )}

                    {activeTab === 2 && (
                        <Autocomplete
                            id="filter-collection"
                            options={collections}
                            getOptionLabel={(option) => option.name || ""}
                            value={selectedCollection ? collections.find(coll => coll.id === selectedCollection) : null}
                            onChange={handleCollectionChange}
                            renderInput={(params) => <TextField {...params} sx={{ marginTop: '15px' }} label="Seleccione una colección" variant="outlined" />}
                        />
                    )}
                </Box>

                <Box
                    sx={{
                        marginTop: "10px",
                        padding: "5px",
                        display: "grid",
                        gap: "15px",
                        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", // Comportamiento predeterminado para pantallas pequeñas
                        placeItems: "center",  // Centrado de los items dentro de las columnas
                        justifyContent: "center",
                        '@media (min-width: 1200px)': {  // Para pantallas más grandes (mayores a 1200px)
                            gridTemplateColumns: "repeat(6, 1fr)", // Exactamente 6 columnas
                        },
                    }}
                >
                    {products?.products?.map((product) => (
                        <CardProduct key={product.id} product={product} />
                    ))}
                </Box>

                {products?.products?.length === 0 && (
                    <Typography variant="h6" color="textSecondary" align="center">
                        No hay productos disponibles
                    </Typography>
                )}

                {/* Paginación */}
                <Stack spacing={2} direction="row" justifyContent="center" padding={3}>
                    <Pagination                    
                        count={pagination.totalPages}
                        page={pagination.currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                        siblingCount={1} // Muestra 1 página antes y 1 después de la página actual
                        boundaryCount={0} // Muestra 2 páginas al principio y 2 al final
                    />
                </Stack>

                {/* Cargando */}
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>
        </>
    );
};

export default ProductPage;
