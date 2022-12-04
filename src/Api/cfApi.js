import ApiPy from './pyConfig';

const cfApi = {
    update: async (data) => {
        const res = await ApiPy.post(`/addDataCF?user=${data._user}&item=${data._item}&rating=${data._rating}`);
        return res.data;
    },

    getByUserId: async (id) => {
        const res = await ApiPy.get(`getCF?user=${id}`);
        return res.data;
    },
};

export default cfApi;
