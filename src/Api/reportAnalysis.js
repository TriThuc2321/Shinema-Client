import ApiDatabase from './ApiDatabase';

const ReportAnalysisApi = {
    getAll: async () => {
        const res = await ApiDatabase.get('/reportAnalysis');
        return res;
    },

    getOrderByDate: async (page) => {
        let url = '/reportAnalysis/orderByDate';
        if (page) {
            url += `?page=${page}`;
        }

        const res = await ApiDatabase.get(url);
        return res;
    },

    getOrderByCount: async (page) => {
        let url = '/reportAnalysis/orderByCount';
        if (page) {
            url += `?page=${page}`;
        }

        const res = await ApiDatabase.get(url);
        return res;
    },

    getById: async (id) => {
        const res = await ApiDatabase.get(`/reportAnalysis/${id}`);
        return res;
    },

    report: (reportAnalysis) => {
        ApiDatabase.post('/reportAnalysis', reportAnalysis);
    },

    delete: async (id) => {
        const res = await ApiDatabase.delete(`/reportAnalysis/${id}`);
        return res;
    },
};

export default ReportAnalysisApi;
