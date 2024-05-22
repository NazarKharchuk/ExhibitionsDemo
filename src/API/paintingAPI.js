import { instance } from "./api";

export const paintingAPI = {
    async paintings(PageNumber = 1, PageSize = 12, filters) {
        const { painterId, tagsIds, genresIds, stylesIds, materialsIds, sortBy, sortOrder } = filters;
        const params = {
            PageNumber: PageNumber,
            PageSize: PageSize,
            PainterId: painterId !== undefined ? painterId : null,
            SortBy: sortBy !== undefined ? sortBy : null,
            SortOrder: sortOrder !== undefined ? sortOrder : null,
        };
        let queryString = '';
        if (tagsIds !== undefined) queryString = tagsIds.map(id => `TagsIds=${id}`).join('&');
        if (genresIds !== undefined) queryString = genresIds.map(id => `GenresIds=${id}`).join('&');
        if (stylesIds !== undefined) queryString = stylesIds.map(id => `StylesIds=${id}`).join('&');
        if (materialsIds !== undefined) queryString = materialsIds.map(id => `MaterialsIds=${id}`).join('&');
        const res = await instance.get(`paintings?${queryString}`, { params: params });
        return res.data;
    },
    async painting(id) {
        const res = await instance.get(`paintings/` + id);
        return res.data;
    },
    async createPainting(data) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('cretionDate', data.cretionDate);
        formData.append('width', data.width);
        formData.append('height', data.height);
        formData.append('location', data.location);
        formData.append('painterId', data.painterId);
        if (data.isSold !== null) formData.append('isSold', data.isSold);
        formData.append('price', data.price);
        formData.append('image', data.image[0]);

        const res = await instance.post(`paintings`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data;
    },
    async updatePainting(id, data) {
        const formData = new FormData();
        formData.append('paintingId', data.paintingId);
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('cretionDate', data.cretionDate);
        formData.append('width', data.width);
        formData.append('height', data.height);
        formData.append('location', data.location);
        if (data.isSold !== null) formData.append('isSold', data.isSold);
        formData.append('price', data.price);
        if (data.length !== 0) formData.append('image', data.image[0]);

        const res = await instance.put(`paintings/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data;
    },
    async deletePainting(id) {
        const res = await instance.delete(`paintings/` + id, {});
        return res.data;
    },
    async addLike(paintingId) {
        const res = await instance.post(`paintings/${paintingId}/likes`, {},
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        return res.data;
    },
    async deleteLike(paintingId) {
        const res = await instance.delete(`paintings/${paintingId}/likes`, {});
        return res.data;
    },
    async addGenre(paintingId, genreId) {
        const res = await instance.post(`paintings/${paintingId}/genres`, parseInt(genreId),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        return res.data;
    },
    async deleteGenre(paintingId, genreId) {
        const res = await instance.delete(`paintings/${paintingId}/genres/${genreId}`, {});
        return res.data;
    },
    async addStyle(paintingId, styleId) {
        const res = await instance.post(`paintings/${paintingId}/styles`, parseInt(styleId),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        return res.data;
    },
    async deleteStyle(paintingId, styleId) {
        const res = await instance.delete(`paintings/${paintingId}/styles/${styleId}`, {});
        return res.data;
    },
    async addMaterial(paintingId, materialId) {
        const res = await instance.post(`paintings/${paintingId}/materials`, parseInt(materialId),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        return res.data;
    },
    async deleteMaterial(paintingId, materialId) {
        const res = await instance.delete(`paintings/${paintingId}/materials/${materialId}`, {});
        return res.data;
    },
    async addTag(paintingId, tagId) {
        const res = await instance.post(`paintings/${paintingId}/tags`, parseInt(tagId),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        return res.data;
    },
    async deleteTag(paintingId, tagId) {
        const res = await instance.delete(`paintings/${paintingId}/tags/${tagId}`, {});
        return res.data;
    },
    async getLikesStatistic(paintingId, statisticSettings) {
        const params = { PeriodStart: statisticSettings.periodStart, PeriodSize: statisticSettings.periodSize };
        const res = await instance.get(`paintings/${paintingId}/likes_statistic`, { params: params });
        return res.data;
    },
    async getRatingsStatistic(paintingId, statisticSettings) {
        const params = { PeriodStart: statisticSettings.periodStart, PeriodSize: statisticSettings.periodSize };
        const res = await instance.get(`paintings/${paintingId}/ratings_statistic`, { params: params });
        return res.data;
    },
};
