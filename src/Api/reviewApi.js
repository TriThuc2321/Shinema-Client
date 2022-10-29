import ApiDatabase from './ApiDatabase';

const ReviewApi = {
    getAll: async () => {
        const res = await ApiDatabase.get('/review');
        return res;
    },

    create: async (review) => {
        const res = await ApiDatabase.post('/review', review);
        return res;
    },

    getById: async (id) => {
        const res = await ApiDatabase.get(`/review/${id}`);
        return res;
    },

    update: async (review) => {
        const res = await ApiDatabase.put('/review', review);
        return res;
    },

    insertCmt: async (cmt) => {
        const res = await ApiDatabase.put('/review/insertCmt', cmt);
        return res;
    },

    deleteCmt: async (id, cmtId) => {
        const obj = {
            _id: id,
            cmtId,
        };
        const res = await ApiDatabase.put('/review/deleteCmt', obj);
        return res;
    },

    delete: async (id) => {
        const res = await ApiDatabase.delete(`/review/${id}`);
        return res;
    },
};

export default ReviewApi;
