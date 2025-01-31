import axios from "axios";
import { useCallback, useState } from "react";
import { addProductStore } from "../../store/slices/cart.slice";
import { useDispatch } from "react-redux";

const useFetchProducts = () => {
    const { VITE_MODE, VITE_API_URL_DEV, VITE_API_URL_PROD } = import.meta.env;
    const apiUrl = VITE_MODE === 'development' ? VITE_API_URL_DEV : VITE_API_URL_PROD;
    
    const path = "/products";
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [collections, setCollections] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleError = (err) => {
        setError(err.message || "Ocurrió un error inesperado");
    };

    // Petición para buscar productos
    const fetchProducts = useCallback((page, limit) => {
        setLoading(true);
        axios
            .get(`${apiUrl + path}?page=${page}&limit=${limit}`)
            .then((res) => {
                setProducts(res.data || []);

                // Almacenar los productos actualizados en el localStorage
                localStorage.setItem('everchic_stored_products', JSON.stringify(res.data.products)); // Cambiar 'products' a 'res.data.products'

                // Actualizar el estado global de productos (Redux)
                dispatch(addProductStore(res.data.products));
            })
            .catch(handleError)
            .finally(() => setLoading(false));
    }, [apiUrl, path, dispatch]);


    // Petición para buscar nombres de colecciones
    const fetchCollections = useCallback(() => {
        axios
            .get(`${apiUrl}/collections`)
            .then((res) => setCollections(res.data || []))
            .catch(handleError);
    }, [apiUrl]);
    

    // Petición para buscar nombres de categorías
    const fetchCategories = useCallback(() => {
        axios
            .get(`${apiUrl}/categories`)
            .then((res) => setCategories(res.data || []))
            .catch(handleError);
    }, [apiUrl]);


    // Petición para buscar productos por colección
    const fetchProductsByCollection = useCallback((page, limit, collectionId) => {
        setLoading(true);
        axios
            .get(`${apiUrl + path}/searchProductByCollection`, {
                params: { page, limit, collectionId },
            })
            .then((res) => {
                setProducts(res.data || [])

                // Actualizar el estado global de productos (Redux)
                dispatch(addProductStore(res.data.products));
            })
            .catch(handleError)
            .finally(() => setLoading(false));
    }, [apiUrl, path, dispatch]);


    // Petición para buscar productos por categoría
    const fetchProductsByCategory = useCallback((page, limit, categoryId) => {
        setLoading(true);
        axios
            .get(`${apiUrl + path}/searchProductByCategory`, {
                params: { page, limit, categoryId },
            })
            .then((res) => {
                setProducts(res.data || [])
                // Actualizar el estado global de productos (Redux)
                dispatch(addProductStore(res.data.products));
            })
            .catch(handleError)
            .finally(() => setLoading(false));
    }, [apiUrl, path, dispatch]);


    // Petición para buscar productos por tags
    const fetchProductsByTags = useCallback((page, limit, tag) => {
        setLoading(true);
        axios
            .get(`${apiUrl + path}/searchProductsByTags`, {
                params: { page, limit, tag },
            })
            .then((res) => {
                setProducts(res.data || [])
                // Actualizar el estado global de productos (Redux)
                dispatch(addProductStore(res.data.products));
            })
            .catch(handleError)
            .finally(() => setLoading(false));
    }, [apiUrl, path, dispatch]);


    return {
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
    };
};

export default useFetchProducts;
