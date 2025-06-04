// src/componentes/productGallery/index.tsx
import { useState } from "react";
import classes from "./productGallery.module.css";

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleImageChange = (index: number) => {
        setSelectedImageIndex(index);
    };

    if (!images || images.length === 0) {
        return (
            <div className={classes.imageSection}>
                <div className={classes.mainImageContainer}>
                    <img
                        src="https://www.shutterstock.com/image-illustration/image-not-found-grayscale-photo-260nw-2425909941.jpg"
                        alt={productName}
                        className={classes.mainImage}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={classes.imageSection}>
            {/* Imagen principal */}
            <div className={classes.mainImageContainer}>
                <img
                    src={
                        images[selectedImageIndex] ||
                        images[0] ||
                        "https://www.shutterstock.com/image-illustration/image-not-found-grayscale-photo-260nw-2425909941.jpg"
                    }
                    alt={productName}
                    className={classes.mainImage}
                    onError={(e) => {
                        e.currentTarget.src = "https://www.shutterstock.com/image-illustration/image-not-found-grayscale-photo-260nw-2425909941.jpg";
                    }}
                />
            </div>

            {/* Miniaturas si hay más de una imagen */}
            {images.length > 1 && (
                <div className={classes.thumbnailContainer}>
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`${productName} ${index + 1}`}
                            className={`${classes.thumbnail} ${
                                index === selectedImageIndex
                                    ? classes.thumbnailActive
                                    : ""
                            }`}
                            onClick={() => handleImageChange(index)}
                            onError={(e) => {
                                e.currentTarget.src = "https://www.shutterstock.com/image-illustration/image-not-found-grayscale-photo-260nw-2425909941.jpg";
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductGallery;
