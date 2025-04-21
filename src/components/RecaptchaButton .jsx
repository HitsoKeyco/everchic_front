import React from "react";

const RecaptchaButton = ({ action = "submit", className, setCaptchaToken, text }) => {
    const handleClick = (e) => {
        e.preventDefault();

        // Verifica que la API de reCAPTCHA se haya cargado
        if (!window.grecaptcha) {
            console.error("La API de reCAPTCHA no está disponible");
            return;
        }

        // Ejecuta reCAPTCHA con la acción indicada
        window.grecaptcha.ready(async() => {
            window.grecaptcha
                .execute("6LdsAQcrAAAAAKWSdzna8HJvSRcKPbIQGngQuzyy", { action })
                .then((token) => {
                    if (token === null) {
                        console.error("El token de reCAPTCHA es null");
                    } else {                      
                        setCaptchaToken(token);
                        
                    }
                })
                .catch((err) => {
                    console.error("Error al generar el token:", err);
                });
        });
    };

    return (
        <button onClick={handleClick} className={`g-recaptcha button ${className}`}>
            {text}
        </button>
    );
};

export default RecaptchaButton;
