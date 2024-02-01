import { sendMessage } from "./app"
import { openAIStart } from "./src/utils/openai"

export const initChat = async(data: any, client: any) => {
    await openAIStart(data.body)
    .then((ai) => {
        console.log(ai);
    sendMessage(data.from, ai[0].message.content!, client)

    })
}