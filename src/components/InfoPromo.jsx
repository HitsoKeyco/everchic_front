import React, { useState } from 'react'
import './css/InfoPromo.css'
const InfoPromo = () => {

    const [isCloseInfo, setIsCloseInfo] = useState(true)

    const handleInfoShow = () => {
        setIsCloseInfo(false)
    }
    return (
        <>
            {
                isCloseInfo &&
                <div className="info_promo_container">
                    <p className='home_text_oferta'>PROMO: [3 Pares $13]  -  [6 Pares $20] - [12 Pares $36 + 1 gratis] 🛒</p>
                    {/* <li className='info_promo_close'><i className='bx bx-x' onClick={handleInfoShow}></i></li> */}
                </div>
            }
        </>
    )
}

export default InfoPromo