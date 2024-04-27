import { instance } from "./api";

export const styleAPI = {
    async styles(PageNumber = 1, PageSize = 10) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`styles`, { params: params });
        return res.data;
    },
    async allStyles() {
        const res = await instance.get(`all-styles`);
        return res.data;
    },
    async style(id) {
        const res = await instance.get(`styles/` + id);
        return res.data;
    },
    async createStyle(data) {
        const res = await instance.post(`styles`, {
            styleName: data.styleName,
        });
        return res.data;
    },
    async updateStyle(id, data) {
        const res = await instance.put(`styles/` + id, {
            styleId: parseInt(id),
            styleName: data.styleName,
        });
        return res.data;
    },
    async deleteStyle(id) {
        const res = await instance.delete(`styles/` + id, {});
        return res.data;
    },
};
