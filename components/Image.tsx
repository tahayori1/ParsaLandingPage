import React from 'react';

interface ImageProps {
    src: string; // Base name like "KMC J7"
    alt: string;
    className?: string;
    width: string | number;
    height: string | number;
    loading?: 'lazy' | 'eager';
}

const Image: React.FC<ImageProps> = ({ src, alt, className, width, height, loading = 'lazy' }) => {
    // NOTE: This assumes a CDN/backend is set up to provide resized WebP images.
    // The URLs are constructed based on a common convention.
    const webpBaseUrl = 'https://x264.storage.iran.liara.space/conditions/img/webp/';
    const fallbackBaseUrl = 'https://hoseinikhodro.com/conditions/img/';
    
    const imageName = src.replace(/\s/g, '-');
    
    // Constructing srcset for WebP format with different resolutions
    const webpSrcSet = `
        ${webpBaseUrl}${imageName}-300w.webp 300w,
        ${webpBaseUrl}${imageName}-600w.webp 600w,
        ${webpBaseUrl}${imageName}-900w.webp 900w
    `;

    const fallbackSrc = `${fallbackBaseUrl}${encodeURIComponent(src)}.png`;

    return (
        <picture>
            <source 
                type="image/webp" 
                srcSet={webpSrcSet} 
                // Provides hints to the browser about the image's display size
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px" 
            />
            <img
                src={fallbackSrc}
                alt={alt}
                className={className}
                width={width}
                height={height}
                loading={loading}
                onError={(e) => {
                    // Fallback to a generic placeholder if the primary image fails to load
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('placeholder.png')) {
                        target.src = `${fallbackBaseUrl}placeholder.png`;
                    }
                }}
            />
        </picture>
    );
};

export default React.memo(Image);
