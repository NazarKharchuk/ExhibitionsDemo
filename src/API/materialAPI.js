import { instance } from "./api";

export const materialAPI = {
    async materials(PageNumber = 1, PageSize = 10) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`materials`, { params: params });
        return res.data;
    },
    async allMaterials() {
        const res = await instance.get(`all-materials`);
        return res.data;
    },
    async material(id) {
        const res = await instance.get(`materials/` + id);
        return res.data;
    },
    async createMaterial(data) {
        const res = await instance.post(`materials`, {
            materialName: data.materialName,
        });
        return res.data;
    },
    async updateMaterial(id, data) {
        const res = await instance.put(`materials/` + id, {
            materialId: parseInt(id),
            materialName: data.materialName,
        });
        return res.data;
    },
    async deleteMaterial(id) {
        const res = await instance.delete(`materials/` + id, {});
        return res.data;
    },
};
