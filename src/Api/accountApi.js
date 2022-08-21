import ApiAuthen from './ApiAuthen';
import ApiDatabase from './ApiDatabase';

const AccountApi = {
    login: async (email, password) => {
        const res = await ApiAuthen.post('/login', {
            email,
            password,
        });

        if (res.data === 'Password incorrect' || res.data === 'Email not exist') {
            return res;
        }

        try {
            localStorage.setItem('accessToken', res.data.accessToken);
        } catch (e) {
            console.log('AsyncStorage Error');
        }
        try {
            localStorage.setItem('refreshToken', res.data.refreshToken);
        } catch (e) {
            console.log('AsyncStorage Error');
        }

        const account = await ApiDatabase.get(`/account/${email}`);
        return account;
    },
    getAll: async () => {
        const res = await ApiDatabase.get('/account');
        return res.data;
    },
    checkEmail: async (email) => {
        const res = await ApiDatabase.post(`/account/checkEmail/${email}`);
        return res.data;
    },
    create: async (account) => {
        const res = await ApiDatabase.post('/account/', account);
        return res;
    },
    getByEmail: async (email) => {
        const res = await ApiDatabase.get(`/account/${email}`);
        return res;
    },
    getById: async (_userId) => {
        const res = await ApiDatabase.get(`/account/getById/${_userId}`);
        return res;
    },
    update: async (account) => {
        const res = await ApiDatabase.put('/account', account);
        return res;
    },
    updatePassword: async (account) => {
        const res = await ApiDatabase.put('/account/password', account);
        return res;
    },

    getAllStaff: async () => {
        const res = ApiDatabase.get('/account/staff/all').catch((err) => err.response);
        return res;
    },

    deleteByEmail: async (email) => {
        const res = ApiDatabase.delete(`/account/${email}`).catch((err) => err.response);
        return res;
    },
};

export default AccountApi;
