import ApiDatabase from './ApiDatabase';

const TheaterApi = {
    getAll: async () => {
        const res = await ApiDatabase.get('/theater');
        return res.data;
    },

    create: async (theater) => {
        const res = await ApiDatabase.post('/theater', theater);
        return res;
    },

    getById: async (id) => {
        const res = await ApiDatabase.get(`/theater/${id}`);
        return res;
    },

    update: async (id) => {
        const res = await ApiDatabase.put(`/theater/${id}`);
        return res;
    },

    delete: async (id) => {
        const res = await ApiDatabase.delete(`/theater/${id}`);
        return res;
    },
};

export default TheaterApi;
