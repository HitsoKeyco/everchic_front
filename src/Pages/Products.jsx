import React, { useEffect, useState } from 'react';
import getApiCollections from '../hooks/getApiCollections';
import getApiProducts from '../hooks/getApiProducts';
import './css/Product.css';
import FilterProduct from '../components/FilterProduct';
import CardProduct from '../components/CardProduct';
import { useSelector } from 'react-redux';
import Sliderc from '../components/Sliderc';
import { motion } from 'framer-motion';
import axios from 'axios';
import FilterProductMovil from '../components/FilterProductMovil';

const Products = () => {
    const { productsAPI, getProductsAPI } = getApiProducts();
    const { collectionAPI, getCollectionAPI } = getApiCollections();
    const [stateProducts, setStateProducts] = useState(false);
    const [isShowCollection, setIsShowColection] = useState(false)



    useEffect(() => {
        const fetchData = async () => {
            try {
                await getProductsAPI();
                await getCollectionAPI();
                setStateProducts(true)
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };
        fetchData();
    }, []);


    /* productos like*/
    const [isLike, setIsLike] = useState([])
    const userIdString = localStorage.getItem('user')
    const userId = userIdString ? JSON.parse(userIdString).id : null;
    const urlApi = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (userId) {
            updateLikeProducts();
        }
    }, [userId])

    const updateLikeProducts = () => {
        if (userId) {
            // Usuario autenticado
            axios.get(`${urlApi}/users/like_product/${userId}`)
                .then(res => {
                    setIsLike(res.data);
                })
                .catch(err => {
                    console.error("Error al obtener los likes del usuario:", err);
                });
        } else {
            // Usuario no autenticado
            const likes = JSON.parse(localStorage.getItem('likes')) || [];
            setIsLike(likes);
        }
    };


    // Estados de paginacion
    const [isShowProducts, setisShowProduct] = useState([]);
    const [isLastIndex, setIsLastIndex] = useState(0);
    const [isProductPerPage, setIsProductPerPage] = useState(19);
    const [isMaxPage, setIsMaxPage] = useState(0);
    const [isCounterPage, setIsCounterPage] = useState(1);



    //Carga inicial de productos
    useEffect(() => {
        if (productsAPI) {
            setIsMaxPage(Math.ceil(productsAPI.length / isProductPerPage));
            const additionalProducts = productsAPI.slice(0, isProductPerPage);
            setIsLastIndex(isProductPerPage);
            setisShowProduct(additionalProducts);
        }
    }, [productsAPI, isProductPerPage]);

    // Manejador next productos
    const nextProducts = () => {
        if (isCounterPage < isMaxPage) {
            const newIndex = isLastIndex + isProductPerPage;
            const additionalProducts = productsAPI.slice(isLastIndex, newIndex);

            // Actualizar el estado del último índice y los productos mostrados
            setIsLastIndex(newIndex);
            setisShowProduct(additionalProducts);
            setIsCounterPage(prevCounter => prevCounter + 1);
        }
    };

    // Manejador prev productos
    const prevProducts = () => {
        if (isCounterPage > 1) {
            const newIndex = isLastIndex - isProductPerPage;
            const additionalProducts = productsAPI.slice(newIndex - isProductPerPage, newIndex);

            // Actualizar el estado del último índice y los productos mostrados
            setIsLastIndex(newIndex);
            setisShowProduct(additionalProducts);
            setIsCounterPage(prevCounter => prevCounter - 1);
        }
    };

    const idFilter = useSelector(state => state.filterProduct.idFilterProduct);

    useEffect(() => {
        if (idFilter === 'all' && productsAPI) {
            const products = productsAPI?.map(product => product);
            setIsMaxPage(Math.ceil(products?.length / isProductPerPage));
            setisShowProduct(products);
            setIsShowColection(false);
        } else if (idFilter === 'collections') {
            setIsShowColection(true);
        } else if (productsAPI) {
            const products = productsAPI?.filter((product) => product.category.name === idFilter);
            setIsMaxPage(Math.ceil(products.length / isProductPerPage));
            setisShowProduct(products);
            setIsShowColection(false);
        }
    }, [idFilter]);

    const [productsByCategory, setProductsByCategory] = useState({});


    // Función para organizar los productos por categoría
    useEffect(() => {
        if (productsAPI) {
            const organizedProducts = productsAPI?.reduce((acc, product) => {
                const collectionName = product?.collection?.name;
                if (!acc[collectionName]) {
                    acc[collectionName] = [];
                }
                acc[collectionName].push(product);
                return acc;
            }, {});
            setProductsByCategory(organizedProducts);
        }
    }, [productsAPI]); // Dependencia añadida



    return (
        <>
            <motion.div
                className="product_filter_elements_container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className='product_element_container'>
                    {/*
                    <div className='product_filter_mobile_container'>
                        <FilterProductMovil />
                    </div>
                    */}
                    <div className="product_menu_filter">
                        <FilterProduct />
                    </div>

                    <div className="product__container">

                        {
                            isShowCollection ?

                                Object.entries(productsByCategory).map(([collection, products]) => (
                                    <div className='product_slider_container' key={collection} >
                                        <div className='product_slider_c'>
                                            <Sliderc products={products} isLike={isLike} updateLikeProducts={updateLikeProducts} />
                                        </div>
                                    </div>
                                ))

                                :

                                isShowProducts?.length > 0 ? (
                                    isShowProducts.map((product, index) => (
                                        <div className='product_filtered_container' key={product.id}>
                                            <CardProduct product={product} isLike={isLike} updateLikeProducts={updateLikeProducts} />
                                        </div>
                                    ))) :
                                    (<div className='product_filtered_not_found'><p className='product_filtered_text_not_found'>¡Estos productos se ha agotado! 😪</p></div>)

                        }


                    </div>
                </div>

            </motion.div>

        </>
    );
};

export default Products;
