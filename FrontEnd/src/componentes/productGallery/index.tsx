// src/componentes/productGallery/index.tsx
import { useState } from "react";
import classes from "./productGallery.module.css";
import { PlaceholderURL } from "../../constants";

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
                        src={PlaceholderURL}
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
                        PlaceholderURL
                    }
                    alt={productName}
                    className={classes.mainImage}
                    onError={(e) => {
                        e.currentTarget.src = PlaceholderURL
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
                                e.currentTarget.src = PlaceholderURL;
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductGallery;
