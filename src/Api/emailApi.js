import ApiDatabase from './ApiDatabase';

const EmailApi = {
    sendVerify: async (option) => {
        const res = await ApiDatabase.post('sendMail/verify', {
            to: option.to,
            subject: option.subject,
            text: option.text,
        });
        return res.data;
    },
};

export default EmailApi;
