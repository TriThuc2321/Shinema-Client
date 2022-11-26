/* eslint-disable*/
import ApiDatabase from './ApiDatabase';

const url = 'trends';
const googleTrendsApi = {
    getDailyTrends: async () => {
        const res = await ApiDatabase.get(url + '/daily-trends');
        return res;
    },
};

export default googleTrendsApi;
