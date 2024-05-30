import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import fs from 'fs';
import OpenAI from "openai";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const salt = crypto.randomBytes(128).toString("base64");
let OPENAI_API_KEY = null;
fs.readFile('../openai_api_key.txt', 'utf8', (err, data) => {
    if (err) {
        console.error("Error: failed to get the secret key of openai api");
        console.error(err);
    }
    OPENAI_API_KEY = data;
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

let records = [];

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const openai = new OpenAI({
            apiKey: OPENAI_API_KEY
        });
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: message}
            ],
            model: "gpt-3.5-turbo",
            max_tokens: 300
        });
        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
    }
});

app.post('/api/tts', async (req, res) => {
    const { text } = req.body;
    try {
        const openai = new OpenAI({
            apiKey: OPENAI_API_KEY
        });
        const audioFileName = crypto.createHash("sha1").update(text).digest("hex") + ".mp3";
        if (fs.existsSync("/audio/" +crypto.createHash("sha1").update(text).digest("hex")+".mp3") == false) {
            const speechFile = path.resolve("./public/audio", audioFileName);
            const mp3 = await openai.audio.speech.create({
                model: "tts-1",
                voice: "nova",
                input: text
            });
            const buffer = Buffer.from(await mp3.arrayBuffer());
            await fs.promises.writeFile(speechFile, buffer);   
        }
        res.json({ audioUrl: "/audio/" + audioFileName });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate TTS audio' });
    }
});

app.post('/api/records', (req, res) => {
    const { aiQuestion, userAnswer } = req.body;
    const date = new Date();
    const record = {
        date: date.toISOString(),
        aiQuestion: aiQuestion,
        userAnswer: userAnswer,
        audioUrl: "/audio/" + crypto.createHash("sha1").update(aiQuestion).digest("hex") + ".mp3"
    };
    records.push(record);
    res.json({ success: true });
});

app.get('/api/records', (req, res) => {
    res.json({ records: records });
});

app.post("/api/find_out_emotion", async (req, res) => {
    const { userAnswer } = req.body;
    try {
        const openai = new OpenAI({
            apiKey: OPENAI_API_KEY
        });
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "주어진 문장에서 감정을 파악하는데, 질문에 대한 응답을 파악된 감정에 대해 {감정1, 감정2, ...} 형식으로 답해줘." },
                { role: "user", content: userAnswer }
            ],
            model: "gpt-3.5-turbo",
            max_tokens: 300
        });
        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
    }
});

app.post("/api/find_out_reason", async (req, res) => {
    const { userAnswer, emotions } = req.body;
    try {
        const openai = new OpenAI({
            apiKey: OPENAI_API_KEY
        });
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "입력으로 감정들을 알려줄건데, assistant의 내용을 토대로 그런 감정을 느낀 원인을 파악하고 파악한 원인만 응답으로 제공해줘." },
                { role: "assistant", content: userAnswer },
                { role: "user", content: emotions }
            ],
            model: "gpt-3.5-turbo",
            max_tokens: 300
        });
        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
