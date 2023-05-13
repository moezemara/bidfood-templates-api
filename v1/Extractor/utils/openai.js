import { Configuration, OpenAIApi } from 'openai';
import config from '../../../config/Config.js'

export async function GPT3(text, trycount = 0) {
    try {
        const configuration = new Configuration({
            apiKey: config.openai.apisecret,
            organization: config.openai.organization
        });

        const openai = new OpenAIApi(configuration);

        // chat completion
        const gptResponse = await openai.createChatCompletion({
            model: config.openai.engineid,
            messages: [{role: "system", content: text}],
        });

        const response = gptResponse.data.choices[0].message

        // convert response to json
        const jsonresponse = JSON.parse(response.content)

        // add try count to response
        jsonresponse.trycount = trycount
        return jsonresponse
    }
    catch (error) {
        console.log(error)
        console.log(trycount)
        if (trycount < 3) {
            return await GPT3(text, trycount + 1)
        }
    }    
}
