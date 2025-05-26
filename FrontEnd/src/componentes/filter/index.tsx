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

    // ============ NOTIFICAR CAMBIOS - SIN onFiltersChange EN DEPENDENCIAS ============
    useEffect(() => {
        const filters: SearchFiltersInterface = {};

        if (debouncedSearchName.trim()) {
            filters.query = debouncedSearchName.trim();
        }

        // ✅ SOLUCIÓN: No poner onFiltersChange en dependencias
        onFiltersChange(filters);
    }, [debouncedSearchName]); // ← SOLO debouncedSearchName

    return (
        <nav className={classes["page-searcher"]}>
            <input
                type="search"
                name="search"
                placeholder="Barra de búsqueda"
                className={classes["page-searcher__search-bar"]}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
            />

            {searchName !== debouncedSearchName && (
                <small style={{ color: "#666", marginLeft: "10px" }}>
                    Buscando...
                </small>
            )}
        </nav>
    );
}

export default Filter;
