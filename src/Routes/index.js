import { DetailPageLayout } from '~/Layouts';
import { Home, Login } from '../Pages';
import config from '~/Configs';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.login, component: Login, layout: DetailPageLayout },
];

const privateRoute = [];

export { publicRoutes, privateRoute };
