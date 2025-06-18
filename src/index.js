import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendMessageToAgent } from "./azure/azureClient.js";

const app = express();
const PORT = process.env.PORT || 3000;

// EJS setup (choosing this over React due to smaller scale of the project)
app.set('view engine', 'ejs');
app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), 'views'));

app.use(express.urlencoded({ extended: true }));

// serve static files (css, js, etc.)
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));

// in-memory message store for demo purposes (wouldn't be used in prod)
let messages = [];

app.get('/', (req, res) => {
    res.render('chat', { messages });
});

// not abiding to MVC pattern for simplicity (not enough endpoints to justify)
app.post('/chat', async (req, res) => {
    const text = req.body.message;
    if (text && text.trim()) {
        messages.push({ user: 'You', text });
        // get agent response
        try {
            const result = await sendMessageToAgent(text);
            if (result && result.response) {
                messages.push({ user: 'Agent', text: result.response });
            } else if (result && result.error) {
                messages.push({ user: 'Agent', text: 'Sorry, there was an error processing your request.' });
            }
        } catch (err) {
            messages.push({ user: 'Agent', text: 'Sorry, there was an error communicating with the agent.' });
        }
    }
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});