/* eslint-disable no-useless-escape */
export const validateEmail = (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
export const validatePassword = (val) => val.length >= 6;

export const validateObseneWord = (str) => {
    const ObseneWord = [
        'đụ',
        'Đụ',
        'duma',
        'dume',
        'ditconmem',
        'dkm',
        'vcl',
        'cdmm',
        'dmm',
        'cdm',
        'clm',
        'cl',
        'cc',
        'cặc',
        'cu',
        'lồn',
        'loz',
        'cak',
        'đỉ',
        'đĩ',
        'fucking',
        'asshole',
        'motherfucker',
        'dick',
        'cock',
        'bitch',
        'chó đẻ',
        'cho de',
        'địt',
        'dit',
    ];
    const arrayChar = str.toLowerCase().split(' ');
    for (let i = 0; i < ObseneWord.length; i++) {
        if (arrayChar.indexOf(ObseneWord[i]) !== -1) return true;
    }
    return false;
};

export const validatePhoneNumber = (inputStr) => {
    const re = /(0+([0-9]{9})\b)/g;
    return re.test(inputStr);
};
export const makeId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
export const availableRoom = async (newListDateTime, defaultListDateTime, runtime) => {
    const newList = [];
    const defaultList = [];

    await newListDateTime.forEach((newItem) => {
        defaultListDateTime.forEach((defaultItem) => {
            if (newItem.date === defaultItem.date) {
                newList.push(newItem);
                defaultList.push(defaultItem);
            }
        });
    });

    const subTime = async (time1, time2) => {
        const time1Arr = time1.split(':');
        const h1 = time1Arr[0];
        const m1 = time1Arr[1];

        const time2Arr = time2.split(':');
        const h2 = time2Arr[0];
        const m2 = time2Arr[1];

        return Math.abs((h1 - h2) * 60 + (m1 - m2));
    };

    let result = true;

    for (let i = 0; i < newList.length; i++) {
        // eslint-disable-next-line no-loop-func, no-await-in-loop
        await newList[i].times.forEach((newTime) => {
            defaultList[i].times.forEach(async (defaultTime) => {
                if (parseInt(await subTime(newTime, defaultTime), 10) < parseInt(runtime, 10) + 30) {
                    result = false;
                }
            });
        });
    }

    return result;
};

export const subTime = (time1, time2) => {
    const time1Arr = time1.split(':');
    const h1 = time1Arr[0];
    const m1 = time1Arr[1];

    const time2Arr = time2.split(':');
    const h2 = time2Arr[0];
    const m2 = time2Arr[1];

    return Math.abs((h1 - h2) * 60 + (m1 - m2));
};

export const subDate = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const differenceInTime = d1.getTime() - d2.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays;
};

export const availableSeat = (listBookedSeats, listRoomSeats, currentSeat) => {
    // eslint-disable-next-line no-unused-expressions
    !(listRoomSeats.contains(currentSeat) && listBookedSeats.contains(currentSeat));
};

export const removeDuplicates = (array) => Array.from(new Set(array));

export function containNumeric(string) {
    return /\d/.test(string);
}

export function onlyLettersAndSpaces(str) {
    return /^[A-Za-z\s]*$/.test(str);
}
