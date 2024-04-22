import { instance } from "./api";

export const painterAPI = {
    async painters(PageNumber = 1, PageSize = 12) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`painters`, { params: params });
        return res.data;
    },
    async painter(id) {
        const res = await instance.get(`painters/` + id);
        return res.data;
    },
    async createPainter(data) {
        const res = await instance.post(`painters`, {
            description: data.description,
            pseudonym: data.pseudonym,
            profileId:  parseInt(data.profileId),
        });
        return res.data;
    },
    async updatePainter(id, data) {
        const res = await instance.put(`painters/` + id, {
            painterId: parseInt(id),
            description: data.description,
            pseudonym: data.pseudonym,
        });
        return res.data;
    },
    async deletePainter(id) {
        const res = await instance.delete(`painters/` + id, {});
        return res.data;
    },
};
