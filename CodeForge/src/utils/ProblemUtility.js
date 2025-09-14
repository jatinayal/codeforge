 const axios = require('axios');
 const submissions = require('../models/submissions')

    const getLanguageById = (lang)=>{
    const language = {
        "c++":54,
        "java":62,
        "javascript":63,
        "cpp":54,
        "Cpp":54
    }

    return language[lang.toLowerCase()];
}

const submitBatch = async(submissions)=>{

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': '65a2d9cffemsh1890ba589424e95p11770cjsna0dde65b77c3',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};


async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();


}

const waiting= async(timer) =>{
    setTimeout(() => {
        return 1;
    }, timer);
}

const submitToken = async (resultToken) => {
    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': '65a2d9cffemsh1890ba589424e95p11770cjsna0dde65b77c3',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error('Error fetching submission results:', error);
            return { submissions: [] }; // Return empty submissions array instead of undefined
        }
    }

    while (true) {
        const result = await fetchData();
        
        // Add null/undefined check before accessing result.submissions
        if (!result || !result.submissions) {
            console.error('Invalid response from Judge0 API');
            await waiting(1000);
            continue;
        }

        const isResultObtained = result.submissions.every((r) => r.status_id > 2);

        if (isResultObtained)
            return result.submissions;

        await waiting(1000);
    }
}
module.exports = {getLanguageById,submitBatch,submitToken};