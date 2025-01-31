import axios from 'axios';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import './css/VerifyEmail.css'
import { Backdrop, CircularProgress } from '@mui/material';

const VerifyEmail = () => {
    const { VITE_MODE, VITE_API_URL_DEV, VITE_API_URL_PROD } = import.meta.env;
    const apiUrl = VITE_MODE === 'development' ? VITE_API_URL_DEV : VITE_API_URL_PROD;

    const { verificationToken } = useParams(); // Obtener el token de verificación de los parámetros de la URL
    const [verificationStatus, setVerificationStatus] = useState('Verificando...'); // Estado para almacenar el estado de la verificación
    const [loading, setLoading] = useState(false); // Estado de carga
    useEffect(() => {
        const verifyEmail = async () => {
            setLoading(true)
            try {                
                const response = await axios.put(`${apiUrl}/users/verify/${verificationToken}`);
                if (response.status === 200) {
                    setVerificationStatus('¡Correo electrónico verificado con éxito!');
                    setLoading(false)
                }
            } catch (error) {                
                setVerificationStatus('Hubo un error al verificar el correo electrónico.');
                setLoading(false)
            }
        };

        verifyEmail();
    }, [verificationToken]);

    return (
        <>
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

            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>


    );
};

export default VerifyEmail;
