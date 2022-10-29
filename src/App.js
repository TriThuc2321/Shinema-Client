import { Routes, Route } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userSlice from '~/Redux/slices/userSlice';

import { checkLogged } from '~/Utils/auth';
import getRoutes from '~/Routes';
import { DefaultLayout } from './Layouts';

function App() {
    const dispatch = useDispatch();
    const [routes, setRoutes] = useState([]);
    const user = useSelector((state) => state.users);
    useEffect(() => {
        const _checkLogged = async () => {
            const result = await checkLogged();
            if (result) {
                if (!user || result.data.email !== user.instance.email) {
                    dispatch(userSlice.actions.update(result.data));
                }
                const listRoutes = getRoutes(result.data.rank);
                setRoutes(listRoutes);
            } else {
                const listRoutes = getRoutes('Guest');
                setRoutes(listRoutes);
            }
        };
        _checkLogged();
    }, [user]);

    return (
        <Routes>
            {routes &&
                routes.map((route) => {
                    const Page = route.component;
                    let Layout = DefaultLayout;

                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
        </Routes>
    );
}

export default App;
