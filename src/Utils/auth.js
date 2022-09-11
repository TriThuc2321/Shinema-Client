const checkLogged = () => {
    const logged = localStorage.getItem('logged');
    const remember = localStorage.getItem('rememberAccount');

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
                        .then((res) => {
                            dispatch(userSlice.actions.update(res.data));
                            setLoaded(true);
                        })
                        .catch((err) => console.log(err));
                } else {
                    localStorage.setItem('logged', false);
                    navigate('/login');
                }
            })
            .catch((err) => console.log(err));
    } else {
        setLoaded(true);
    }
};

export default checkLogged;
