import { instance } from "./api";

export const profileAPI = {
    async profiles(PageNumber = 1, PageSize = 10) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`profiles`, { params: params });
        return res.data;
    },
    async profile(id) {
        const res = await instance.get(`profiles/` + id);
        return res.data;
    },
    async updateProfile(id, data) {
        const res = await instance.put(`profiles/` + id, {
            profileId: parseInt(id),
            firstName: data.firstName,
            lastName: data.lastName,
        });
        return res.data;
    },
    async deleteProfile(id) {
        const res = await instance.delete(`profiles/` + id, {});
        return res.data;
    },
    async addAdminRole(id) {
        const res = await instance.post(`profiles/${id}/admin`, {});
        return res.data;
    },
    async deleteAdminRole(id) {
        const res = await instance.delete(`profiles/${id}/admin`, {});
        return res.data;
    },
};
