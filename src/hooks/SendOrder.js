import axios from 'axios';
import Swal from 'sweetalert2';

const sendOrder = async (data, token, apiUrl, subtotalDecimal, priceUnit, total, setIsCompleteCaptcha, navigate) => {
    
    try {
        // 1. Recuperar datos del localStorage
        const cartString = localStorage.getItem('everchic_cart');
        const cart = JSON.parse(cartString) || {};
        const cartFreeString = localStorage.getItem('everchic_cart_free');
        const cartFree = JSON.parse(cartFreeString) || {};

        // 2. Preparar los datos para enviar
        const newData = { ...data, cart, cartFree, subtotal: subtotalDecimal, price_unit: priceUnit, total: total };

        // 3. Verificar el token de Hcaptcha
        if (!token) {
            setIsCompleteCaptcha(true);
            Swal.fire({
                position: "center",
                icon: "warning",
                text: "Por favor complete el captcha",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        // 4. Enviar solicitud de verificación de captcha
        const captchaResponse = await axios.post(`${apiUrl}/orders/verify_captcha`, { token });

        if (captchaResponse) {
            // 5. Enviar orden si la verificación es exitosa
            const orderResponse = await axios.post(`${apiUrl}/orders`, newData);

            if (orderResponse.data) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    text: "Orden enviada con éxito",
                    showConfirmButton: false,
                    timer: 1500
                });
                localStorage.removeItem('everchic_cart_free');
                localStorage.removeItem('everchic_cart');
                navigate('/');
            }

            // 6. Actualizar datos del usuario
            // try {
            //     const userResponse = await axios.put(`${apiUrl}/users`, data);
            //     if (userResponse.data) {
            //         console.log('Datos actualizados');
            //     }
            // } catch (userUpdateError) {
            //     console.error(userUpdateError);
            // }
        }
    } catch (error) {
        Swal.fire({
            position: "center",
            icon: "error",
            text: "Error al verificar el captcha o enviar la orden",
            showConfirmButton: true
        });
    }
};

export default sendOrder;
