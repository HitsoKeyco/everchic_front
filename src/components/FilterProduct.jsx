import React, { useEffect, useState } from 'react'
import './css/FilterProduct.css'
import { useDispatch, useSelector } from 'react-redux'
import { filterIdProduct } from '../store/slices/filterProduct.slice'
import axios from 'axios'

const FilterProduct = () => {

    const dispatch = useDispatch()
    const [isNameCategories, setNameCategories] = useState()


    useEffect(() => {
        const urlApi = import.meta.env.VITE_API_URL;
        
        axios.get(`${urlApi}/categories`)
            .then(res => {
                setNameCategories(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    const handleFilterProduct = (e) => {
        dispatch(filterIdProduct(e))
    }

    const value = useSelector(state => state.filterProduct.idFilterProduct)
    

    return (
        <div className='product_card_element_filter'>
            <div className='products_filter_options_container'>
                <ul>
                    <li className='product_filter_title'>Filtrado de productos</li>
                    <li className='product_filter_option' onClick={() => handleFilterProduct('all')}>Todos</li>
                    <li className='product_filter_option' onClick={() => handleFilterProduct('collections')}>Agrupar Colecciones</li>
                    {   
                        isNameCategories?.map((category, index) => (
                            <li key={index} className='product_filter_option' onClick={() => handleFilterProduct(category.name)}>{ category.name }</li>
                        ))
                    }                    
                </ul>
            </div>
            <div className="element_random"></div>
            <div className="element_random"></div>
        </div>
    )
}

export default FilterProduct