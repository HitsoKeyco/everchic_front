import axios from "axios";
import { useEffect, useState } from "react"

const FilterCollections = () => {

    const { VITE_MODE, VITE_API_URL_DEV, VITE_API_URL_PROD } = import.meta.env;
    const apiUrl = VITE_MODE === 'development' ? VITE_API_URL_DEV : VITE_API_URL_PROD;

    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        totalPages: 0
    });

    useEffect(() => {
        let url = '';
        url = `${apiUrl}/collections/group_collection?page=${pagination.currentPage}&limit=${limit}`;

        axios.get(url)
        .then(res => {
            const { total, currentPage, totalPages, products } = res.data;                
            setPagination({ total, currentPage, totalPages });
            setProductsAPI(products);                
            //Este no debería ser el lugar correcto para almacenar los productos en el store
            localStorage.setItem('everchic_stored_products', JSON.stringify(products));
            dispatch(addProductStore(products));
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => setLoading(false));
    }, [])


    return (
        <div>FilterCollections</div>
    )
}

export default FilterCollections