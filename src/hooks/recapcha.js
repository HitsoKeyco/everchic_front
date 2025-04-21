export const tokenRecaptcha = async (action) => {
    const { VITE_RECAPTCHA_KEY_SITE_PROD } = import.meta.env;


    return new Promise((resolve, reject) => {
        if (!window.grecaptcha) {
            console.error("reCAPTCHA no está cargado");
            reject("reCAPTCHA no está cargado");
            return;
        }
        
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(VITE_RECAPTCHA_KEY_SITE_PROD, { action })
                .then((token) => {
                    if (!token) {
                        console.error("El token de reCAPTCHA es null");
                        reject("El token de reCAPTCHA es null");
                    } else {
                        resolve(token);
                    }
                })
                .catch((err) => {
                    console.error("Error al generar el token:", err);
                    reject(err);
                });
        });
    });
};