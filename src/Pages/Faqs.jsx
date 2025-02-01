import React from 'react'
import './css/Faqs.css'
import { motion } from 'framer-motion';

const Faqs = () => {
  return (
    <motion.div
      className="product_filter_elements_container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='faqs_container'>
        <span className='faqs_title'>Preguntas frecuentes.</span>
        <div className="faqs_information_container">
          <h3 className='faqs_information_question'>¿Quiénes somos?</h3>
          <p className="faqs_information_answer">Somos una tienda  <b>100% online</b> ubicada en Guayaquil. Nos especializamos en la venta de calcetines tejidos y sublimados de alta calidad.</p>
        </div>

        <div className="faqs_information_container">
          <h3 className='faqs_information_question'>¿Cuánto tiempo tarda un envío?</h3>
          <p className="faqs_information_answer">El tiempo de entrega de nuestros productos varía según la ciudad de destino. Por lo general, los envíos se entregan dentro de un período de 24 a 72 horas laborables, dependiendo de la ubicación.</p>
        </div>
        <div className="faqs_information_container">
          <h3 className='faqs_information_question'>¿A partir de cuántas docenas recibiré un par de obsequio?</h3>
          <p className="faqs_information_answer">Por cada docena de calcetines que adquieras, recibirás un par de obsequio adicional como agradecimiento por tu compra, cuando agregues los 12 pares se abrira un boton en el carrito para que agreges el par gratis.</p>
        </div>
        <div className="faqs_information_container">
          <h3 className='faqs_information_question'>¿Cuál es el costo de los envíos?</h3>
          <p className="faqs-information-answer">Los precios de los envíos varían según el destino:</p>
          <p className="faqs_information_answer">- A cualquier ciudad: $6.00.</p>
          <p className="faqs_information_answer">- A Galápagos: $12.50.</p>
          <p className="faqs_information_answer">- Cooperativa de transporte: $5.50.</p>
          <p className="faqs_information_answer">- Guayaquil "Previo pago": Delivery $2.50</p>
        </div>
        <div className="faqs_information_container">
          <h3 className='faqs_information_question'>¿Tienen puntos de entrega o retiro?</h3>
          <p className="faqs_information_answer">No, actualmente operamos exclusivamente como una tienda en línea. Todos nuestros productos se envían directamente a la dirección proporcionada por el cliente.</p>
        </div>
        <div className="faqs_information_container">
          <h3 className='faqs_information_question'>¿Qué es un calcetín sublimado?</h3>
          <p className="faqs_information_answer">Un calcetín sublimado es fabricado con una mezcla de poliéster y elastano, y se caracteriza por tener diseños impresos mediante un proceso de sublimación térmica. Esto garantiza una alta calidad y durabilidad en los diseños.</p>
        </div>
        <div className="faqs_information_container">
          <h3 className='faqs_information_question'>¿Fabrican diseños personalizados?</h3>
          <p className="faqs_information_answer">Sí, ofrecemos el servicio de fabricación de diseños personalizados. Para realizar un pedido de diseños personalizados, se requiere una cantidad mínima de 5 docenas por diseño y talla, a un costo de $33.00 por docena.</p>
        </div>
        
      </div>
    </motion.div>
  )
}

export default Faqs