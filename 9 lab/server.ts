import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';



const app: Express = express();
const port = 3003;

interface TelephoneDirectoryEntry {
    id: number;
    name: string;
    phone: string;
}

let telephoneDirectory: TelephoneDirectoryEntry[] = [
    { id: 1, name: 'John Doe', phone: '123-456-7890' },
    { id: 2, name: 'Jane Smith', phone: '987-654-3210' },
];


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Telephone Directory API',
            version: '1.0.0',
        },
    },
    apis: ['./server.ts'],
};


const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(bodyParser.json());

app.use(bodyParser.json());

/**
 * @openapi
 * /TS:
 *   get:
 *     summary: Получить полный список телефонов из справочника
 *     responses:
 *       '200':
 *         description: Успешный ответ
 *         content:
 *           application/json:    
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TelephoneDirectoryEntry'
 */
app.get('/TS', (req: Request, res: Response) => {
    res.json(telephoneDirectory);
});

/**
 * @openapi
 * /TS:
 *   post:
 *     summary: Добавить новый телефон в справочник
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TelephoneDirectoryEntry'
 *     responses:
 *       '201':
 *         description: Успешно добавлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TelephoneDirectoryEntry'
 */
app.post('/TS', (req: Request, res: Response) => {
    const newEntry: TelephoneDirectoryEntry = req.body;
    newEntry.id = telephoneDirectory.length + 1;
    telephoneDirectory.push(newEntry);
    res.status(201).json(newEntry);
});

/**
 * @openapi
 * /TS:
 *   put:
 *     summary: Обновить существующую запись в справочнике
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TelephoneDirectoryEntry'
 *     responses:
 *       '200':
 *         description: Успешно обновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TelephoneDirectoryEntry'
 *       '404':
 *         description: Запись не найдена
 */
app.put('/TS', (req: Request, res: Response) => {
    const updatedEntry: TelephoneDirectoryEntry = req.body;
    const index = telephoneDirectory.findIndex((entry) => entry.id === updatedEntry.id);
    if (index === -1) {
        res.status(404).json({ error: 'Entry not found' });
    } else {
        telephoneDirectory[index] = updatedEntry;
        res.json(updatedEntry);
    }
});

/**
 * @openapi
 * /TS/{id}:
 *   delete:
 *     summary: Удалить запись из справочника
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Успешно удалено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TelephoneDirectoryEntry'
 *       '404':
 *         description: Запись не найдена
 */
app.delete('/TS/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const index = telephoneDirectory.findIndex((entry) => entry.id === id);
    if (index === -1) {
        res.status(404).json({ error: 'Entry not found' });
    } else {
        const deletedEntry = telephoneDirectory.splice(index, 1)[0];
        res.json(deletedEntry);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     TelephoneDirectoryEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         phone:
 *           type: string
 */