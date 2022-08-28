import { DetailPageLayout } from '~/layouts';
import { Home, Login } from '../pages';
import config from '~/configs';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.login, component: Login, layout: DetailPageLayout },
];

const privateRoute = [];

export { publicRoutes, privateRoute };
