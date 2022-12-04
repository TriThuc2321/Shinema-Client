import axios from 'axios';
import { getUrlPy } from '~/Configs/url';
import ApiAuthen from './ApiAuthen';

const ApiPy = axios.create({
    baseURL: getUrlPy(),
    headers: {
        'Content-Type': 'application/json',
    },
});

ApiPy.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // eslint-disable-next-line no-param-reassign
            config.headers['x-access-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error),
);
// response parse
ApiPy.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response) {
            const originalConfig = err.config;
            // eslint-disable-next-line no-underscore-dangle
            if (err.response.status === 401 && !originalConfig._retry) {
                // eslint-disable-next-line no-underscore-dangle
                originalConfig._retry = true;
                return ApiAuthen.post('/refreshToken', {
                    token: localStorage.getItem('refreshToken'),
                })
                    .then((rs) => {
                        localStorage.setItem('accessToken', rs.data.accessToken);
                        // originalConfig.headers['x-access-token'] = rs.data.accessToken
                        return ApiPy(originalConfig);
                    })
                    .catch((error) => Promise.reject(error));
                // try {
                //     const rs = await refreshToken();

                //     window.localStorage.setItem('accessToken', rs.data.accessToken)
                //     originalConfig.baseURL = URL_SERVER
                //     originalConfig.headers['x-access-token'] = rs.data.accessToken
                //     return ApiPy(originalConfig);
                // } catch (_error) {
                //     return Promise.reject(_error);
                // }
            }
        }

        return Promise.reject(err);
    },
);

export default ApiPy;
