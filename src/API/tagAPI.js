import { instance } from "./api";

export const tagAPI = {
    async tags(PageNumber = 1, PageSize = 10) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`tags`, { params: params });
        return res.data;
    },
    async allTags() {
        const res = await instance.get(`all-tags`);
        return res.data;
    },
    async tag(id) {
        const res = await instance.get(`tags/` + id);
        return res.data;
    },
    async createTag(data) {
        const res = await instance.post(`tags`, {
            tagName: data.tagName,
        });
        return res.data;
    },
    async updateTag(id, data) {
        const res = await instance.put(`tags/` + id, {
            tagId: parseInt(id),
            tagName: data.tagName,
        });
        return res.data;
    },
    async deleteTag(id) {
        const res = await instance.delete(`tags/` + id, {});
        return res.data;
    },
};
