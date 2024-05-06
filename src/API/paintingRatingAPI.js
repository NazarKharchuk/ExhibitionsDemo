import { instance } from "./api";

export const paintingRatingAPI = {
    async paintingRatings(paintingId, PageNumber = 1, PageSize = 10) {
        const params = { PageNumber: PageNumber, PageSize: PageSize };
        const res = await instance.get(`painting_ratings/painting/${paintingId}`, { params: params });
        return res.data;
    },
    async paintingRating(id) {
        const res = await instance.get(`painting_ratings/` + id);
        return res.data;
    },
    async createPaintingRating(data) {
        const res = await instance.post(`painting_ratings`, {
            ratingValue: parseFloat(data.ratingValue),
            comment: data.comment !== "" ? data.comment : null,
            profileId: parseInt(data.profileId),
            paintingId: parseInt(data.paintingId),
        });
        return res.data;
    },
    async updatePaintingRating(id, data) {
        const res = await instance.put(`painting_ratings/` + id, {
            ratingId: parseInt(id),
            ratingValue: parseFloat(data.ratingValue),
            comment: data.comment !== "" ? data.comment : null,
        });
        return res.data;
    },
    async deletePaintingRating(id) {
        const res = await instance.delete(`painting_ratings/` + id, {});
        return res.data;
    },
    async myPaintingRating(paintingId) {
        const res = await instance.get(`painting_ratings/${paintingId}/my_rating`);
        return res.data;
    },
};
