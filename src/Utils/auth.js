import { decode, encode } from 'base-64';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AccountApi from '~/Api/accountApi';
import userSlice from '~/Redux/slices/userSlice';

export const checkLogged = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logged = localStorage.getItem('logged');
    const remember = localStorage.getItem('rememberAccount');

    const _currentUser = useSelector((state) => state.users.instance);

    // console.log(remember == 'true')
    // console.log(logged == 'true')
    // console.log(user == null)
    if (remember === 'true' && logged === 'true' && (_currentUser === '' || _currentUser === null)) {
        const email = decode(localStorage.getItem(encode('rememberEmail')));
        const password = decode(localStorage.getItem(encode('rememberPassword')));
        AccountApi.login(email, password)
            .then((res) => {
                if (res.data !== 'Email not exist' && res.data !== 'Password incorrect') {
                    AccountApi.getByEmail(email)
                        .then((resAccount) => {
                            dispatch(userSlice.actions.update(resAccount.data));
                        })
                        .catch((err) => console.log(err));
                } else {
                    localStorage.setItem('logged', false);
                    navigate('/login');
                }
            })
            .catch((err) => console.log(err));
    }
};
