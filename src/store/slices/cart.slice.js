import { createSlice } from "@reduxjs/toolkit";
import Swal from 'sweetalert2'

// Función para calcular el precio unitario basado en el número de unidades
const calculatePriceUnit = (units) => {
    if (units < 3) {
        return 5;
    } else if (units >= 3 && units < 6) {
        return 13 / 3;
    } else if (units >= 6 && units < 12) {
        return 20 / 6;
    } else if (units >= 12 && units < 60) {
        return 36 / 12;
    } else if (units >= 60) {
        return 165 / 60;
    }
};

const storedCartFreeString = localStorage.getItem('everchic_cart_free');
const storedCartFree = storedCartFreeString ? JSON.parse(storedCartFreeString) : [];

const storedCartString = localStorage.getItem('everchic_cart');
const storedCart = storedCartString ? JSON.parse(storedCartString) : [];

const quantityProductsFreeString = localStorage.getItem('everchic_cart_quantity_free');
const quantityProductsFree = quantityProductsFreeString ? JSON.parse(quantityProductsFreeString) : 0;

const storedProductsString = localStorage.getItem('everchic_stored_products');
const storedProducts = storedProductsString ? JSON.parse(storedProductsString) : [];


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        storedCart: storedCart,
        quantityProductsFree: quantityProductsFree,
        storedCartFree: storedCartFree,
        storedProducts,
        stateFreeToCart: false
    }
    ,
    reducers: {
        addProduct: (state, action) => {
            const { productId } = action.payload
            //buscamos el producto en la store general
            const existingStoreProductIndex = state.storedProducts.findIndex(item => item.id === productId);
            // console.log(existingStoreProductIndex);
            //buscamos en el storeCart
            const existingProductCartIndex = state.storedCart.findIndex(item => item.productId === productId);
            // console.log(existingProductCartIndex);
            //buscamos en el storeCartFree
            const existingProductCartFreeIndex = state.storedCartFree.findIndex(item => item.productId === productId);
            // console.log(existingProductCartFreeIndex);

            //si existe el producto
            // - Preguntar si existe tambien en freeCart
            // - Preguntar si sumando las cantidades entre storeCart y StoredCartFree es === al stock en storeProduct

            //preguntamos si existe en la storeProduct el producto
            if (existingStoreProductIndex !== -1) {
                //preguntamos si existe en la storecart el producto    
                if (existingProductCartIndex !== -1) {
                    //verificamos existencias de quantity en storeCartFree y storeCart
                    const cartFreeQuantity = existingProductCartFreeIndex !== -1 ? state.storedCartFree[existingProductCartFreeIndex].quantity : 0;
                    const cartQuantity = existingProductCartIndex !== -1 ? state.storedCart[existingProductCartIndex].quantity : 0;

                    // si el stock es mayor q la suma de las cantidades de storeCart.quantity y storeCartFree.quantity agregamos + 1
                    if (state.storedProducts[existingStoreProductIndex].stock > (cartFreeQuantity + cartQuantity)) {
                        state.storedCart[existingProductCartIndex].quantity += 1;
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Calcetin agregado!",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        state.storedCart[existingProductCartIndex].quantity = state.storedProducts[existingStoreProductIndex].stock - cartFreeQuantity;
                        Swal.fire({
                            position: "center",
                            icon: "warning",
                            title: "Lo sentimos, stock agotado!",
                            text: `La cantidad en el carrito ha sido ajustada debido a la disponibilidad de stock.`,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                } else {
                    //caso contrario si el producto no existe en el cart lo agregamos
                    const newProduct = {
                        productId: productId,
                        price: action.payload.price,
                        productName: action.payload.productName,
                        stock: action.payload.stock,
                        category: action.payload.category,
                        title: action.payload.title,
                        size: action.payload.size,
                        image: action.payload.image,
                        quantity: 1,
                    };
                    state.storedCart.push(newProduct);
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Calcetin agregado!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }

            const units = state.storedCart.reduce((acc, product) => acc + product.quantity, 0);
            const priceUnit = calculatePriceUnit(units);

            state.storedCart.forEach(product => {
                product.priceUnit = priceUnit;
            });

            if (units % 12 === 0) {
                state.quantityProductsFree += 1;
            }

            localStorage.setItem('everchic_cart_quantity_free', JSON.stringify(state.quantityProductsFree));
            localStorage.setItem('everchic_cart', JSON.stringify(state.storedCart));
        },


        addProductFree: (state, action) => {
            if (state.stateFreeToCart) {
                const { productId } = action.payload
                //buscamos el producto en la store general
                const existingStoreProductIndex = state.storedProducts.findIndex(item => item.id === productId);
                // console.log(existingStoreProductIndex);
                //buscamos en el storeCart
                const existingProductCartIndex = state.storedCart.findIndex(item => item.productId === productId);
                // console.log(existingProductCartIndex);
                //buscamos en el storeCartFree
                const existingProductCartFreeIndex = state.storedCartFree.findIndex(item => item.productId === productId);
                console.log(existingProductCartFreeIndex);

                //preguntamos si existe en la storeProduct el producto
                if (existingStoreProductIndex !== -1) {
                    //preguntamos si existe en la storecart el producto    
                    //verificamos existencias de quantity en storeCartFree y storeCart
                    const cartFreeQuantity = existingProductCartFreeIndex !== -1 ? state.storedCartFree[existingProductCartFreeIndex].quantity : 0;
                    const cartQuantity = existingProductCartIndex !== -1 ? state.storedCart[existingProductCartIndex].quantity : 0;
                    //preguntamos si existe el producto en el storeCartFree
                    if (existingProductCartFreeIndex !== -1) {
                        // si el stock es mayor q la suma de las cantidades de storeCart.quantity y storeCartFree.quantity agregamos + 1
                        if (state.storedProducts[existingStoreProductIndex].stock > (cartFreeQuantity + cartQuantity)) {
                            console.log(cartFreeQuantity + cartQuantity);
                            state.storedCartFree[existingProductCartFreeIndex].quantity += 1;
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Calcetin agregado!",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        } else {

                            Swal.fire({
                                position: "center",
                                icon: "warning",
                                title: "Lo sentimos, stock agotado!",
                                text: `La cantidad en el carrito ha sido ajustada debido a la disponibilidad de stock.`,
                                showConfirmButton: false,
                                timer: 1500,
                            });
                        }
                    } else {

                        if (state.storedProducts[existingStoreProductIndex].stock > (cartFreeQuantity + cartQuantity)) {                            
                            //si la suma de quantity de cartStore y freeProduct < storeProduct es posible agregar el producto gratuito
                            const newProduct = {
                                productId: productId,
                                price: action.payload.price,
                                productName: action.payload.productName,
                                stock: action.payload.stock,
                                category: action.payload.category,
                                title: action.payload.title,
                                size: action.payload.size,
                                image: action.payload.image,
                                quantity: 1,
                            };
                            state.storedCartFree.push(newProduct);
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Calcetin agregado!",
                                showConfirmButton: false,
                                timer: 1500
                            });

                        } else {

                            Swal.fire({
                                position: "center",
                                icon: "warning",
                                title: "Lo sentimos, stock agotado!",                                
                                showConfirmButton: false,
                                timer: 1500,
                            });
                        }
                    }
                }
                // Calcular el precio unitario basado en la cantidad total de productos en el carrito
                const units = state.storedCartFree.reduce((acc, product) => acc + product.quantity, 0);
                if (units % 12 === 0) {
                    state.quantityProductsFree -= 1;
                }

                const unitsFree = state.quantityProductsFree
                const unitsProductsFree = state.storedCartFree.reduce((acc, item) => acc + item.quantity, 0)
                if (unitsFree === unitsProductsFree){
                    state.stateFreeToCart = false
                }


                localStorage.setItem('everchic_cart_quantity_free', JSON.stringify(state.quantityProductsFree));
                localStorage.setItem('everchic_cart_free', JSON.stringify(state.storedCartFree));

            }
        },






        plusProduct: (state, action) => {
            const { productId } = action.payload;
            const existingProductIndex = state.storedCart.findIndex(item => item.productId === productId);
            const existingProductCartFree = state.storedCartFree.find(item => item.productId === productId);

            if (existingProductIndex !== -1) {
                //si existe una igualdad entre las sumas de sus cantidades de un mismo productos en cart y cartfree entonces no hay stock
                if (state.storedCart[existingProductIndex].quantity + (existingProductCartFree ? existingProductCartFree.quantity : 0) === state.storedCart[existingProductIndex].stock) {
                    Swal.fire({
                        position: "center",
                        icon: "warning",
                        customClass: {
                            container: 'custom-swal-container',
                        },
                        title: "Lo sentimos, stock agotado!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    //caso contrario si el stock del producto en cart es mayor a su cantidad entonces agregamos +1
                } else if (state.storedCart[existingProductIndex].stock > state.storedCart[existingProductIndex].quantity) {
                    // Incrementar la cantidad en 1
                    state.storedCart[existingProductIndex].quantity += 1;

                    // Actualizar el precio unitario en cada producto del carrito
                    const units = state.storedCart.reduce((acc, product) => acc + product.quantity, 0);
                    const priceUnit = calculatePriceUnit(units);

                    //establecemos los nuevoas precios
                    state.storedCart.forEach(product => {
                        product.priceUnit = priceUnit;
                    });
                    //hacemos el calculo de cuantas unidades gratuitas tiene
                    if (units % 12 === 0) {
                        state.quantityProductsFree += 1
                    }
                    // actualizamos el estado de cantidades gratuitas
                    //actulizamos el estado de cart hacia localStorage
                    localStorage.setItem('everchic_cart_quantity_free', JSON.stringify(state.quantityProductsFree));
                    localStorage.setItem('everchic_cart', JSON.stringify(state.storedCart));

                } else {
                    console.log('random');
                    Swal.fire({
                        position: "center",
                        icon: "warning",
                        title: "Lo sentimos, stock agotado!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        },

        minusProduct: (state, action) => {
            const { productId } = action.payload;
            const existingProductIndex = state.storedCart.findIndex(item => item.productId === productId);
            const existingProductFreeIndex = state.storedCartFree.findIndex(item => item.productId === productId);

            if (existingProductIndex !== -1) {
                // Si el producto existe en el carrito
                if (state.storedCart[existingProductIndex].quantity > 1) {
                    // Decrementar la cantidad si es mayor que 1
                    state.storedCart[existingProductIndex].quantity -= 1;
                } else {
                    // Eliminar el producto si la cantidad es 1
                    state.storedCart.splice(existingProductIndex, 1);
                }

                // Actualizar el precio unitario en cada producto del carrito
                const units = state.storedCart.reduce((acc, product) => acc + product.quantity, 0);
                const priceUnit = calculatePriceUnit(units);

                // Actualizar la cantidad gratuita asignada basada en las unidades totales
                const unitsFree = Math.floor(units / 12);
                state.quantityProductsFree = unitsFree;

                // Reducir en 1 la cantidad de productos gratuitos si existen o eliminar el ultimo producto q tenga quantiti === 1


                const quantityProductsCartFree = state.storedCartFree.reduce((acc, product) => acc + product.quantity, 0)


                if (unitsFree < quantityProductsCartFree) {

                    if (existingProductFreeIndex !== -1) {
                        if (state.storedCartFree[existingProductFreeIndex].quantity > 1) {
                            state.storedCartFree[existingProductFreeIndex].quantity -= 1;

                        } else {
                            state.storedCartFree.splice(existingProductIndex, 1);
                        }
                    } else {

                        const lastIndex = state.storedCartFree.reduce((acc, product, index) => {
                            return product.quantity === 1 ? index : acc;
                        }, -1);

                        if (lastIndex !== -1) {
                            // Elimina el último elemento con quantity igual a 1
                            state.storedCartFree.splice(lastIndex, 1);

                        } else {
                            const lastIndex = state.storedCartFree.reduce((acc, product, index) => {
                                return product.quantity ? index : acc;
                            }, -1);
                            if (state.storedCartFree[lastIndex].quantity > 1) {
                                state.storedCartFree[lastIndex].quantity -= 1;
                            } else {
                                state.storedCartFree.splice(lastIndex, 1);
                            }
                        }
                    }

                }




                // if (existingProductFreeIndex !== -1) {
                //     if (state.storedCartFree[existingProductFreeIndex].quantity > 1) {
                //         state.storedCartFree[existingProductFreeIndex].quantity -= 1;
                //     }

                // }

                if (unitsFree === 0) {
                    state.storedCartFree = [];
                    localStorage.setItem('everchic_cart_free', JSON.stringify([]));
                    state.stateFreeToCart = false;
                }

                state.storedCart.forEach(product => {
                    product.priceUnit = priceUnit;
                });

                localStorage.setItem('everchic_cart_quantity_free', JSON.stringify(state.quantityProductsFree));
                localStorage.setItem('everchic_cart_free', JSON.stringify(state.storedCartFree));
                localStorage.setItem('everchic_cart', JSON.stringify(state.storedCart));

            }
        },

        deleteProduct: (state, action) => {
            const { productId } = action.payload;
            const existingProductIndex = state.storedCart.findIndex(item => item.productId === productId);
        
            if (existingProductIndex !== -1) {
                // Eliminar el producto del carrito principal
                state.storedCart.splice(existingProductIndex, 1);
        
                const units = state.storedCart.reduce((acc, product) => acc + product.quantity, 0);
                const unitsFree = Math.floor(units / 12);
        
                // Ajustar el contador de productos gratuitos en función de las docenas completas
                state.quantityProductsFree = unitsFree;
        
                // Comparar con la cantidad actual en storeCartFree
                const currentFreeUnits = state.storedCartFree.reduce((acc, product) => acc + product.quantity, 0);
        
                // Ajustar storeCartFree según sea necesario
                if (currentFreeUnits > unitsFree) {
                    // Excedente de unidades en storeCartFree, ajustar
                    for (let i = currentFreeUnits; i > unitsFree; i--) {
                        const indexToRemove = state.storedCartFree.findIndex(product => product.quantity > 0);
                        if (indexToRemove !== -1) {
                            // Reducir la cantidad de uno de los productos en storeCartFree
                            state.storedCartFree[indexToRemove].quantity -= 1;
                        }
                    }
                }
        
                // Limpiar storeCartFree eliminando productos con cantidad 0
                state.storedCartFree = state.storedCartFree.filter(product => product.quantity > 0);
        
                const priceUnit = calculatePriceUnit(units);
        
                // Actualizar el precio unitario en cada producto del carrito principal
                state.storedCart.forEach(product => {
                    product.priceUnit = priceUnit;
                });
        
                localStorage.setItem('everchic_cart_quantity_free', JSON.stringify(state.quantityProductsFree));
                localStorage.setItem('everchic_cart_free', JSON.stringify(state.storedCartFree));
                localStorage.setItem('everchic_cart', JSON.stringify(state.storedCart));
            }
        },
        
        

        deleteProductFree: (state, action) => {
            const { productId } = action.payload;
            const existingProductFreeIndex = state.storedCartFree.findIndex(item => item.productId === productId);

            if (existingProductFreeIndex !== -1) {
                state.storedCartFree.splice(existingProductFreeIndex, 1);
                localStorage.setItem('everchic_cart_free', JSON.stringify(state.storedCartFree));
            }
        },

        accessFreeProduct: (state, action) => {
            state.stateFreeToCart = action.payload;
        },

    }
});


export const { addProduct, plusProduct, minusProduct, deleteProduct, addProductFree, accessFreeProduct, deleteProductFree } = cartSlice.actions;



export default cartSlice.reducer;
