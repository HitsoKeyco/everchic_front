import React, { useEffect, useRef, useState } from 'react';
import CardProduct from './CardProduct';
import './css/SliderHomeNewProducts.css'

const SliderHomeNewProducts = ({ products, isLike, updateLikeProducts }) => {

    // Referencias
    const containerSlider = useRef();
    const slider = useRef();

    // Estados
    const [isDragging, setIsDragging] = useState(false);
    const [isPositionSlider, setIsPositionSlider] = useState({ x: 0, y: 0 });
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    
    
    // Eventos del puntero

    // Evento inicio del toque
    const handleTouchStartSlider = (e) => {
        setIsDragging(true);
        const valueXLeft = slider.current.getBoundingClientRect();
        setStartPosition({
            x: e.touches[0].clientX - valueXLeft.left
        });
        
    };

    // Evento movimiento del toque
    const handleTouchMove = (e) => {
        if (isDragging) {
            const valueXLeftC = containerSlider.current.getBoundingClientRect();
            const x = e.touches[0].clientX - startPosition.x - valueXLeftC.left;
            setIsPositionSlider({
                x: x - 5
            });
        }
    };

    // Evento fin del toque
    const handleTouchEnd = () => {
        setIsDragging(false);
        
    };

    // Evento clic slider
    const handleMouseDownSlider = (e) => {
        setIsDragging(true);
        const valueXLeft = slider.current.getBoundingClientRect();
        setStartPosition({
            x: e.clientX - valueXLeft.left
        });
        
    };

    // Evento clic sostenido
    const handleMouseMove = (e) => {
        if (isDragging) {
            const valueXLeftC = containerSlider.current.getBoundingClientRect();
            const x = e.clientX - startPosition.x - valueXLeftC.left;
            setIsPositionSlider({
                x: x
            });
        }
        
    };

    // Evento click liberado
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Evento salida del área del contenedor
    const handleMouseLeave = () => {

        setIsDragging(false);
 
    };

    // Controlador del slider
    useEffect(() => {
        const valueXLeftC = containerSlider.current.getBoundingClientRect();
        const valueXLeft = slider.current.getBoundingClientRect();

        if (valueXLeftC.width > valueXLeft.width) {
            if (valueXLeft.left > valueXLeftC.left || valueXLeft.left < valueXLeftC.left) {
                setIsPositionSlider({
                    x: 0
                });
            }
        } else if (valueXLeftC.width < valueXLeft.width) {
            if (valueXLeft.left > valueXLeftC.left) {
                setIsPositionSlider({
                    x: 0
                });
            } else if (valueXLeftC.right > valueXLeft.right) {
                setIsPositionSlider({
                    x: -(valueXLeft.width - valueXLeftC.width) - 20
                });
            }
        }
    }, [isDragging]);

    useEffect(() => {
        const handleResize = () => {
            setIsPositionSlider({
                x: 0
            });
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const [ isSlider, setIsSlider ] = useState(true)

    return (
        <>
            <div
                className="new_products_container"
                ref={containerSlider}
            >
                <div className="new_products_title_container">
                    <p className='slider_home_movil_title'>Productos nuevos 🔥🔥</p>
                </div>
                <div
                    className="new_products_items_container"
                    ref={slider}
                    style={{ left: `${isPositionSlider.x}px` }}
                    onTouchStart={handleTouchStartSlider}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}                    
                    onMouseDown={handleMouseDownSlider}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {
                        products?.map((product) => (                            
                            <CardProduct key={product.id} product={product}  isLike={isLike} updateLikeProducts={updateLikeProducts} isSlider={isSlider}/>
                        ))
                    }
                </div>
            </div>
        </>
    );
};

export default SliderHomeNewProducts;
