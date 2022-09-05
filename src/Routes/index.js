import { DetailPageLayout } from '~/Layouts';
import { Home, Login, Corner, PeopleDetails, FilmDetails } from '../Pages';
import config from '~/Configs';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.login, component: Login, layout: DetailPageLayout },
    { path: config.routes.corner, component: Corner },
    { path: config.routes.people_details, component: PeopleDetails },
    { path: config.routes.film_details, component: FilmDetails },
];

const privateRoute = [];

export { publicRoutes, privateRoute };
