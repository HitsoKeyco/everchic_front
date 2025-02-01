
import './css/Footer.css';

const Footer = () => {


    return (
        <footer className='footer_container'>

            <div className='footer_section_container'>
                <div className='footer_section'>
                    <ul className='footer_info'>
                        <li className='footer_title_logo'>Everchic</li>
                        <li><a href="mailto:soporte@everchic.ec" className='footer_link footer_link_email'>soporte@everchic.ec</a></li>
                        <li>Guayaquil - Ecuador</li>
                    </ul>
                </div>
                <div className='footer_section'>
                    <ul className='footer_info'>
                        <li className='footer_title'>Información</li>
                        <li><a href="#" className='footer_link' rel="noopener noreferrer">Acerca de nosotros 👷</a></li>
                        <li><a href="#" className='footer_link' rel="noopener noreferrer">Devoluciones 👷</a></li>
                        <li><a href="#" className='footer_link' rel="noopener noreferrer">Contactanos</a></li>
                        <li><a href="#" className='footer_link' rel="noopener noreferrer">Trabaja con nosotros 👷</a></li>
                    </ul>
                </div>
                <div className='footer_section'>
                    <ul className='footer_info'>
                        <li className='footer_title'>Recursos</li>
                        <li><a href="#" className='footer_link' rel="noopener noreferrer">Blog 👷</a></li>
                        <li><a href="#" className='footer_link' rel="noopener noreferrer">Ayuda 👷</a></li>
                    </ul>
                </div>
                <div className='footer_section'>
                    <ul className='footer_social'>
                        <li className='footer_title'>Redes Sociales</li>
                        <li><a href="#" className='footer_link' target="_blank" rel="noopener noreferrer">Facebook</a></li>                        
                        <li><a href="https://www.instagram.com/b.everchic/" className='footer_link' target="_blank" rel="noopener noreferrer">Instagram</a></li>
                    </ul>
                </div>
            </div>
            <p className='footer_copyright_text'>&copy; 2024 Everchic. Todos los derechos reservados.</p>

        </footer>
    );
};

export default Footer;