// src/components/municipio/MunicipioIndicator.tsx
import { useMunicipio } from "../../contexts/municipioContext";
import classes from "./municipioIndicator.module.css";

interface MunicipioIndicatorProps {
    size?: "small" | "medium" | "large";
    style?: "banner" | "chip";
}

function MunicipioIndicator({
    size = "medium",
    style = "chip",
}: MunicipioIndicatorProps) {
    const { municipio, clearMunicipio } = useMunicipio();

    if (!municipio) return null;

    const handleClick = () => {
        // Limpiar el municipio hará que se abra automáticamente el modal
        clearMunicipio();
    };

    const sizeClass =
        classes[`size${size.charAt(0).toUpperCase() + size.slice(1)}`];
    const styleClass = classes[style];

    if (style === "banner") {
        return (
            <button
                onClick={handleClick}
                className={`${classes.bannerIndicator} ${sizeClass}`}
            >
                <div className={classes.bannerContent}>
                    <span className={classes.icon}>📍</span>
                    <span className={classes.text}>
                        Productos de <strong>{municipio.nombre}</strong>, Málaga
                    </span>
                    <span className={classes.changeHint}>Cambiar</span>
                </div>
            </button>
        );
    }

    // Style chip (default)
    return (
        <button
            onClick={handleClick}
            className={`${classes.chipIndicator} ${sizeClass}`}
            title={`Cambiar de ${municipio.nombre}`}
        >
            <span className={classes.icon}>📍</span>
            <span className={classes.text}>{municipio.nombre}</span>
            <span className={classes.changeIcon}>⚙️</span>
        </button>
    );
}

export default MunicipioIndicator;
