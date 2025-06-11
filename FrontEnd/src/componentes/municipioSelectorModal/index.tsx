// src/components/municipioSelector/MunicipioSelectorModal.tsx - CONVERTIDO A MODAL
import { useState, useEffect } from "react";
import {
    useMunicipio,
    type MunicipioInterface,
} from "../../contexts/municipioContext";
import classes from "./municipioSelectorModal.module.css";

interface MunicipioSelectorModalProps {
    onClose?: () => void;
}

function MunicipioSelectorModal({ onClose }: MunicipioSelectorModalProps) {
    const {
        municipios,
        setMunicipio,
        loading,
        error,
        refetchMunicipios,
        hasMunicipio,
    } = useMunicipio();

    const [selectedMunicipio, setSelectedMunicipio] =
        useState<MunicipioInterface | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Efecto para agregar blur al body cuando el modal está abierto
    useEffect(() => {
        if (!hasMunicipio) {
            // Crear un div que cubra todo excepto el modal
            const blurOverlay = document.createElement("div");
            blurOverlay.id = "blur-overlay";
            blurOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 9998;
                pointer-events: none;
            `;

            document.body.appendChild(blurOverlay);
            document.body.style.overflow = "hidden";

            return () => {
                const overlay = document.getElementById("blur-overlay");
                if (overlay) {
                    document.body.removeChild(overlay);
                }
                document.body.style.overflow = "";
            };
        }
    }, [hasMunicipio]);

    // No renderizar si ya hay municipio seleccionado
    if (hasMunicipio) return null;

    // Filtrar municipios por búsqueda
    const filteredMunicipios = municipios.filter((municipio) =>
        municipio.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleMunicipioClick = (municipio: MunicipioInterface) => {
        setSelectedMunicipio(municipio);
    };

    const handleConfirm = () => {
        if (selectedMunicipio) {
            setMunicipio(selectedMunicipio);
            onClose?.();
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleRetry = async () => {
        try {
            await refetchMunicipios();
        } catch (err) {
            console.error("Error al reintentar cargar municipios:", err);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        // Cerrar solo si se hace clic en el overlay, no en el modal
        if (e.target === e.currentTarget) {
            onClose?.();
        }
    };

    // Estado de carga
    if (loading) {
        return (
            <div
                className={classes.overlay}
                onClick={handleOverlayClick}
                data-modal="true"
            >
                <div className={classes.municipioSelector}>
                    <div className={classes.container}>
                        <main className={classes.main}>
                            <div className={classes.selectorCard}>
                                <div className={classes.header}>
                                    <h1 className={classes.title}>
                                        ¡Bienvenido a Mercadillo Local!
                                    </h1>
                                    <p className={classes.subtitle}>
                                        Cargando municipios disponibles...
                                    </p>
                                    <div className={classes.iconContainer}>
                                        <span className={classes.icon}>⏳</span>
                                    </div>
                                </div>

                                <div className={classes.municipiosSection}>
                                    <div className={classes.noResults}>
                                        <span className={classes.noResultsIcon}>
                                            🔄
                                        </span>
                                        <p className={classes.noResultsText}>
                                            Cargando municipios desde el
                                            servidor...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div
                className={classes.overlay}
                onClick={handleOverlayClick}
                data-modal="true"
            >
                <div className={classes.municipioSelector}>
                    <div className={classes.container}>
                        <main className={classes.main}>
                            <div className={classes.selectorCard}>
                                <div className={classes.header}>
                                    <h1 className={classes.title}>
                                        ¡Bienvenido a Mercadillo Local!
                                    </h1>
                                    <p className={classes.subtitle}>
                                        Hubo un problema cargando los municipios
                                    </p>
                                    <div className={classes.iconContainer}>
                                        <span className={classes.icon}>❌</span>
                                    </div>
                                </div>

                                <div className={classes.municipiosSection}>
                                    <div className={classes.noResults}>
                                        <span className={classes.noResultsIcon}>
                                            ⚠️
                                        </span>
                                        <p className={classes.noResultsText}>
                                            {error}
                                        </p>
                                        <button
                                            onClick={handleRetry}
                                            className={
                                                classes.clearSearchButton
                                            }
                                        >
                                            Reintentar
                                        </button>
                                    </div>
                                </div>

                                {onClose && (
                                    <div className={classes.confirmSection}>
                                        <button
                                            onClick={onClose}
                                            className={classes.cancelButton}
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    // Render normal
    return (
        <div
            className={classes.overlay}
            onClick={handleOverlayClick}
            data-modal="true"
        >
            <div className={classes.municipioSelector}>
                <div className={classes.container}>
                    <main className={classes.main}>
                        <div className={classes.selectorCard}>
                            {/* Header */}
                            <div className={classes.header}>
                                <h1 className={classes.title}>
                                    ¡Bienvenido a Mercadillo Local!
                                </h1>
                                <p className={classes.subtitle}>
                                    Selecciona tu municipio de Málaga para ver
                                    productos y tiendas cerca de ti
                                </p>
                                <div className={classes.iconContainer}>
                                    <span className={classes.icon}>📍</span>
                                </div>
                            </div>

                            {/* Buscador */}
                            <div className={classes.searchSection}>
                                <label
                                    htmlFor="search"
                                    className={classes.searchLabel}
                                >
                                    Buscar municipio:
                                </label>
                                <input
                                    type="search"
                                    id="search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Escribe el nombre de tu municipio..."
                                    className={classes.searchInput}
                                />
                            </div>

                            {/* Lista de municipios */}
                            <div className={classes.municipiosSection}>
                                <h3 className={classes.municipiosTitle}>
                                    Municipios disponibles (
                                    {filteredMunicipios.length})
                                </h3>

                                {/* Mostrar municipios o mensaje de sin resultados */}
                                {filteredMunicipios.length > 0 ? (
                                    <div className={classes.municipiosList}>
                                        {filteredMunicipios.map((municipio) => (
                                            <button
                                                key={municipio.id}
                                                onClick={() =>
                                                    handleMunicipioClick(
                                                        municipio
                                                    )
                                                }
                                                className={`${
                                                    classes.municipioCard
                                                } ${
                                                    selectedMunicipio?.id ===
                                                    municipio.id
                                                        ? classes.municipioSelected
                                                        : ""
                                                }`}
                                            >
                                                <span
                                                    className={
                                                        classes.municipioIcon
                                                    }
                                                >
                                                    🏘️
                                                </span>
                                                <div
                                                    className={
                                                        classes.municipioInfo
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            classes.municipioName
                                                        }
                                                    >
                                                        {municipio.nombre}
                                                    </span>
                                                    <span
                                                        className={
                                                            classes.municipioProvincia
                                                        }
                                                    >
                                                        {municipio.provincia}
                                                    </span>
                                                </div>
                                                {selectedMunicipio?.id ===
                                                    municipio.id && (
                                                    <span
                                                        className={
                                                            classes.selectedIcon
                                                        }
                                                    >
                                                        ✓
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : municipios.length === 0 ? (
                                    // No hay municipios cargados
                                    <div className={classes.noResults}>
                                        <span className={classes.noResultsIcon}>
                                            📭
                                        </span>
                                        <p className={classes.noResultsText}>
                                            No se encontraron municipios
                                            disponibles
                                        </p>
                                        <button
                                            onClick={handleRetry}
                                            className={
                                                classes.clearSearchButton
                                            }
                                        >
                                            Recargar
                                        </button>
                                    </div>
                                ) : (
                                    // No hay resultados de búsqueda
                                    <div className={classes.noResults}>
                                        <span className={classes.noResultsIcon}>
                                            🔍
                                        </span>
                                        <p className={classes.noResultsText}>
                                            No se encontraron municipios que
                                            coincidan con "{searchQuery}"
                                        </p>
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className={
                                                classes.clearSearchButton
                                            }
                                        >
                                            Limpiar búsqueda
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Botón de confirmación */}
                            <div className={classes.confirmSection}>
                                {onClose && (
                                    <button
                                        onClick={onClose}
                                        className={classes.cancelButton}
                                    >
                                        Cancelar
                                    </button>
                                )}
                                <button
                                    onClick={handleConfirm}
                                    disabled={!selectedMunicipio}
                                    className={classes.confirmButton}
                                >
                                    {selectedMunicipio
                                        ? `Continuar con ${selectedMunicipio.nombre}`
                                        : "Selecciona un municipio"}
                                </button>
                            </div>

                            {/* Info adicional */}
                            <div className={classes.infoSection}>
                                <p className={classes.infoText}>
                                    💡{" "}
                                    <strong>
                                        ¿Por qué necesitamos tu municipio?
                                    </strong>
                                    <br />
                                    Para mostrarte solo productos y tiendas de
                                    tu zona, haciendo tus compras más rápidas y
                                    cercanas.
                                </p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default MunicipioSelectorModal;
