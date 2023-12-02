import axios from "axios";
import { useState } from "react";



const getApiCollections = () => {
    const apiUrl = import.meta.env.VITE_API_URL
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

export default getApiCollections;