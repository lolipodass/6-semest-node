import sequelize from "./database.ts";
import express from "express";
import router from "./Routes.ts";
import path, { dirname } from "path";
import multer from "multer";
import { rename } from "fs";
import { fileURLToPath } from "url";
import { GetTurtleById, UpdateTurtleById } from "./services/Turtles_service.ts";
import { handleError } from "./utils/errorHandler.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3999;


const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.json());

app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/", router);


app.get('/images/:id', (req, res) => {
    const imageId = req.params.id;
    const imagePath = path.join(__dirname, 'images', `${imageId}.jpg`);

    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).send('Image not found');
        }
    });
});



app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});



app.post('/upload', upload.single('image'), (req, res) => {
    try {

        const turtleId = parseInt(req.body.turtleId, 10);
        const image = req.file;

        if (GetTurtleById(turtleId) == null) {
            return res.status(400).send('Turtle not found');
        }

        if (!image) {
            return res.status(400).send('No image uploaded');
        }

        const newPath = path.join(__dirname, 'images', `${turtleId}.jpg`);
        rename(image.path, newPath, (err) => {
            if (err) {
                return res.status(500).send('Error saving image');
            }

            UpdateTurtleById(turtleId, { image: newPath })

            res.send('Image uploaded successfully');
        });
    }
    catch (error: unknown) {
        handleError(error, res);
    }
}
);


sequelize.sync().then(
    async () => {
        app.listen(port, () => {
            console.log(`server running localhost:${port}`)
        })
    }
);


