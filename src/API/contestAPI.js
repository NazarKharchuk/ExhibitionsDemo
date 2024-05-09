import { instance } from "./api";

export const contestAPI = {
    async contests(PageNumber = 1, PageSize = 12, filters) {
        const { paintingId, tagsIds, needConfirmation, status, sortBy, sortOrder } = filters;
        const params = {
            PageNumber: PageNumber,
            PageSize: PageSize,
            PaintingId: paintingId !== undefined ? paintingId : null,
            NeedConfirmation: needConfirmation !== undefined ? needConfirmation : null,
            Status: status !== undefined ? status : null,
            SortBy: sortBy !== undefined ? sortBy : null,
            SortOrder: sortOrder !== undefined ? sortOrder : null,
        };
        let queryString = '';
        if (tagsIds !== undefined) queryString = tagsIds.map(id => `TagsIds=${id}`).join('&');
        const res = await instance.get(`contests?${queryString}`, { params: params });
        return res.data;
    },
    async contest(id) {
        const res = await instance.get(`contests/` + id);
        return res.data;
    },
    async createContest(data) {
        const res = await instance.post(`contests`, {
            name: data.name,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            needConfirmation: data.needConfirmation,
            painterLimit: data.painterLimit !== "" ? parseInt(data.painterLimit) : null,
            winnersCount: parseInt(data.winnersCount),
            votesLimit: data.vodesLimit !== "" ? parseInt(data.votesLimit) : null,
        });
        return res.data;
    },
    async updateContest(id, data) {
        const res = await instance.put(`contests/` + id, {
            contestId: parseInt(id),
            name: data.name,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            needConfirmation: data.needConfirmation,
            painterLimit: data.painterLimit !== "" ? parseInt(data.painterLimit) : null,
            winnersCount: parseInt(data.winnersCount),
            votesLimit: data.vodesLimit !== "" ? parseInt(data.votesLimit) : null,
        });
        return res.data;
    },
    async deleteContest(id) {
        const res = await instance.delete(`contests/` + id, {});
        return res.data;
    },
    async addTag(contestId, tagId) {
        const res = await instance.post(`contests/${contestId}/tags`, parseInt(tagId),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        return res.data;
    },
    async deleteTag(contestId, tagId) {
        const res = await instance.delete(`contests/${contestId}/tags/${tagId}`, {});
        return res.data;
    },
    async contestApplications(contestId, PageNumber = 1, PageSize = 12) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`contests/${contestId}/paintings`, { params: params });
        return res.data;
    },
    async contestVotes(contestId, PageNumber = 1, PageSize = 12) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`contests/${contestId}/votes`, { params: params });
        return res.data;
    },
    async contestSubmissions(contestId, PageNumber = 1, PageSize = 12) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`contests/${contestId}/submissions`, { params: params });
        return res.data;
    },
    async contestNotConfirmeds(contestId, PageNumber = 1, PageSize = 12) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`contests/${contestId}/not-confirmed-paintings`, { params: params });
        return res.data;
    },
};
