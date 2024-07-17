const getConfigAuth = () => {
    const tokenLS = JSON.parse(localStorage.getItem("userData"));
    const token = tokenLS ? tokenLS.token : null;
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export default getConfigAuth;
