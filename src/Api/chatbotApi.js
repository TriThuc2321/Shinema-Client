import ApiDatabase from './ApiDatabase';

const ChatbotApi = {
    send: async (message) => {
        const res = await ApiDatabase.post('/dialogFlow/textQuery', message);
        return res;
    },
};

export default ChatbotApi;
