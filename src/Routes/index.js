import { DetailPageLayout } from '~/layouts';
import { Home, Login, Corner, PeopleDetails, FilmDetails } from '../pages';
import config from '~/configs';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.login, component: Login, layout: DetailPageLayout },
    { path: config.routes.corner, component: Corner },
    { path: config.routes.people_details, component: PeopleDetails },
    { path: config.routes.film_details, component: FilmDetails },
];

const privateRoute = [];

export { publicRoutes, privateRoute };