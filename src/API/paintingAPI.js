import { instance } from "./api";

export const paintingAPI = {
    async paintings(PageNumber = 1, PageSize = 12, painterId) {
        const params = { PageNumber: PageNumber, PageSize: PageSize, painterId: painterId !== undefined ? painterId : null };
        const res = await instance.get(`paintings`, { params: params });
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
    async addLike(paintingId, profileId) {
        const res = await instance.post(`paintings/${paintingId}/likes`, parseInt(profileId),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        return res.data;
    },
    async deleteLike(paintingId, profileId) {
        const res = await instance.delete(`paintings/${paintingId}/likes/${profileId}`, {});
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
};
