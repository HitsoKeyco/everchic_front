import axios from "axios";
import { useState } from "react";

const useApiCollections = () => {
    const { VITE_MODE, VITE_API_URL_DEV, VITE_API_URL_PROD } = import.meta.env;
    const apiUrl = VITE_MODE === 'development' ? VITE_API_URL_DEV : VITE_API_URL_PROD;
    const [ collectionAPI, setCollectionAPI] = useState()

    const getCollectionAPI = () => {
        axios.get(`${apiUrl}/collections`)
        .then(res => {
            setCollectionAPI(res.data)
        })
        .catch(err => {
            console.log(err);
        });
    }

    return {collectionAPI, getCollectionAPI}
}

export default useApiCollections;