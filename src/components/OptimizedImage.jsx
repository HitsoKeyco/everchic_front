import { Suspense } from 'react';
import PropTypes from 'prop-types';

const OptimizedImage = ({ 
    src, 
    alt = 'Imagen', 
    className = '', 
    style = {} 
}) => {
    return (
        <Suspense fallback={<div>Cargando imagen...</div>}>
            <img
                src={src}
                alt={alt}
                loading="lazy" 
                className={className}
                style={style}
                decoding="async"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/fallback-image.jpg';
                }}
            />
        </Suspense>
    );
};

OptimizedImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
};

export default OptimizedImage;