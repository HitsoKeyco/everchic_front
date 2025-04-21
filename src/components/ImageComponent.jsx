import { lazy, Suspense } from 'react';

const OptimizedImage = lazy(() => import('./OptimizedImage'));

// Implementa un componente de imagen optimizado
const ImageComponent = () => {
  return (
    <Suspense fallback={<div>Cargando imagen...</div>}>
      <OptimizedImage 
        src="/ruta/imagen.jpg"
        width={300}
        height={200}
        loading="lazy"
      />
    </Suspense>
  );
};

export default ImageComponent; 