import { useCallback, useEffect, useMemo, useState } from "react";
import Fetchproducts from "./js/Fetchproducts";
import { Autocomplete, Backdrop, Box, CircularProgress, Pagination, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import CardProduct from "../Components/CardProduct";

const ProductPage = () => {
    const {
        products,
        collections,
        categories,
        loading,
        error,
        fetchProducts,
        fetchCollections,
        fetchCategories,
        fetchProductsByCollection,
        fetchProductsByCategory,
        fetchProductsByTags,
    } = Fetchproducts();

    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1, // Siempre comienza en la página 1
        totalPages: 0,
    });

    const quantityProducts = 24;
    const memorizedCategories = useMemo(() => categories, [categories]);
    const memorizedCollections = useMemo(() => collections, [collections]);

    const [filters, setFilters] = useState({
        searchTag: "",
        selectedCategoryId: null,
        selectedCollectionId: null,
    });

    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        fetchCollections();
        fetchCategories();
    }, [fetchCollections, fetchCategories]);

    // Función para manejar la paginación
    const goToPage = (event, page) => {
        const pageNumber = Number(page); // Asegurarse de que sea un número
        setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
    };

    // Efecto para actualizar productos según la página y los filtros activos
    useEffect(() => {
        const { searchTag, selectedCategoryId, selectedCollectionId } = filters;

        // Restablecer la página a 1 cuando los filtros cambian
        setPagination((prev) => ({ ...prev, currentPage: 1 }));

        // Llamada a la función correspondiente según el filtro activo
        if (activeTab === 0 && searchTag) {
            setPagination((prev) => ({ ...prev, currentPage: 1, totalPages: 1 }));
            fetchProductsByTags(pagination.currentPage, quantityProducts, searchTag);
        } else if (activeTab === 1 && selectedCategoryId) {
            setPagination((prev) => ({ ...prev, currentPage: 1, totalPages: 1 }));
            fetchProductsByCategory(pagination.currentPage, quantityProducts, selectedCategoryId);

        } else if (activeTab === 2 && selectedCollectionId) {
            // Restablecer la página a 1 cuando los filtros cambian
            setPagination((prev) => ({ ...prev, currentPage: 1, totalPages: 1 }));
            fetchProductsByCollection(pagination.currentPage, quantityProducts, selectedCollectionId);
        } else {
            fetchProducts(pagination.currentPage, quantityProducts);
        }
    }, [pagination.currentPage, filters, activeTab, fetchProducts, fetchProductsByTags, fetchProductsByCategory, fetchProductsByCollection]);

    // Actualiza la paginación según los datos recibidos
    useEffect(() => {
        if (products?.total) {
            // Si no hay productos, ajustamos la paginación para mostrar solo una página
            if (products.total === 0) {
                setPagination({
                    total: 0,
                    currentPage: 1,
                    totalPages: 1,
                });
            } else {
                setPagination({
                    total: Number(products.total),
                    currentPage: Number(products.currentPage), // Asegurarse de que sea un número
                    totalPages: Number(products.totalPages),
                });
            }
        }
    }, [products]);

    // Función de debounce
    const debounce = useCallback((func, delay) => {
        let debounceTimeout;
        return (...args) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => func.apply(this, args), delay);
        };
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSearchChange = (event) => {
        setFilters((prev) => ({ ...prev, searchTag: event.target.value }));
    };

    const handleCategoryChange = (event, value) => {
        setFilters((prev) => ({ ...prev, selectedCategoryId: value ? value.id : null }));
    };

    const handleCollectionChange = (event, value) => {
        setFilters((prev) => ({ ...prev, selectedCollectionId: value ? value.id : null }));
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            maxWidth: "1260px",
            margin: "auto",
            marginTop: "60px",
            padding: "10px",
            '@media (min-width:600px)': { marginTop: '130px' }

        }}>
            <Box style={{ paddingBottom: "15px", maxWidth: "500px" }}>
                <Tabs value={activeTab} style={{ paddingBottom: "15px" }} onChange={handleTabChange}>
                    <Tab label="Buscar" />
                    <Tab label="Categoría" />
                    <Tab label="Colecciones" />
                </Tabs>

                {activeTab === 0 && (
                    <TextField
                        id="filter-search"
                        style={{ width: "100%" }}
                        label="Escriba aquí alguna referencia o tag"
                        variant="outlined"
                        onChange={debounce(handleSearchChange, 300)}
                    />
                )}

                {activeTab === 1 && (
                    <Autocomplete
                        id="filter-category"
                        options={memorizedCategories}
                        getOptionLabel={(option) => option.name || ""}
                        onChange={debounce(handleCategoryChange, 300)}
                        renderInput={(params) => <TextField {...params} label="Escriba una categoría o seleccione una" variant="outlined" />}
                    />
                )}

                {activeTab === 2 && (
                    <Autocomplete
                        id="filter-collection"
                        options={memorizedCollections}
                        getOptionLabel={(option) => option.name || ""}
                        onChange={debounce(handleCollectionChange, 300)}
                        renderInput={(params) => <TextField {...params} label="Escriba una colección o seleccione una" variant="outlined" />}
                    />
                )}
            </Box>

            {/* Aquí se renderizan los productos */}
            <Box
                style={{
                    marginTop: "10px",
                    padding: "5px",
                    display: "grid",
                    gap: "10px",
                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    placeItems: "center", // Esto centra las tarjetas dentro de cada celda
                    "@media (min-width:600px)": {
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    },
                }}
            >
                {products?.products &&
                    products.products.map((product) => (
                        <CardProduct key={product.id} product={product} />
                    ))}
            </Box>


            <Box style={{ marginTop: "10px", padding: "5px", display: 'grid', gap: '10px' }}>
                {error && (
                    <Typography variant="h6" color="error">
                        ¡Ups! Ha ocurrido un error
                    </Typography>
                )}

                {products?.products?.length === 0 && !error && (
                    <Typography variant="h6" color="textSecondary" textAlign="center">
                        No hay productos disponible!
                    </Typography>
                )}
            </Box>

            {/* Paginación solo si hay productos */}
            {pagination.total > 0 && (
                <Stack spacing={2} direction="row" justifyContent="center" padding={3}>
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.currentPage}
                        onChange={goToPage}
                        variant="outlined"
                        shape="rounded"
                    />
                </Stack>
            )}

            {/* Componente de carga */}
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>


        </Box>
    );
};

export default ProductPage;
