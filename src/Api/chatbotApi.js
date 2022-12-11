import ApiPy from './pyConfig';

const ChatbotApi = {
    send: async (message) => {
        const res = await ApiPy.get(`/getChatbot?msg=${message}`);
        return res;
    },
};

export default ChatbotApi;
