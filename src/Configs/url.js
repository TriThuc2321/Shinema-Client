const env = 'prod';

const URL = {
    localDatabase: 'http://localhost:8000/api',
    localAuthen: 'http://localhost:5500/auth',
    herokuDatabase: 'https://shinema.herokuapp.com/api',
    herokuAuthen: 'https://shinema-auth.herokuapp.com/auth',
};

export const getUrlDatabase = () => (env === 'prod' ? URL.herokuDatabase : URL.localDatabase);
export const getUrlAuthen = () => (env === 'prod' ? URL.herokuAuthen : URL.localAuthen);
