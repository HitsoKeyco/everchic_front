import { createSlice } from "@reduxjs/toolkit";
import Decimal from "decimal.js";
import Swal from 'sweetalert2'

// Función para calcular el precio unitario basado en el número de unidades

const storedCartString = localStorage.getItem('everchic_cart');
const storedCart = storedCartString ? JSON.parse(storedCartString) : [];

const storedCartFreeString = localStorage.getItem('everchic_cart_free');
const storedCartFree = storedCartFreeString ? JSON.parse(storedCartFreeString) : [];

const storedProductsString = localStorage.getItem('everchic_stored_products');
const storedProducts = storedProductsString ? JSON.parse(storedProductsString) : [];

const quantityProductCart = storedCart.reduce((acc, product) => product.quantity + acc, 0)

const calculateDozens = (quantityProductCart) => {
    const dozens = new Decimal(quantityProductCart).div(12);
    return dozens.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber(); // Redondea a entero
};

const unitsFree = calculateDozens(quantityProductCart);

localStorage.setItem('everchic_cart_quantity_free', unitsFree);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        storedCart: storedCart,
        quantityProductsFree: unitsFree,
        storedCartFree,
        storedProducts: storedProducts,
        stateShippingCart: 0,
        stateTotalCart: 0,
        stateFreeToCart: false,


    },
    reducers: {
        // eslint-disable-next-line no-unused-vars
        deleteAllProducts: (state, action) => {
            state.storedCart = [];
            state.storedCartFree = [];
            state.stateShippingCart = 0;
            state.stateTotalCart = 0;
            state.stateFreeToCart = false;
            state.quantityProductsFree = 0
        },

        addPriceShippingStore: (state, action) => {
            state.stateShippingCart = action.payload
        },

        addProductStore: (state, action) => {
            state.storedProducts = action.payload
        },

        addStoreCart: (state, action) => {
            state.storedCart = action.payload
        },
        
        addStoreCartFree: (state, action) => {
            state.storedCartFree = action.payload
        },

        addProduct: (state, action) => {
            const { productId } = action.payload    
            //console.log('entramos a la compra a redux', productId);
            
            //buscamos el producto en la store general
            const existingStoreProductIndex = state.storedProducts.findIndex(item => {
                return item.id === productId;
            });
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
                //console.log('Preguntar si existe el producto en existingStoreProductIndex',existingStoreProductIndex);
                
            //preguntamos si existe en la storeProduct el producto
            if (existingStoreProductIndex !== -1) {
                //console.log('preguntamos si existe en la storeProduct el producto');
                
                //preguntamos si existe en la storecart el producto    
                if (existingProductCartIndex !== -1) {
                    //console.log('preguntamos si existe en la storecart el producto    ');
                    
                    //verificamos existencias de quantity en storeCartFree y storeCart
                    const cartFreeQuantity = existingProductCartFreeIndex !== -1 ? state.storedCartFree[existingProductCartFreeIndex].quantity : 0;
                    const cartQuantity = existingProductCartIndex !== -1 ? state.storedCart[existingProductCartIndex].quantity : 0;

                    // si el stock es mayor q la suma de las cantidades de storeCart.quantity y storeCartFree.quantity agregamos + 1
                    if (state.storedProducts[existingStoreProductIndex].stock > (cartFreeQuantity + cartQuantity)) {
                        //console.log('si el stock es mayor q la suma de las cantidades de storeCart.quantity y storeCartFree.quantity agregamos + 1');
                        
                        state.storedCart[existingProductCartIndex].quantity += 1;
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Calcetín agregado!",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        state.storedCart[existingProductCartIndex].quantity = state.storedProducts[existingStoreProductIndex].stock - cartFreeQuantity;
                        Swal.fire({
                            position: "center",
                            icon: "warning",
                            title: "No dispodemos de mas unidades!",
                            showConfirmButton: true,
                        });
                    }

                } else {
                    //caso contrario si el producto no existe en el cart lo agregamos
                    const newProduct = {
                        productId: productId,
                        price: action.payload.price,
                        productName: action.payload.productName,
                        stock: action.payload.stock,
                        weight: action.payload.weight,
                        category: action.payload.category,
                        title: action.payload.title,
                        size: action.payload.size,
                        image: action.payload.image,
                        quantity: 1,
                    };
                    state.storedCart.push(newProduct);
                    localStorage.setItem('everchic_cart', JSON.stringify(state.storedCart));
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Calcetín agregado!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
            
            // else{
            //     //si el producto no existe en el store lo agregamos
            //     const newProduct = {
            //         productId: productId,
            //         price: action.payload.price,
            //         productName: action.payload.productName,
            //         stock: action.payload.stock,
            //         weight: action.payload.weight,
            //         category: action.payload.category,
            //         title: action.payload.title,
            //         size: action.payload.size,
            //         image: action.payload.image,
            //         quantity: 1,
            //     };
            //     state.storedCart.push(newProduct);
            //     localStorage.setItem('everchic_cart', JSON.stringify(state.storedCart));
            //     Swal.fire({
            //         position: "center",
            //         icon: "success",
            //         title: "Calcetín agregado!",
            //         showConfirmButton: false,
            //         timer: 1500
            //     });
            
            // }

            const units = state.storedCart.reduce((acc, product) => acc + product.quantity, 0);
            const priceUnit = calculatePriceUnit(units);

            state.storedCart.forEach(product => {
                product.priceUnit = priceUnit;

            });

            state.stateTotalCart = Number((priceUnit).toFixed(2)) * units

            if (units >= 12 && state.storedCart.length > 0 && units % 12 === 0) {
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
                // console.log(existingProductCartFreeIndex);

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
                            // console.log(cartFreeQuantity + cartQuantity);
                            state.storedCartFree[existingProductCartFreeIndex].quantity += 1;
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Calcetín agregado!",
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
                                weight: action.payload.weight,
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
                                title: "Calcetín agregado!",
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
                if (unitsFree === unitsProductsFree) {
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
                    state.stateTotalCart = Number((priceUnit).toFixed(2)) * units
                    //hacemos el calculo de cuantas unidades gratuitas tiene
                    if (units % 12 === 0) {
                        state.quantityProductsFree += 1
                    }
                    // actualizamos el estado de cantidades gratuitas
                    //actulizamos el estado de cart hacia localStorage
                    localStorage.setItem('everchic_cart_quantity_free', JSON.stringify(state.quantityProductsFree));
                    localStorage.setItem('everchic_cart', JSON.stringify(state.storedCart));

                } else {
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



                state.storedCart.forEach(product => {
                    product.priceUnit = priceUnit;
                });

                state.stateTotalCart = Number((priceUnit).toFixed(2)) * units

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
                const priceUnit = calculatePriceUnit(units);
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

                // Actualizar el precio unitario en cada producto del carrito principal
                state.storedCart.forEach(product => {
                    product.priceUnit = priceUnit;
                });

                state.stateTotalCart = Number((priceUnit).toFixed(2)) * units

                localStorage.setItem('everchic_cart_quantity_free', JSON.stringify(state.quantityProductsFree));
                localStorage.setItem('everchic_cart_free', JSON.stringify(state.storedCartFree));
                localStorage.setItem('everchic_cart', JSON.stringify(state.storedCart));
            }
        },

        deleteProductFree: (state, action) => {
            const { productId } = action.payload;
            const existingProductFreeIndex = state.storedCartFree.findIndex(item => item.productId === productId);

            const units = state.storedCart.reduce((acc, product) => acc + product.quantity, 0);
            const priceUnit = calculatePriceUnit(units);
            

            if (existingProductFreeIndex !== -1) {
                state.storedCartFree.splice(existingProductFreeIndex, 1);
                localStorage.setItem('everchic_cart_free', JSON.stringify(state.storedCartFree));
            }

            state.stateTotalCart = Number((priceUnit).toFixed(2)) * units
        },

        accessFreeProduct: (state, action) => {
            state.stateFreeToCart = action.payload;
        },

        updateCartFreeQuantity: (state, action) => {
            state.quantityProductsFree = action.payload
            state.stateFreeToCart = false
        },
    }
});


const calculatePriceUnit = (units) => {
    let price;

    if (units < 3) {
        price = new Decimal(5);
    } else if (units >= 3 && units < 6) {
        price = new Decimal(13).div(3);
    } else if (units >= 6 && units < 12) {
        price = new Decimal(20).div(6);
    } else if (units >= 12 && units < 60) {
        price = new Decimal(36).div(12);
    } else if (units >= 60) {
        price = new Decimal(165).div(60);
    }

    // Redondear a dos decimales y convertir a número
    return price.toNumber(); // Cambia aquí
};




export const {
    addStoreCart,
    addStoreCartFree,
    deleteAllProducts,
    addPriceShippingStore,
    addProductStore,
    addProduct,
    plusProduct,
    minusProduct,
    deleteProduct,
    addProductFree,
    accessFreeProduct,
    deleteProductFree,
    updateCartFreeQuantity

} = cartSlice.actions;



export default cartSlice.reducer;



export const adjustLowStockThunk = (productId, stock, quantity_missing) => (dispatch) => {
    // Si quantity_missing es negativo, convertimos a positivo
    const absQuantityMissing = Math.abs(quantity_missing);

    // Busca el producto en cartFree
    const existingProductFreeIndex = storedCartFree.findIndex(item => item.productId === productId);
    const existingProductCartIndex = storedCart.findIndex(item => item.productId === productId);

    // Verifica si hay suficiente stock disponible para la cantidad que falta
    if (stock >= absQuantityMissing) {
        // Si el producto existe en cartFree
        if (existingProductFreeIndex !== -1) {
            // Si la cantidad del producto en cartFree es mayor o igual a la cantidad que falta
            if (storedCartFree[existingProductFreeIndex].quantity >= absQuantityMissing) {
                // Resta la cantidad que falta
                storedCartFree[existingProductFreeIndex].quantity -= absQuantityMissing;

                // Si la cantidad se reduce a 0, elimina el producto de cartFree
                if (storedCartFree[existingProductFreeIndex].quantity === 0) {
                    const updatedCartFree = storedCartFree.filter(item => item.productId !== productId);
                    dispatch(addStoreCartFree(updatedCartFree));
                    localStorage.setItem('everchic_cart_free', JSON.stringify(updatedCartFree));
                }
            } else {
                // Si no hay suficiente en cartFree, busca en cart
                const remainingQuantity = absQuantityMissing - storedCartFree[existingProductFreeIndex].quantity;

                // Eliminar el producto de cartFree
                const updatedCartFree = storedCartFree.filter(item => item.productId !== productId);
                dispatch(addStoreCartFree(updatedCartFree));
                localStorage.setItem('everchic_cart_free', JSON.stringify(updatedCartFree));

                // Si hay suficiente en cart para cubrir el resto
                if (existingProductCartIndex !== -1) {
                    if (storedCart[existingProductCartIndex].quantity >= remainingQuantity) {
                        storedCart[existingProductCartIndex].quantity -= remainingQuantity;

                        // Si la cantidad en cart se reduce a 0, elimina el producto de cart
                        if (storedCart[existingProductCartIndex].quantity === 0) {
                            const updatedCart = storedCart.filter(item => item.productId !== productId);
                            dispatch(addStoreCart(updatedCart));
                            localStorage.setItem('everchic_cart', JSON.stringify(updatedCart));
                        }
                    } else {
                        // Si no hay suficiente en cart, elimina el producto
                        const updatedCart = storedCart.filter(item => item.productId !== productId);
                        dispatch(addStoreCart(updatedCart));
                        localStorage.setItem('everchic_cart', JSON.stringify(updatedCart));

                        console.log('No hay suficiente stock disponible para cubrir la cantidad faltante.');
                    }
                }
            }
        } else {
            // Si el producto no existe en cartFree, maneja esta situación según la lógica de tu aplicación
            console.log('El producto no está en cartFree.');
        }
    } else {
        // Si no hay suficiente stock disponible, elimina el producto
        if (existingProductFreeIndex !== -1) {
            const updatedCartFree = storedCartFree.filter(item => item.productId !== productId);
            dispatch(addStoreCartFree(updatedCartFree));
            localStorage.setItem('everchic_cart_free', JSON.stringify(updatedCartFree));
        }
        if (existingProductCartIndex !== -1) {
            const updatedCart = storedCart.filter(item => item.productId !== productId);
            dispatch(addStoreCart(updatedCart));
            localStorage.setItem('everchic_cart', JSON.stringify(updatedCart));
        }

        console.log('No hay suficiente stock disponible para cubrir la cantidad faltante.');
    }
};
