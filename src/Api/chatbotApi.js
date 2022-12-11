import ApiPy from './pyConfig';

const ChatbotApi = {
    send: async (paramKey, message) => {
        const res = await ApiPy.get(`/getChatbot?${paramKey}=${message}`);
        return res;
    },
};

export default ChatbotApi;
