// src/componentes/filter/index.tsx - ACTUALIZADO PARA BANDA VERDE
import { useState, useEffect, useCallback } from "react";
import { type SearchFiltersInterface } from "../../types/types";
import classes from "./filter.module.css";

interface FilterProps {
    onFiltersChange: (filters: SearchFiltersInterface) => void;
}

function Filter({ onFiltersChange }: FilterProps) {
    const [searchName, setSearchName] = useState("");
    const [debouncedSearchName, setDebouncedSearchName] = useState("");

    // ============ DEBOUNCE ============
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchName(searchName);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchName]);

    // ============ NOTIFICAR CAMBIOS ============
    useEffect(() => {
        const filters: SearchFiltersInterface = {};

        if (debouncedSearchName.trim()) {
            filters.query = debouncedSearchName.trim();
        }

        onFiltersChange(filters);
    }, [debouncedSearchName, onFiltersChange]);

    return (
        <nav className={classes["page-searcher"]}>
            <div className={classes["page-searcher__container"]}>
                <input
                    type="search"
                    name="search"
                    placeholder="¿Qué estás buscando?"
                    className={classes["page-searcher__search-bar"]}
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />

                {searchName !== debouncedSearchName && (
                    <div
                        className={`${classes["search-indicator"]} ${classes["search-loading"]}`}
                    >
                        🔍 Buscando...
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Filter;
