import ApiPy from './pyConfig';

const cbApi = {
    getCB: async (id) => {
        const res = await ApiPy.get(`getCB?movieId=${id}`);
        return res;
    },
};

export default cbApi;
