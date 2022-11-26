const env = 'prod';

const URL = {
    localDatabase: 'http://localhost:2321/api',
    localAuthen: 'http://localhost:5500/auth',
    localPy: 'http://127.0.0.1:5000/',
    herokuDatabase: 'https://shinema.herokuapp.com/api',
    herokuAuthen: 'https://shinema-auth.herokuapp.com/auth',
    herokuPy: 'https://shinema-py.herokuapp.com',
};

export const getUrlDatabase = () => (env === 'prod' ? URL.herokuDatabase : URL.localDatabase);
export const getUrlAuthen = () => (env === 'prod' ? URL.herokuAuthen : URL.localAuthen);
// export const getUrlPy = () => (env === 'prod' ? URL.herokuPy : URL.localPy);
export const getUrlPy = () => (env === 'prod' ? URL.localPy : URL.localPy);
