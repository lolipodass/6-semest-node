import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import { Sequelize, Model, DataTypes } from 'sequelize';
import Redis, { print } from 'ioredis';
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
  return res.send(`
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

  if (!username || !password) {
    return res.status(401).send('Asses denied, use localhost:3000/login');
  }

  const user: any = await User.findOne({ where: { username, password } });

  if (user) {
    const accessToken = generateAccessToken(user.username);
    const refreshToken = generateRefreshToken(user.username);

    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', path: '/refresh-token' });

    return res.redirect('/resource');
  } else {
    return res.redirect('/login');
  }
});

app.get('/refresh-token', (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).send('Asses denied, use localhost:3000/login');
    }

    console.log(refreshToken)

    jwt.verify(refreshToken, 'refresh-secret', (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send('Asses denied, use localhost:3000/login');
      }


      redis.lrange('blacklist', 0, -1, async (err, replies) => {

        if (!replies) {
          console.error('No replies received from Redis');
          return res.status(500).send('Internal server error');
        }

        const isBlacklisted = replies.includes(refreshToken);
        if (isBlacklisted) {
          return res.status(401).send('Asses denied, use localhost:3000/login');
        }


        const username = decoded.username;
        const newAccessToken = generateAccessToken(username);
        const newRefreshToken = generateRefreshToken(username);

        redis.lpush('blacklist', refreshToken);

        res.cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: 'strict' });
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'strict', path: '/refresh-token' });

        return res.redirect('/resource');
      });
    });
  }
  catch (err) {
    console.error(err);
  }
}
);

app.get('/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    redis.set('blacklist', refreshToken);
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return res.send('successful logout');
});

app.get('/resource', isAuthenticated, (req: RequestWithUserId, res) => {
  return res.send(`RESOURCE: userID ${req.username}`);
});

app.get('*', (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname + '/404.html'));
});

app.listen(port, () => {
  console.log(`localhost:${port}`);
});