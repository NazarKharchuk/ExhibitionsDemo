import { instance } from "./api";

export const genreAPI = {
    async genres(PageNumber = 1, PageSize = 10) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`genres`, { params: params });
        return res.data;
    },
    async allGenres() {
        const res = await instance.get(`all-genres`);
        return res.data;
    },
    async genre(id) {
        const res = await instance.get(`genres/` + id);
        return res.data;
    },
    async createGenre(data) {
        const res = await instance.post(`genres`, {
            genreName: data.genreName,
        });
        return res.data;
    },
    async updateGenre(id, data) {
        const res = await instance.put(`genres/` + id, {
            genreId: parseInt(id),
            genreName: data.genreName,
        });
        return res.data;
    },
    async deleteGenre(id) {
        const res = await instance.delete(`genres/` + id, {});
        return res.data;
    },
};
