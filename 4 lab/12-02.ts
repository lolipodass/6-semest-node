import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import { Sequelize, Model, DataTypes } from 'sequelize';
import Redis from 'ioredis';
import cookieParser from 'cookie-parser';
import path from 'path';

interface RequestWithUserId extends Request {
  username?: string;
}

const app = express();
const port = 3013;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Установка сессий
app.use(session({
  secret: 'popa',
  resave: false,
  saveUninitialized: false
}));

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: __dirname + '/db.sqlite'
});

class User extends Model { }
User.init(
  {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    sequelize, modelName: 'user',
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
);

const redis = new Redis(9988);

const generateAccessToken = (username: string) => {
  return jwt.sign({ username }, 'access-secret', { expiresIn: '10m' });
};

const generateRefreshToken = (username: string) => {
  return jwt.sign({ username }, 'refresh-secret', { expiresIn: '24h' });
};

const isAuthenticated = (req: RequestWithUserId, res: Response, next: NextFunction) => {

  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).send('Asses denied, use localhost:3000/login');
  }

  jwt.verify(accessToken, 'access-secret', (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send('Asses denied, use localhost:3000/login');
    }

    req.username = decoded.username;
    next();
  });
};

app.get('/login', (req, res) => {
  res.send(`
    <h1>Форма входа</h1>
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Имя пользователя" required /><br/>
      <input type="password" name="password" placeholder="Пароль" required /><br/>
      <button type="submit">Войти</button>
    </form>
  `);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user: any = await User.findOne({ where: { username, password } });

  if (user) {
    const accessToken = generateAccessToken(user.username);
    const refreshToken = generateRefreshToken(user.username);

    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', path: '/refresh-token' });

    res.redirect('/resource');
  } else {
    res.redirect('/login');
  }
});

app.get('/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send('Asses denied, use localhost:3000/login');
  }

  jwt.verify(refreshToken, 'refresh-secret', (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send('Asses denied, use localhost:3000/login');
    }

    const username = decoded.username;
    const newAccessToken = generateAccessToken(username);
    const newRefreshToken = generateRefreshToken(username);

    redis.sadd('blacklist', refreshToken);

    res.cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'strict', path: '/refresh-token' });

    res.redirect('/resource');
  });
});

app.get('/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    redis.sadd('blacklist', refreshToken);
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.send('successful logout');
});

app.get('/resource', isAuthenticated, (req: RequestWithUserId, res) => {
  res.send(`RESOURCE: userID ${req.username}`);
});

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/404.html'));
});

app.listen(port, () => {
  console.log(`localhost:${port}`);
});