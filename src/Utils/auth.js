import { decode, encode } from 'base-64';
import jwt from 'jwt-decode';

import AccountApi from '~/Api/accountApi';

export const checkLogged = async () => {
    const logged = localStorage.getItem('logged');
    const remember = localStorage.getItem('rememberAccount');

    if (remember === 'true' && logged === 'true') {
        const email = decode(localStorage.getItem(encode('rememberEmail')));
        const password = decode(localStorage.getItem(encode('rememberPassword')));

        try {
            const res = await AccountApi.login(email, password);
            if (res.data !== 'Email not exist' && res.data !== 'Password incorrect') {
                return AccountApi.getByEmail(email);
                // return resUser.data;
            }
            localStorage.setItem('logged', false);
            localStorage.setItem('accessToken', '');
            localStorage.setItem('refreshToken', '');
            return null;
        } catch (err) {
            localStorage.setItem('logged', false);
            localStorage.setItem('accessToken', '');
            localStorage.setItem('refreshToken', '');
            return null;
        }
    }
    return null;
};

export function getRole() {
    const token = localStorage.getItem('accessToken');
    if (!token) return 'Customer';

    const data = jwt(token);

    return data ? data.rank : 'Customer';
}
