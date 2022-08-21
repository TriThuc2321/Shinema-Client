import ApiDatabase from './ApiDatabase';

const cloudinaryApi = {
    upload: async (data) => {
        const res = await ApiDatabase.post('/cloudinary', data);
        return res;
    },
};
export default cloudinaryApi;
