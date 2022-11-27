/* eslint-disable*/
import ApiDatabase from './ApiDatabase';

const url = 'trends';
const googleTrendsApi = {
    getDailyTrends: async (geo) => {
        const res = await ApiDatabase.get(url + '/daily-trends/' + geo);
        return res;
    },
};

export default googleTrendsApi;
