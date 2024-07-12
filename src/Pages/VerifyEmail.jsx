import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import './css/VerifyEmail.css'

const VerifyEmail = () => {
    const { verificationToken } = useParams(); // Obtener el token de verificación de los parámetros de la URL
    const [verificationStatus, setVerificationStatus] = useState('Verificando...'); // Estado para almacenar el estado de la verificación

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const url = import.meta.env.VITE_API_URL;
                const response = await axios.put(`${url}/users/verify/${verificationToken}`).catch(err => console.log(err));
                
                if (response.status === 200) {
                    setVerificationStatus('¡Correo electrónico verificado con éxito!');
                } else {
                    setVerificationStatus('Hubo un error al verificar el correo electrónico.');
                }
            } catch (error) {
                console.error('Error:', error);
                setVerificationStatus('Hubo un error al verificar el correo electrónico.');
            }
        };

        verifyEmail();
    }, [verificationToken]);

    return (
        <motion.div
            className="product_filter_elements_container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className='verify_email_container'>
                <div className="verify_email_info">
                    <h2 className='verify_email_title'>Verificación de Correo Electrónico</h2>
                    <p className='verify_email_status'>{verificationStatus}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default VerifyEmail;
