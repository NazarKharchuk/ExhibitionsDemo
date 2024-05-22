import { instance } from "./api";

export const paintingBuingAPI = {
    async buyPainting(paintingId) {
        const res = await instance.post(`paintings/purchase`, parseInt(paintingId),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        return res.data;
    },
    async processSuccessfulBuying(sessionId) {
        const res = await instance.post(`paintings/purchase/success`, sessionId,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        return res.data;
    }
};
