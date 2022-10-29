import axios from 'axios';
import { getUrlAuthen } from '~/Configs/url';

const ApiAuthen = axios.create({
    baseURL: getUrlAuthen(),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default ApiAuthen;
