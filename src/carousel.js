import React, { useState } from 'react';
import './carousel.css';

const images = [
    { src: 'y00ts.webp', alt: 'Image 1' },
    { src: 'degods.webp', alt: 'Image 2' },
    { src: 'smyth.jpg', alt: 'Image 3' },
];

const Carousel = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (

        <div className="carousel">
            <div className="images-container">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`image-container ${index === hoveredIndex ? 'hovered' : ''}`}
                        onMouseOver={() => setHoveredIndex(index)}
                    >
                        <img src={image.src} alt={image.alt} />
                    </div>
                ))}
            </div>
            <div className="squares-container">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`square ${index === hoveredIndex ? 'filled' : ''}`}
                        onMouseOver={() => setHoveredIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;