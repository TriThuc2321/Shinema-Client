import ApiDatabase from './ApiDatabase';

const ShowTimeApi = {
    getAll: async () => {
        const res = await ApiDatabase.get('/showTime');
        return res.data;
    },

    create: async (showTime) => {
        const res = await ApiDatabase.post('/showTime', showTime);
        return res;
    },

    getById: async (id) => {
        const res = await ApiDatabase.get(`/showTime/${id}`);
        return res;
    },

    getByFilmId: async (id) => {
        const res = await ApiDatabase.get(`/showTime/byFilmId/${id}`);
        return res;
    },

    update: async (showTime) => {
        const res = await ApiDatabase.put('/showTime', showTime);
        return res;
    },

    updateByFilmId: async (showTime) => {
        const res = await ApiDatabase.put('/showTime/byFilmId', showTime);
        return res;
    },

    delete: async (id) => {
        const res = await ApiDatabase.delete(`/showTime/${id}`);
        return res;
    },
};

export default ShowTimeApi;
