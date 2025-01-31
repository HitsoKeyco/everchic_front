import { useEffect } from 'react';
import PropTypes from 'prop-types';

// Función para reiniciar el reCAPTCHA
const resetCaptcha = () => {
    if (window.grecaptcha && typeof window.grecaptcha.reset === 'function') {
        window.grecaptcha.reset();
    } else {
        console.warn("reCAPTCHA no está disponible o no se ha cargado correctamente.");
    }
};

// Función para inicializar el widget reCAPTCHA
const initializeCaptcha = (reCaptchaKey, onSubmitCaptcha, theme) => {
    if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        window.grecaptcha.render('recaptcha-container', {
            sitekey: reCaptchaKey,
            callback: onSubmitCaptcha,
            theme: theme === 'darkTheme' ? 'dark' : 'light',
            size: 'default',
            'expired-callback': resetCaptcha,
            'error-callback': resetCaptcha,
        });
    } else {
        console.error("reCAPTCHA no está listo para inicializar.");
    }
};

const ReCaptchaComponent = ({ reCaptchaKey, theme, onSubmitCaptcha }) => {
    useEffect(() => {
        const onloadCallback = () => {
            initializeCaptcha(reCaptchaKey, onSubmitCaptcha, theme);
        };

        if (window.grecaptcha) {
            window.grecaptcha.ready(onloadCallback);
        } else {
            const script = document.createElement('script');
            script.src = "https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit";
            script.async = true;
            script.defer = true;
            script.onload = onloadCallback;
            document.body.appendChild(script);
        }
    }, [reCaptchaKey, theme, onSubmitCaptcha]);

    return (
        
            <div id="recaptcha-container"/>
        
    );
};

ReCaptchaComponent.propTypes = {
    reCaptchaKey: PropTypes.string.isRequired,
    theme: PropTypes.string,
    onSubmitCaptcha: PropTypes.func.isRequired,
};

ReCaptchaComponent.defaultProps = {
    theme: 'light',
};

export default ReCaptchaComponent;
