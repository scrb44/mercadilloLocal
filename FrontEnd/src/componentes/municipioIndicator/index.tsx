// src/components/municipio/MunicipioIndicator.tsx
import { useMunicipio } from "../../contexts/municipioContext";
import classes from "./municipioIndicator.module.css";

interface MunicipioIndicatorProps {
    showChangeButton?: boolean;
    size?: "small" | "medium" | "large";
    style?: "banner" | "chip" | "text";
}

function MunicipioIndicator({
    showChangeButton = false,
    size = "medium",
    style = "chip",
}: MunicipioIndicatorProps) {
    const { municipio } = useMunicipio();

    if (!municipio) return null;

    const handleChangeMunicipio = () => {
        window.location.href = "/seleccionar-municipio";
    };

    const sizeClass = `${classes.indicator}${
        size.charAt(0).toUpperCase() + size.slice(1)
    }`;
    const styleClass = `${classes.indicator}${
        style.charAt(0).toUpperCase() + style.slice(1)
    }`;

    if (style === "text") {
        return (
            <span className={`${classes.textIndicator} ${sizeClass}`}>
                📍 {municipio.nombre}
            </span>
        );
    }

    if (style === "banner") {
        return (
            <div className={`${classes.bannerIndicator} ${sizeClass}`}>
                <div className={classes.bannerContent}>
                    <span className={classes.bannerIcon}>📍</span>
                    <span className={classes.bannerText}>
                        Productos de <strong>{municipio.nombre}</strong>, Málaga
                    </span>
                    {showChangeButton && (
                        <button
                            onClick={handleChangeMunicipio}
                            className={classes.changeButton}
                        >
                            Cambiar
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Style chip (default)
    return (
        <div className={`${classes.chipIndicator} ${sizeClass}`}>
            <span className={classes.chipIcon}>📍</span>
            <span className={classes.chipText}>{municipio.nombre}</span>
            {showChangeButton && (
                <button
                    onClick={handleChangeMunicipio}
                    className={classes.chipChangeButton}
                    title="Cambiar municipio"
                >
                    ⚙️
                </button>
            )}
        </div>
    );
}

export default MunicipioIndicator;
