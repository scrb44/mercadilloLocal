// src/services/localidadesService.ts - Servicio para gestión de localidades

import { ENDPOINTS } from "../constants";
import { type MunicipioInterface } from "../contexts/municipioContext";
import { type ApiLocalidad } from "../types/apiTypes";

const API_BASE_URL = "http://localhost:8080";

/**
 * Adaptador para convertir ApiLocalidad a MunicipioInterface
 */
function adaptApiLocalidad(apiLocalidad: ApiLocalidad): MunicipioInterface {
    return {
        id: apiLocalidad.id,
        nombre: apiLocalidad.nombre,
        provincia: apiLocalidad.provincia || "Sin especificar",
    };
}

/**
 * Obtiene todas las localidades desde la API
 */
export async function getAllLocalidades(): Promise<MunicipioInterface[]> {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.LOCALIDADES}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const apiLocalidades: ApiLocalidad[] = await response.json();

        // Adaptar cada localidad al formato del frontend
        return apiLocalidades.map(adaptApiLocalidad);
    } catch (error: any) {
        console.error("❌ Error obteniendo localidades:", error);
        throw new Error(
            "Error al cargar las localidades. Verifica tu conexión."
        );
    }
}

/**
 * Obtiene solo las localidades que tienen vendedores activos
 */
export async function getLocalidadesConVendedores(): Promise<
    MunicipioInterface[]
> {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.LOCALIDADES}/con-vendedores`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const apiLocalidades: ApiLocalidad[] = await response.json();

        // Adaptar cada localidad al formato del frontend
        return apiLocalidades.map(adaptApiLocalidad);
    } catch (error: any) {
        console.error("❌ Error obteniendo localidades con vendedores:", error);
        throw new Error(
            "Error al cargar las localidades. Verifica tu conexión."
        );
    }
}

/**
 * Obtiene una localidad específica por ID
 */
export async function getLocalidadById(
    id: number
): Promise<MunicipioInterface | null> {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.LOCALIDADES}/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                return null; // Localidad no encontrada
            }
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const apiLocalidad: ApiLocalidad = await response.json();

        return adaptApiLocalidad(apiLocalidad);
    } catch (error: any) {
        console.error("❌ Error obteniendo localidad por ID:", error);
        throw new Error("Error al cargar la localidad. Verifica tu conexión.");
    }
}
