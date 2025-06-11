// src/componentes/filter/index.tsx - VERSIÓN SUPER SIMPLE QUE FUNCIONA
import { useState, useEffect } from "react";
import { type SearchFiltersInterface } from "../../types/types";
import { useMunicipio } from "../../contexts/municipioContext";
import classes from "./filter.module.css";

interface FilterProps {
    onFiltersChange: (filters: SearchFiltersInterface) => void;
}

function Filter({ onFiltersChange }: FilterProps) {
    // ============ CONTEXTO DE MUNICIPIO ============
    const { municipio } = useMunicipio();

    // ============ ESTADOS PRINCIPALES ============
    const [searchName, setSearchName] = useState("");
    const [debouncedSearchName, setDebouncedSearchName] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // ============ ESTADOS DE FILTROS ADICIONALES ============
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [vendorName, setVendorName] = useState("");

    // ============ DEBOUNCE PARA BÚSQUEDA PRINCIPAL ============
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchName(searchName);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchName]);

    // ============ ENVÍO DIRECTO DE FILTROS - COMBINANDO TODO CORRECTAMENTE ============
    useEffect(() => {
        const filters: SearchFiltersInterface = {};

        // 🔧 IMPORTANTE: Siempre incluir la búsqueda principal si existe
        if (debouncedSearchName.trim()) {
            filters.query = debouncedSearchName.trim();
        }

        // Filtros de precio
        const minPrice = parseFloat(priceMin);
        const maxPrice = parseFloat(priceMax);

        if (!isNaN(minPrice) && minPrice > 0) {
            filters.minPrice = minPrice;
        }
        if (!isNaN(maxPrice) && maxPrice > 0) {
            filters.maxPrice = maxPrice;
        }

        // Filtro de vendedor por nombre
        if (vendorName.trim()) {
            filters.vendorName = vendorName.trim();
        }

        // Filtro por localidad desde contexto
        if (municipio?.id) {
            filters.localidad = municipio.id;
        }

        onFiltersChange(filters);
    }, [
        debouncedSearchName,
        priceMin,
        priceMax,
        vendorName,
        municipio?.id,
        onFiltersChange,
    ]);

    // ============ MANEJADORES SIMPLES ============
    const handleToggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleClearFilters = () => {
        setPriceMin("");
        setPriceMax("");
        setVendorName("");
        setSearchName(""); // 🔧 NUEVO: Limpiar también la búsqueda principal
        setDebouncedSearchName(""); // 🔧 NUEVO: Limpiar también el debounced
    };

    const handleApplyFilters = () => {
        // Simplemente forzar un re-render cambiando algo que triggere el useEffect
        setDebouncedSearchName(searchName); // Esto forzará el useEffect
    };

    // ============ VERIFICAR SI HAY FILTROS ACTIVOS (INCLUYENDO BÚSQUEDA) ============
    const hasActiveFilters = Boolean(
        searchName.trim() || // 🔧 NUEVO: Incluir búsqueda principal
            debouncedSearchName.trim() || // 🔧 NUEVO: Incluir búsqueda con debounce
            priceMin ||
            priceMax ||
            vendorName
    );

    return (
        <div className={classes["filter-container"]}>
            {/* ============ SECCIÓN DE BÚSQUEDA PRINCIPAL ============ */}
            <div className={classes["search-section"]}>
                <input
                    type="search"
                    name="search"
                    placeholder="¿Qué estás buscando?"
                    className={classes["search-input"]}
                    value={searchName}
                    onChange={(e) => {
                        setSearchName(e.target.value);
                    }}
                />

                <button
                    type="button"
                    className={`${classes["filters-toggle"]} ${
                        showFilters ? classes.active : ""
                    }`}
                    onClick={handleToggleFilters}
                >
                    <span>Filtros</span>
                    <span
                        className={`${classes["filter-icon"]} ${
                            showFilters ? classes.rotated : ""
                        }`}
                    >
                        ▲
                    </span>
                    {hasActiveFilters && (
                        <span className={classes["active-indicator"]}>●</span>
                    )}
                </button>

                {searchName !== debouncedSearchName && (
                    <div
                        className={`${classes["search-indicator"]} ${classes["search-loading"]}`}
                    >
                        🔍 Buscando...
                    </div>
                )}
            </div>

            {/* ============ PANEL DE FILTROS ADICIONALES ============ */}
            <div
                className={`${classes["filters-panel"]} ${
                    showFilters ? classes.open : ""
                }`}
            >
                <div className={classes["filters-content"]}>
                    <div className={classes["filters-grid"]}>
                        <div className={classes["filter-group"]}>
                            <label className={classes["filter-label"]}>
                                Rango de precio
                            </label>
                            <div className={classes["price-range-group"]}>
                                <input
                                    type="number"
                                    placeholder="Mín €"
                                    className={classes["price-input"]}
                                    value={priceMin}
                                    onChange={(e) => {
                                        setPriceMin(e.target.value);
                                    }}
                                    min="0"
                                    step="0.01"
                                />
                                <span className={classes["price-separator"]}>
                                    -
                                </span>
                                <input
                                    type="number"
                                    placeholder="Máx €"
                                    className={classes["price-input"]}
                                    value={priceMax}
                                    onChange={(e) => {
                                        setPriceMax(e.target.value);
                                    }}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className={classes["filter-group"]}>
                            <label className={classes["filter-label"]}>
                                Nombre del vendedor
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Tasca Malagueña"
                                className={classes["filter-input"]}
                                value={vendorName}
                                onChange={(e) => {
                                    setVendorName(e.target.value);
                                }}
                            />
                        </div>
                    </div>

                    <div className={classes["filter-actions"]}>
                        <button
                            type="button"
                            className={`${classes["filter-button"]} ${classes.clear}`}
                            onClick={handleClearFilters}
                            disabled={!hasActiveFilters}
                        >
                            Limpiar filtros
                        </button>
                        <button
                            type="button"
                            className={`${classes["filter-button"]} ${classes.apply}`}
                            onClick={handleApplyFilters}
                        >
                            Aplicar filtros
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Filter;
