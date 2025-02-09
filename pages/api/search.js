// pages/api/search.js
import axios from 'axios';

export default async function handler(req, res) {
    try {
        const { type, query, display, start, sort } = req.query;

        if (!type || !query) {
            return res.status(400).json({ message: 'type과 query는 필수 파라미터입니다.' });
        }

        const searchNaver = async (type, query, options = {}) => {
            const baseURL = 'https://openapi.naver.com/v1/search/';
            const apiURL = `${baseURL}${type}.json`;

            try {
                const params = {
                    query: query,
                    display: options.display || 10,
                    start: options.start || 1,
                    sort: options.sort || 'sim'
                };

                const response = await axios.get(apiURL, {
                    params: params,
                    headers: {
                        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
                    },
                });

                return response.data;

            } catch (error) {
                if (error.response) {
                    console.error('Status Code:', error.response.status);
                    console.error('Error Data:', error.response.data);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error Message:', error.message);
                }
                throw error;
            }
        };

        const data = await searchNaver(type, query, {
            display: parseInt(display),
            start: parseInt(start),
            sort
        });

        res.status(200).json(data);

    } catch (error) {
        console.error("API Route Error:", error);
        res.status(500).json({ message: 'API 요청 실패', error: error.message });
    }
}
