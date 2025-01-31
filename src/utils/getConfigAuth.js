const getConfigAuth = () => {
    let token = null;

    try {
        token = JSON.parse(localStorage.getItem("token")); // Intenta obtener y parsear el token
    } catch (error) {
        console.error("Error parsing token from localStorage:", error); // Maneja errores de JSON.parse
    }

    return {
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }), // Agrega el encabezado si el token es válido
        },
    };
};

export default getConfigAuth;
