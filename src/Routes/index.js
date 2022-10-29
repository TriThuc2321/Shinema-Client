import { guest, admin, staff, censor, customer } from './routes';

const getRoutes = (role) => {
    switch (role) {
        case 'Admin':
            return admin;
        case 'Staff':
            return staff;
        case 'Censor':
            return censor;
        case 'Customer':
            return customer;
        default:
            return guest;
    }
};

export default getRoutes;
