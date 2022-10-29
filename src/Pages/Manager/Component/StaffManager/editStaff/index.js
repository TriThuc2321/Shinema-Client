/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import { Typography, TextField, Switch } from '@mui/material';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { useNavigate, useParams } from 'react-router';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import styles from './styles';

// eslint-disable-next-line import/no-cycle
import { CustomFillButton, CustomOutlineButton } from '../index';
import { onlyLettersAndSpaces, containNumeric, validatePhoneNumber, validateEmail } from '~/Utils';
import AccountApi from '~/Api/accountApi';
import Loading from '~/Components/Loading';
import { Success, Error } from '~/Components/Alert';
import cloudinaryApi from '~/Api/cloudinaryAPI';
import Logo from '~/Assets/logo.png';

function EditStaff() {
    const { id } = useParams();
    const [staff, setStaff] = useState({});
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [positionList] = useState([
        { value: 'Censor', key: 'censor' },
        { value: 'Manager', key: 'manager' },
    ]);

    const [values, setValues] = useState({
        // _id: id,
        // name: staff.name,
        // contact: staff.contact,
        // address: staff.address,
        // birthday: staff.birthday,
        // email: staff.email,
        // gender: staff.gender,
        // avatar: staff.avatar,
        // rank: staff.rank,
        // identifyNumber: staff.identifyNumber,
        // score: staff.score,
        // listTicketId: staff.listTicketId,
        // listReview: staff.listReview,
        // password: staff.password,

        _id: '',
        name: '',
        contact: '',
        address: '',
        birthday: '',
        email: '',
        gender: '',
        avatar: '',
        rank: '',
        identifyNumber: '',
        score: '',
        listTicketId: [],
        listReview: [],
        password: '',
    });

    useEffect(async () => {
        await AccountApi.getById(id)
            .then((res) => {
                setStaff(res.data);
                setValues({
                    ...values,
                    _id: res.data._id,
                    name: res.data.name,
                    contact: res.data.contact,
                    address: res.data.address,
                    birthday: res.data.birthday,
                    email: res.data.email,
                    gender: res.data.gender,
                    avatar: res.data.avatar,
                    identifyNumber: res.data.identifyNumber,
                    rank: res.data.rank,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    const [validName, setValidName] = useState({
        check: true,
        alert: '',
    });

    const [validEmail, setValidEmail] = useState({
        check: true,
        alert: '',
    });

    const [validPhone, setValidPhone] = useState({
        check: true,
        alert: '',
    });

    const [validAddress, setValidAddress] = useState({
        check: true,
        alert: '',
    });

    const [validBirthday, setValidBirthday] = useState({
        check: true,
        alert: '',
    });

    const [validIdentityNumber, setValidIdentityNumber] = useState({
        check: true,
        alert: '',
    });

    const [validRank, setValidRank] = useState({
        check: true,
        alert: '',
    });

    const resetValidation = () => {
        setValidName({
            ...validName,
            check: true,
        });
        setValidEmail({
            ...validEmail,
            check: true,
        });
        setValidPhone({
            ...validPhone,
            check: true,
        });
        setValidAddress({
            ...validAddress,
            check: true,
        });
        setValidBirthday({
            ...validBirthday,
            check: true,
        });
        setValidIdentityNumber({
            ...validIdentityNumber,
            check: true,
        });
        setValidRank({
            ...validRank,
            check: true,
        });
    };

    const [birthday] = useState(staff.birthday);
    const [updateSucceeded, setUpdateSucceeded] = useState({
        status: false,
        message: '',
        display: false,
    });

    const [errorNotification, setErrorNotification] = useState({
        status: false,
        message: '',
        display: false,
    });

    const handleChangeValue = (prop) => (event) => {
        if (prop !== 'gender') setValues({ ...values, [prop]: event.target.value });
        else if (event.target.value === 'on') setValues({ ...values, gender: 'male' });
        else setValues({ ...values, gender: 'female' });
    };

    const validate = async () => {
        let flag = true;
        resetValidation();

        if (values.rank === undefined || values.rank === '') {
            setValidRank({
                check: true,
                alert: 'Please choose postiontion',
            });
            flag = false;
        }
        if (values.name === undefined || values.name === '') {
            setValidName({
                check: false,
                alert: 'Please enter your name!',
            });
            flag = false;
        } else if (!onlyLettersAndSpaces(values.name)) {
            console.log(containNumeric(values.name));
            setValidName({
                check: false,
                alert: 'Invalid name!',
            });
            flag = false;
        }

        if (values.email === undefined || values.email === '') {
            setValidEmail({
                check: false,
                alert: 'Please enter email',
            });
            flag = false;
        } else if (!validateEmail(values.email)) {
            setValidEmail({
                check: false,
                alert: 'Your email is not valid!',
            });
        } else {
            await AccountApi.checkEmail(values.email).then((res) => {
                if (res === 'Email already exists') {
                    setValidEmail({
                        check: false,
                        alert: 'Your email is already existed',
                    });
                }
            });
        }

        if (values.contact === undefined || values.contact === '') {
            setValidPhone({
                check: false,
                alert: 'Please enter phone number',
            });
            flag = false;
        } else if (!validatePhoneNumber(values.contact)) {
            setValidPhone({
                check: false,
                alert: 'Invalid phone number!',
            });
            flag = false;
        }

        if (values.identifyNumber === undefined || values.identifyNumber === '') {
            setValidIdentityNumber({
                check: false,
                alert: 'Please enter an identity number!',
            });
            flag = false;
        }

        if (values.address === undefined || values.address === '') {
            setValidAddress({
                check: false,
                alert: 'Please enter address',
            });
        }
        return flag;
    };

    const modify = async () => {
        if (await validate()) {
            setIsLoading(true);
            await AccountApi.update(values)
                .then(() => {
                    setIsLoading(false);
                    setUpdateSucceeded({
                        status: true,
                        message: 'Update your staff successfully!',
                    });
                })
                .catch((err) => {
                    console.log(err);
                    setErrorNotification({
                        status: true,
                        message: 'Sorry! There are something wrong with your request',
                    });
                });
        }
    };

    const changePic = (e) => {
        if (e.target.files) {
            const listFile = [];
            for (let i = 0; i < e.target.files.length; i++) {
                const reader = new FileReader();
                reader.readAsDataURL(e.target.files[i]);
                reader.onloadend = async () => {
                    listFile.push(reader.result);
                    if (i === e.target.files.length - 1) {
                        await cloudinaryApi
                            .upload(listFile)
                            .then((res) => {
                                console.log(res);
                                setIsLoading(false);
                                setValues({ ...values, avatar: res.data[0] });
                                setStaff({ ...staff, avatar: res.data[0] });
                            })
                            .catch((err) => {
                                console.log(err);
                                setErrorNotification({
                                    status: true,
                                    message: err,
                                });
                            });
                    }
                };
            }
        }
    };

    return (
        <div>
            <div style={styles.container}>
                <Typography variant="h5" style={{ fontWeight: 'bold', color: 'red' }}>
                    Modify staff
                </Typography>
                <Stack direction="column">
                    <Grid container spacing={2}>
                        {/* Information */}
                        <Grid item container sx={{ p: 2, ml: 2, mr: 2 }} xs={7}>
                            <Grid xs={4} item>
                                <Typography variant="body1" style={styles.typo}>
                                    Position
                                </Typography>
                            </Grid>
                            <Grid xs={8} item>
                                <FormControl style={{ width: '80%' }} sx={{ mt: 2, mb: 2 }}>
                                    <InputLabel id="demo-simple-select-label">Position</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={values.rank}
                                        label="Position"
                                        onChange={handleChangeValue('rank')}
                                    >
                                        {positionList.map((position) => (
                                            <MenuItem key={position} value={position.value}>
                                                {position.value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {validRank.check === true && (
                                        <Typography variant="subtitle2" style={{ color: 'red' }}>
                                            {validRank.alert}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid xs={4} item>
                                <Typography variant="body1" style={styles.typo}>
                                    Name:
                                </Typography>
                            </Grid>
                            <Grid xs={8} item>
                                {validName.check === true ? (
                                    <TextField
                                        id="standard-basic"
                                        variant="standard"
                                        onChange={handleChangeValue('name')}
                                        value={values.name}
                                        style={styles.TextField}
                                    />
                                ) : (
                                    <TextField
                                        id="standard-basic"
                                        variant="standard"
                                        onChange={handleChangeValue('name')}
                                        error
                                        helperText={validName.alert}
                                        style={styles.TextField}
                                    />
                                )}
                            </Grid>

                            <Grid xs={4} item>
                                <Typography variant="body1" style={styles.typo}>
                                    Email:
                                </Typography>
                            </Grid>
                            <Grid xs={8} item>
                                <TextField
                                    id="standard-basic"
                                    variant="standard"
                                    disabled
                                    onChange={handleChangeValue('email')}
                                    value={values.email}
                                    style={styles.TextField}
                                />
                            </Grid>

                            <Grid xs={4} item>
                                <Typography variant="body1" style={styles.typo}>
                                    Phone number:
                                </Typography>
                            </Grid>
                            <Grid xs={8} item>
                                {validPhone.check === true ? (
                                    <TextField
                                        id="standard-basic"
                                        variant="standard"
                                        onChange={handleChangeValue('contact')}
                                        value={values.contact}
                                        style={styles.TextField}
                                    />
                                ) : (
                                    <TextField
                                        id="standard-basic"
                                        variant="standard"
                                        error
                                        helperText={validPhone.alert}
                                        onChange={handleChangeValue('contact')}
                                        style={styles.TextField}
                                    />
                                )}
                            </Grid>

                            <Grid xs={4} item>
                                <Typography variant="body1" style={styles.typo}>
                                    Identity number:
                                </Typography>
                            </Grid>
                            <Grid xs={8} item>
                                {validIdentityNumber.check === true ? (
                                    <TextField
                                        id="standard-basic"
                                        variant="standard"
                                        style={styles.TextField}
                                        onChange={handleChangeValue('identifyNumber')}
                                        value={values.identifyNumber}
                                    />
                                ) : (
                                    <TextField
                                        id="standard-basic"
                                        variant="standard"
                                        style={styles.TextField}
                                        error
                                        helperText={validIdentityNumber.alert}
                                        onChange={handleChangeValue('identifyNumber')}
                                    />
                                )}
                            </Grid>

                            <Grid xs={4} item>
                                <Typography variant="body1" style={styles.typo}>
                                    Address:
                                </Typography>
                            </Grid>
                            <Grid xs={8} item>
                                {validAddress.check === true ? (
                                    <TextField
                                        id="standard-basic"
                                        variant="standard"
                                        style={styles.TextField}
                                        onChange={handleChangeValue('address')}
                                        value={values.address}
                                    />
                                ) : (
                                    <TextField
                                        id="standard-basic"
                                        variant="standard"
                                        style={styles.TextField}
                                        error
                                        helperText={validAddress.alert}
                                        onChange={handleChangeValue('address')}
                                    />
                                )}
                            </Grid>

                            <Grid xs={4} item>
                                <Typography variant="body1" style={styles.typo}>
                                    Birthday:
                                </Typography>
                            </Grid>
                            <Grid xs={8} item>
                                {validBirthday.check === true ? (
                                    <TextField
                                        className="profile-information__item__content"
                                        variant="standard"
                                        type="date"
                                        format="yyyy-MM-dd"
                                        style={styles.TextField}
                                        sx={{
                                            borderRadius: '0.5',
                                            input: { color: '#000', marginLeft: 10, marginX: 0.4 },
                                            // backgroundColor: 'rgb(9, 24, 48)',
                                            // label: { color: 'rgb(153, 153, 153)', fontSize: 15 }
                                        }}
                                        InputLabelProps={{
                                            color: '#fff',
                                            style: { color: '#000' },
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            style: { color: '#000' },
                                        }}
                                        defaultValue={birthday}
                                        onChange={handleChangeValue('birthday')}
                                    />
                                ) : (
                                    <TextField
                                        className="profile-information__item__content"
                                        variant="standard"
                                        type="date"
                                        format="yyyy-MM-dd"
                                        sx={{
                                            borderRadius: '0.5',
                                            input: { color: '#000', marginLeft: 10, marginX: 0.4 },
                                            // backgroundColor: 'rgb(9, 24, 48)',
                                            // label: { color: 'rgb(153, 153, 153)', fontSize: 15 }
                                        }}
                                        style={styles.TextField}
                                        InputLabelProps={{
                                            color: '#fff',
                                            style: { color: '#000' },
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            style: { color: '#000' },
                                        }}
                                        defaultValue={values.birthday}
                                        onChange={handleChangeValue('birthday')}
                                        error
                                        helperText={validBirthday.alert}
                                    />
                                )}
                            </Grid>

                            <Grid xs={4} item>
                                <Typography variant="body1" style={styles.typo}>
                                    Male:
                                </Typography>
                            </Grid>
                            <Grid xs={8} item>
                                <Switch
                                    onChange={handleChangeValue('gender')}
                                    defaultChecked={staff.gender === 'male'}
                                />
                            </Grid>
                        </Grid>
                        {/* Avatar */}
                        <Grid item xs={4}>
                            {staff.avatar === '' ? (
                                <img className="profile-pic__img" src={Logo} />
                            ) : (
                                <img className="profile-pic__img" src={values.avatar} />
                            )}
                            <input
                                type="file"
                                name="file"
                                accept="image/png, image/jpeg"
                                onChange={changePic}
                                style={{ padding: 1, marginTop: 20, marginLeft: 100 }}
                            />
                        </Grid>
                    </Grid>

                    <Stack
                        direction="row"
                        sx={{ width: '100%', mt: 3, p: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <CustomFillButton onClick={modify}>Modify</CustomFillButton>
                        <CustomOutlineButton onClick={() => navigate(-1)}>Cancel</CustomOutlineButton>
                    </Stack>
                </Stack>
            </div>

            {isLoading && <Loading />}
            <Success message={updateSucceeded.message} status={updateSucceeded.status} />
            {errorNotification.status && (
                <Error message={errorNotification.message} status={errorNotification.status} />
            )}
        </div>
    );
}

export default EditStaff;
