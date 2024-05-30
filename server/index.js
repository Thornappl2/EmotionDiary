import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import fs from 'fs';
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let OPENAI_API_KEY = null;
fs.readFile('../openai_api_key.txt', 'utf8', (err, data) => {
    if (err) {
        console.error("Error: failed to get the secret key of openai api");
        console.error(err);
    }
    OPENAI_API_KEY = data;
});
let audioCount = 0;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

let records = [];
records.push({
    date: '2024-04-12T01:55:33.955Z',
    userText: '2024-04-12 dummy user text',
    aiText: '2024-04-12 dummy ai text',
    audioUrl: 'audio-url'
});
records.push({
    date: '2024-05-25T01:55:33.955Z',
    userText: '2024-05-25 dummy user text',
    aiText: '2024-05-25 dummy ai text',
    audioUrl: 'audio-url'
});
records.push({
    date: '2024-05-27T01:55:33.955Z',
    userText: '2024-05-27 dummy user text',
    aiText: '2024-05-27 dummy ai text',
    audioUrl: 'audio-url'
});

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
        const audioFileName = "audio[" + audioCount.toString() + "].mp3";
        audioCount = audioCount + 1;
        const speechFile = path.resolve("./public/" + audioFileName);
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "nova",
            input: text
        });
        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.promises.writeFile(speechFile, buffer);
        res.json({ audioUrl: audioFileName });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate TTS audio' });
    }
});

app.post('/api/records', (req, res) => {
    const { userText, aiText } = req.body;
    const date = new Date();
    const record = {
        date: date.toISOString(),
        userText: userText,
        aiText: aiText,
        audioUrl: 'audio-url' // 실제 오디오 URL
    };
    records.push(record);
    res.json({ success: true });
});

app.get('/api/records', (req, res) => {
    res.json({ records: records });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
