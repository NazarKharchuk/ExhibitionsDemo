import { instance } from "./api";

export const painterAPI = {
    async painters(PageNumber = 1, PageSize = 12, filters) {
        const { sortBy, sortOrder } = filters;
        const params = {
            PageNumber: PageNumber,
            PageSize: PageSize,
            SortBy: sortBy !== undefined ? sortBy : null,
            SortOrder: sortOrder !== undefined ? sortOrder : null,
        };
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
            profileId: parseInt(data.profileId),
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
    async getLikesStatistic(painterId, statisticSettings) {
        const params = { PeriodStart: statisticSettings.periodStart, PeriodSize: statisticSettings.periodSize };
        const res = await instance.get(`painters/${painterId}/likes_statistic`, { params: params });
        return res.data;
    },
    async getRatingsStatistic(painterId, statisticSettings) {
        const params = { PeriodStart: statisticSettings.periodStart, PeriodSize: statisticSettings.periodSize };
        const res = await instance.get(`painters/${painterId}/ratings_statistic`, { params: params });
        return res.data;
    },
};
