import express, { Request, Response, NextFunction } from 'express';
import https from 'https';
import fs from 'fs';

const app = express();

app.get('/', (req, res) => {
 res.send('Привет, мир!');
});

const options = {
 key: fs.readFileSync('resource.key'),
 cert: fs.readFileSync('resource.crt'),
 ca: fs.readFileSync('ca.crt')
};

https.createServer(options, app).listen(3000, () => {
 console.log('Сервер запущен на порту 3000');
});