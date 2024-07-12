import React, { cloneElement, useEffect, useState } from 'react';
import './css/Product.css';
import CardProduct from '../components/CardProduct';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import axios from 'axios';
import { addProductStore } from '../store/slices/cart.slice';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { createFilterOptions } from '@mui/material/Autocomplete';
import FilterSocks from '../components/FilterSocks';
import ProductCarousel from '../components/ProductCarousel';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import { WidthFull } from '@mui/icons-material';




const Products = () => {
    // ################### Api url ##########################    
    const apiUrl = import.meta.env.VITE_API_URL;

    // ################### hooks ##########################
    const dispatch = useDispatch();

    // ################### States ##########################   
    const [productsAPI, setProductsAPI] = useState([]);
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([{ name: 'Colección' }]);
    const [searchFilter, setSearchFilter] = useState({ type: '', value: '' });
    const [searchCategory, setSearchCategory] = useState('');
    const [searchCollection, setSearchCollection] = useState(false);
    const [loading, setLoading] = useState(false); // Estado de carga
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        totalPages: 0
    });

    // ################### Pagination Limit products ##########################  
    const limit = 18;

    // ################### Fecth Products Custom, Category ##########################  
    const [changeFilter, setChangeFilter] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [pagination.currentPage, changeFilter]);

    
    const fetchProducts = () => {
        //sabiendo q tengo searchCollection
        setLoading(true);
        let url = '';
        if (searchCategory && !searchCollection) {
            url = `${apiUrl}/categories/category?categoryId=${searchCategory}&page=${pagination.currentPage}&limit=${limit}`;
        } else if (searchCollection && !searchCategory) {
            url = `${apiUrl}/collections/group_collection?page=${pagination.currentPage}&limit=${limit}`;
        } else if (!searchCategory && !searchCollection) {
            url = `${apiUrl}/products?page=${pagination.currentPage}&limit=${limit}`;
            
        }
        axios.get(url)
            .then(res => {
                const { total, currentPage, totalPages, products } = res.data;                
                setPagination({ total, currentPage, totalPages });
                setProductsAPI(products);                
                localStorage.setItem('everchic_stored_products', JSON.stringify(products));
                dispatch(addProductStore(products));
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setLoading(false));
    };

    // ################### Function handle pagination ########################## 
    const goToPage = (event, page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };


    // ################### Fetch categories ##########################    
    useEffect(() => {
        axios.get(`${apiUrl}/categories`)
            .then(res => {
                setCategories(res.data);

            })
            .catch(err => {
                console.log('No se han encontrado categorías', err);
            });
    }, []);

    // #################### Filter Options #####################    
    const filterOptionsCategory = createFilterOptions({
        matchFrom: 'start',
        stringify: (option) => option.name,
    });

    const filterOptionsCollection = createFilterOptions({
        matchFrom: 'start',
        stringify: (option) => option.name,
    });


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
                    <div className='product_filter_mobile_container'>
                        <FilterSocks
                            categories={categories}
                            collections={collections}

                            setSearchCategory={setSearchCategory}
                            setSearchCollection={setSearchCollection}

                            setPagination={setPagination}
                            filterOptionsCategory={filterOptionsCategory}
                            filterOptionsCollection={filterOptionsCollection}
                            setChangeFilter={setChangeFilter}
                            changeFilter={changeFilter}

                            setProductsAPI={setProductsAPI}

                        />
                    </div>

                    <div className={`${searchCollection && searchCategory == '' ? 'product_container_carousel' : 'product_container'} `}>
                        {
                            productsAPI.length > 0 ? (
                                <>

                                    {
                                        // cuando no existe ninguna selección en el filtro
                                        searchCategory == '' && !searchCollection && (
                                            productsAPI?.map((product, index) => (
                                                <div className="product_card_product_container" key={index}>
                                                    <CardProduct product={product} />
                                                </div>
                                            )))
                                    }

                                    {
                                        searchCategory && !searchCollection && (
                                            productsAPI?.map((product, index) => (
                                                <div className="product_card_product_container" key={index}>
                                                    <CardProduct product={product} />
                                                </div>
                                            ))
                                        )
                                    }

                                    {
                                        searchCollection && searchCategory == '' && (
                                            productsAPI?.map((collection, index) => {
                                                if (collection?.products?.length > 0) {
                                                    return (
                                                        <Box WidthFull  key={index}>
                                                            <ProductCarousel products={collection.products} nameCollection={collection.collectionName} />
                                                        </Box>
                                                    )
                                                }
                                            })
                                        )
                                    }
                                </>
                            ) : (
                                ''
                            )
                        }
                    </div>
                    <div className='product_pagination_container'>
                        <Stack spacing={2}>
                            <Pagination
                                count={pagination.totalPages}
                                page={parseInt(pagination.currentPage)}
                                onChange={goToPage}
                                variant="outlined"
                                shape="rounded"
                            />
                        </Stack>
                    </div>
                </div>
            </motion.div>
            <Backdrop
                
                sx={{ color: '#fff',
                      zIndex: (theme) => theme.zIndex.drawer + 1                       
                    }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default Products;
