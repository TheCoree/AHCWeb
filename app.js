const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Функция для записи в файл
function fileWrite(text) {
    fs.appendFileSync('coded.txt', text + '\n');
}

// Кодирование
function coding(text, mixing, key) {
    let final = '';
    for (const char of text) {
        const codingWord = char.charCodeAt(0) + parseInt(mixing);
        const codedWord = String(codingWord) + String(key);
        final += String.fromCharCode(parseInt(codedWord));
    }
    return final;
}

// Декодирование
function decoderMain(text, mixing) {
    let message = '';
    for (const char of text) {
        const codedChar = char.charCodeAt(0);
        // Удаляем последнюю цифру перед преобразованием
        const decodedWithKey = Math.floor(codedChar / 10); // Удаляем последнюю цифру
        const final = decodedWithKey - parseInt(mixing);
        message += String.fromCharCode(final);
    }
    return message;
}

// Поиск mixing и key
function searchMix(text) {
    const mixingMatch = text.match(/mixing:\s*(\d+)/);
    if (mixingMatch) {
        return mixingMatch[1];
    }
    return null;
}

app.post('/encrypt', (req, res) => {
    const { text, mixing, key } = req.body;
    const encodedText = coding(text, mixing, key);
    const result = `${encodedText} mixing: ${mixing} key: ${key}`;
    const resultFile = `IP: ${req.ip} | ${text} -> ${encodedText} mixing: ${mixing} key: ${key}`;
    fileWrite(resultFile);
    res.send({ encodedText: encodedText, result: result });
});

app.post('/decrypt', (req, res) => {
    const { text } = req.body;
    const mixing = searchMix(text);
    
    if (!mixing) {
        return res.status(400).send({ error: 'Invalid format for decryption. Please include mixing.' });
    }

    // Удаляем часть текста перед декодированием
    const cleanText = text.replace(/ mixing:\s*\d+ key:\s*\d+$/, ''); 
    const decodedMessage = decoderMain(cleanText, mixing);
    const result = `${decodedMessage}`;
    const resultFile = `IP: ${req.ip} | ${text} -> ${decodedMessage}`;
    fileWrite(resultFile);
    res.send({ decodedMessage: decodedMessage, result: result });
});

// Добавляем маршрут для страницы с туториалом
app.get('/tutorial', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tutorial.html')); // Убедитесь, что путь соответствует вашему файлу
});

app.listen(80, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:3000');
});
