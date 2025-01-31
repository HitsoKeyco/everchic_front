// likeService.js
import axios from "axios";
import getConfigAuth from "./getConfigAuth";
import { useSelector } from "react-redux";


const useLikeService = () => {
    const { VITE_MODE, VITE_API_URL_DEV, VITE_API_URL_PROD } = import.meta.env;
    const apiUrl = VITE_MODE === 'development' ? VITE_API_URL_DEV : VITE_API_URL_PROD;
    
    const userId = useSelector(state => state.user.data?.id);

    let likes = [];
    const updateLikeProducts = async (productId) => {

        try {
            if (userId) {                
                // Usuario logueado
                const res = await axios.put(`${apiUrl}/users/like_update_product/`, { userId, productId }, getConfigAuth());
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
            const res = await axios.get(`${apiUrl}/users/like_product/${userId}`, getConfigAuth());
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
export default useLikeService;
