import React, { useState } from 'react'
import './css/FilterProduct.css'
import { useDispatch } from 'react-redux'
import { filterIdProduct } from '../store/slices/filterProduct.slice'

const FilterProduct = () => {
    
    const dispatch = useDispatch()
    
    const handleFilterProduct = (e) => {
        dispatch(filterIdProduct(e))
    }

    return (
        <div className='product_card_element_filter'>
            <div className='products_filter_options_container'>
                <ul>
                    <li className='product_filter_title'>Filtrado de productos</li>
                    <li className='product_filter_option' onClick={() => handleFilterProduct(0)}>Todos</li>
                    <li className='product_filter_option' onClick={() => handleFilterProduct(1)}>Colección</li>
                    <li className='product_filter_option' onClick={() => handleFilterProduct(2)}>Tejidos</li>
                    <li className='product_filter_option' onClick={() => handleFilterProduct(3)}>Sublimados</li>
                    <li className='product_filter_option' onClick={() => handleFilterProduct(4)}>Marca</li>
                    
                </ul>
            </div>
            <div className="element_random"></div>
            <div className="element_random"></div>
        </div>
    )
}

export default FilterProduct