import { instance } from "./api";

export const exhibitionAPI = {
    async exhibitions(PageNumber = 1, PageSize = 12, filters) {
        const { paintingId, tagsIds, needConfirmation, sortBy, sortOrder } = filters;
        const params = {
            PageNumber: PageNumber,
            PageSize: PageSize,
            PaintingId: paintingId !== undefined ? paintingId : null,
            NeedConfirmation: needConfirmation !== undefined ? needConfirmation : null,
            SortBy: sortBy !== undefined ? sortBy : null,
            SortOrder: sortOrder !== undefined ? sortOrder : null,
        };
        let queryString = '';
        if (tagsIds !== undefined) queryString = tagsIds.map(id => `TagsIds=${id}`).join('&');
        const res = await instance.get(`exhibitions?${queryString}`, { params: params });
        return res.data;
    },
    async exhibition(id) {
        const res = await instance.get(`exhibitions/` + id);
        return res.data;
    },
    async createExhibition(data) {
        const res = await instance.post(`exhibitions`, {
            name: data.name,
            description: data.description,
            needConfirmation: data.needConfirmation,
            painterLimit: data.painterLimit !== "" ? parseInt(data.painterLimit) : null,
        });
        return res.data;
    },
    async updateExhibition(id, data) {
        const res = await instance.put(`exhibitions/` + id, {
            exhibitionId: parseInt(id),
            name: data.name,
            description: data.description,
            needConfirmation: data.needConfirmation,
            painterLimit: data.painterLimit !== "" ? parseInt(data.painterLimit) : null,
        });
        return res.data;
    },
    async deleteExhibition(id) {
        const res = await instance.delete(`exhibitions/` + id, {});
        return res.data;
    },
    async addTag(exhibitionId, tagId) {
        const res = await instance.post(`exhibitions/${exhibitionId}/tags`, parseInt(tagId),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        return res.data;
    },
    async deleteTag(exhibitionId, tagId) {
        const res = await instance.delete(`exhibitions/${exhibitionId}/tags/${tagId}`, {});
        return res.data;
    },
    async exhibitionApplications(exhibitionId, PageNumber = 1, PageSize = 12) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`exhibitions/${exhibitionId}/paintings`, { params: params });
        return res.data;
    },
    async exhibitionSubmissions(exhibitionId, PageNumber = 1, PageSize = 12) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`exhibitions/${exhibitionId}/submissions`, { params: params });
        return res.data;
    },
    async exhibitionNotConfirmeds(exhibitionId, PageNumber = 1, PageSize = 12) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`exhibitions/${exhibitionId}/not-confirmed-paintings`, { params: params });
        return res.data;
    },
};
