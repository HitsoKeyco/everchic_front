import React from 'react'
import AddCustomer from '../components/AddCustomer'
import ('./css/Checkout.css')

const Checkout = () => {
  return (
    <>
    <div className='checkout_container'>
      <AddCustomer/>      
    </div>
    </>
  )
}

export default Checkout