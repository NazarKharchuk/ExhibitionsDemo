import { instance } from "./api";

export const contestApplicationAPI = {
    async createContestApplication(contestId, paintingId) {
        const res = await instance.post(`contests_applications/`, {
            contestId: contestId,
            paintingId: paintingId
        });
        return res.data;
    },
    async deleteContestApplication(id) {
        const res = await instance.delete(`contests_applications/` + id, {});
        return res.data;
    },
    async confirmContestApplication(applicationId) {
        const res = await instance.put(`contests_applications/${applicationId}/confirm`, {});
        return res.data;
    },
    async addVote(applicationId) {
        const res = await instance.post(`contests_applications/${applicationId}/votes`, {});
        return res.data;
    },
    async deleteVote(applicationId) {
        const res = await instance.delete(`contests_applications/${applicationId}/votes`, {});
        return res.data;
    },
};
