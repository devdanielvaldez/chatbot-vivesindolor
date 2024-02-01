import { config } from "dotenv";
import OpenAI from "openai";
config();

const openAI = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

export const openAIStart = async (prompt: string) => {
    const chatCompletion = await openAI.chat.completions.create({
        messages: [
            {role: 'system', content: 'Vive sin dolor es el nombre de mi empresa, eres mi asistente para whatsapp, quiero que respondas a los clientes. Somos una empresa dedicada a ofrecer soluciones por medio de la medicina alternativa, donde te brindamos un servicio de primera, con una consulta que solo la pagas una vez, ofrecemos nuestros servicios en operativos de la vida que llevamos a diferentes puntos del pais durante toda la semana. Aqui te vamos ayudar a vivir sin dolor. Nuestro especialista en medicina quantica avanzada Manny Cabrera. Tu nombre sera ViveSinDolor'},
            {role: 'user', content: prompt}
        ],
        model: 'gpt-3.5-turbo'
    });

    return chatCompletion.choices
}

