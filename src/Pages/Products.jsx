import React, { useEffect, useState } from 'react';
import getApiCollections from '../hooks/getApiCollections';
import getApiProducts from '../hooks/getApiProducts';
import './css/Product.css';
import FilterProduct from '../components/FilterProduct';
import { ClipLoader } from 'react-spinners';
import CardProduct from '../components/CardProduct';
import { useSelector } from 'react-redux';
import Sliderc from '../components/Sliderc';
import { motion } from 'framer-motion';

const Products = () => {
    const { productsAPI, getProductsAPI } = getApiProducts();



    const { collectionAPI, getCollectionAPI } = getApiCollections();
    const [stateProducts, setStateProducts] = useState(false);
    const [isShowCollection, setIsShowColection] = useState(true)



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



    // Estados de paginacion
    const [isShowProducts, setisShowProduct] = useState([]);
    const [isLastIndex, setIsLastIndex] = useState(0);
    const [isProductPerPage, setIsProductPerPage] = useState(4);
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
        if (idFilter === 2 && productsAPI) {
            setIsShowColection(false)
            const products = productsAPI.filter((product) => product.category.name === 'Tejidos')
            if (products) {
                setIsMaxPage(Math.ceil(products.length / isProductPerPage));
                setisShowProduct(products)
            }
        } else if (idFilter === 0 && productsAPI) {
            setIsShowColection(false)
            setIsMaxPage(Math.ceil(productsAPI.length / isProductPerPage));
            const additionalProducts = productsAPI.slice(0, isProductPerPage);
            setIsLastIndex(isProductPerPage);
            setisShowProduct(additionalProducts);
        } else if (idFilter === 3 && productsAPI) {
            setIsShowColection(false)
            const products = productsAPI.filter((product) => product.category.name === 'Sublimados')
            if (products) {
                setIsMaxPage(Math.ceil(products.length / isProductPerPage));
                setisShowProduct(products)
            }
        } else if (idFilter === 4 && productsAPI) {
            setIsShowColection(false)
            const products = productsAPI.filter((product) => product.category.name === 'Marca')
            if (products) {
                setIsMaxPage(Math.ceil(products.length / isProductPerPage));
                setisShowProduct(products)
            }
        } else if (idFilter === 1 && collectionAPI && productsAPI) {
            setIsShowColection(true)
        }
    }, [idFilter])





    // 

    return (
        <>
            <motion.div
                className="product_filter_elements_container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <FilterProduct />
                <div className="product_filtered_container">

                    <span className='product_filter_notification'>Actualmente solo disponemos calcetines en talla 10 - 12, esperamos muy pronto expandirnos y brindarles una amplia gama de productos.</span>

                    <div className='product_collection_filter_add_controller_Container'>
                        <div className="product_collection_filter">
                            {
                                isShowCollection ?
                                    collectionAPI?.map((collection) => {
                                        const filteredProducts = productsAPI?.filter((product) => product.collection.id === collection.id);

                                        return filteredProducts?.length !== 0 && <Sliderc key={collection.id} products={filteredProducts} nameCollection={collection.name} />;
                                    })
                                    :
                                    isShowProducts ?
                                        isShowProducts
                                            .map((product, index) => (
                                                <div key={index}>
                                                    <CardProduct product={product} />
                                                </div>
                                            ))
                                        :
                                        !stateProducts
                                        && (idFilter !== 1 && <ClipLoader color={'#265073'} loading={!stateProducts} size={50} />)
                            }
                        </div>
                    </div>
                    {
                        !isShowCollection &&
                        (<div className='product_button_more_container'>
                            <i className='bx bx-chevron-left left_action_pagination' onClick={prevProducts}></i>
                            <span className='product_page'>{isCounterPage}</span>
                            <i className='bx bx-chevron-right right_action_pagination' onClick={nextProducts}></i>
                            <span className='product_quantity_page'>{isMaxPage} Pag.</span>
                        </div>)
                    }
                </div>


            </motion.div>

        </>
    );
};

export default Products;
