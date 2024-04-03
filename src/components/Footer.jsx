import React from 'react'

const Footer = () => {
    return (
        <>
            <footer className='home_footer'>
                <div className="home_container_footer_elements">
                    <div className="home_icon_socials">
                        <i className='bx bxl-instagram'><p className='home_p'>ever_chic_</p></i>
                        <i className='bx bxl-whatsapp' ><p className='home_p'>+593 990887390</p></i>
                    </div>
                    <div className="home_icon_socials">
                        <a className='home_footer_link' href="">- Politicas de privacidad.</a>
                        <a className='home_footer_link' href="">- ¿Quienes somos?</a>
                        <a className='home_footer_link' href="">- Trabaja con nosotros.</a>
                    </div>
                </div>

            </footer>
            <p className='home_footer_copyright'>&copy; 2024 Everchic. Todos los derechos reservados.</p>
        </>
    )
}

export default Footer