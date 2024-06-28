// likeService.js
import axios from "axios";


const likeService = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const userIdString = localStorage.getItem('user');
    const userId = userIdString ? JSON.parse(userIdString).id : null;
    let likes = [];

    const updateLikeProducts = async (productId) => {

        try {
            if (userId) {                
                // Usuario logueado
                const res = await axios.put(`${apiUrl}/users/like_update_product/`, { userId, productId });
                if (res.data.message === 'Like agregado') {
                    likes.push(productId);
                    
                } else if (res.data.message === 'Like eliminado') {
                    likes = likes.filter(id => id !== productId);
                }
            } else {
                // Usuario no logueado
                const likesString = localStorage.getItem('likes');
                likes = likesString ? JSON.parse(likesString) : [];
                if (likes.includes(productId)) {                    
                    likes = likes.filter(id => id !== productId);
                } else {                    
                    likes.push(productId);
                }
            }

            localStorage.setItem('likes', JSON.stringify(likes));
        } catch (error) {
            console.error("Error en la gestión de likes:", error);
        }

        return likes;
    }

    const getLikeProducts = async () => {
        if (userId) {
            const res = await axios.get(`${apiUrl}/users/like_product/${userId}`);
            likes = res.data.map(item => item.productId);
            localStorage.setItem('likes', JSON.stringify(likes));
        } else {
            const likesString = localStorage.getItem('likes');
            likes = likesString ? JSON.parse(likesString) : [];
        }

        return likes
    }

    return { updateLikeProducts, getLikeProducts };

}
export default likeService;
