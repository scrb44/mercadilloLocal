import { createApiClient } from "./api";
import { cacheVendor, getCachedVendor } from "./cache";
import { MOCK_VENDORS } from "./mockData";
import { type VendedorInterface } from "../types/types";

const apiClient = createApiClient();
const VENDORS_ENDPOINT = "/api/vendedores";

export const vendorsService = {
    async getVendor(
        id: number,
        useCache: boolean = true
    ): Promise<VendedorInterface> {
        if (useCache) {
            const cached = getCachedVendor<VendedorInterface>(id);
            if (cached) return cached;
        }

        try {
            const vendor = await apiClient.get<VendedorInterface>(
                `${VENDORS_ENDPOINT}/${id}`
            );
            cacheVendor(id, vendor);
            return vendor;
        } catch (error) {
            console.warn(
                "🔧 API no disponible para vendedor, usando datos de ejemplo"
            );
            const mockVendor = MOCK_VENDORS.find((v) => v.id === id);
            if (mockVendor) return mockVendor;
            throw new Error(`Vendedor con ID ${id} no encontrado`);
        }
    },

    async getVendors(useCache: boolean = true): Promise<VendedorInterface[]> {
        try {
            const vendors = await apiClient.get<VendedorInterface[]>(
                VENDORS_ENDPOINT
            );
            return vendors;
        } catch (error) {
            console.warn(
                "🔧 API no disponible para vendedores, usando datos de ejemplo"
            );
            return MOCK_VENDORS;
        }
    },
};
