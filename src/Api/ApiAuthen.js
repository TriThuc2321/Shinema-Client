import axios from 'axios';
import { URL_AUTHEN } from '../Constants';

const ApiAuthen = axios.create({
    baseURL: URL_AUTHEN,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default ApiAuthen;
