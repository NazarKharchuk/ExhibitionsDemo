import { instance } from "./api";

export const exhibitionApplicationAPI = {
    async createExhibitionApplication(exhibitionId, paintingId) {
        const res = await instance.post(`exhibitions_applications/`, {
            exhibitionId: exhibitionId,
            paintingId: paintingId
        });
        return res.data;
    },
    async deleteExhibitionApplication(id) {
        const res = await instance.delete(`exhibitions_applications/` + id, {});
        return res.data;
    },
    async confirmExhibitionApplication(applicationId) {
        const res = await instance.put(`exhibitions_applications/${applicationId}/confirm`, {});
        return res.data;
    },
};
