import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { fileURLToPath } from "url";

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
    apiKey: "",
    dangerouslyAllowBrowser: true,
});
const speechFile = path.resolve(__dirname, "./speech.mp3");

async function generateSpeech() {
    try {
        const mp3 = await openai.audio.speech.create({
            model: "gpt-4o-mini-tts",
            voice: "coral",
            input: "Wir freuen uns, dass ihr mit euren Kindern bei uns in der Halle einen Tag",
            instructions: "Speak in a cheerful and positive tone.",
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);
        console.log(`语音文件已保存至: ${speechFile}`);
    } catch (error) {
        console.error("生成语音时出错:", error);
    }
}

generateSpeech();
