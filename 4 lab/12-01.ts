import express, { NextFunction, Request, Response } from "express";
import session from 'express-session';
import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import path from "path";

const app = express();
const port = 3012;

interface User {
  username: string,
  password: string
}

app.use(session(
  {
    secret: 'popa',
    resave: false,
    saveUninitialized: false
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

const users: User[] = require('./credentials.json');

passport.use(new localStrategy((username, password, done) => {
  const user = users.find((user: any) => user.username == username && user.password == password);
  if (user) {
    return done(null, user);
  } else {

    return done(null, false, { message: 'Неверные учетные данные' });
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.username);
});

passport.deserializeUser((username: string, done) => {
  const user = users.find((user: User) => user.username === username);
  done(null, user);
});

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('Asses denied, use localhost:3000/login');
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

app.post('/login', passport.authenticate('local',
  {
    successRedirect: '/resource',
    failureRedirect: '/login'
  }));

// Маршрут для выхода из системы
app.get('/logout', (req, res) => {
  req.logout((err) => console.log(err));
  res.redirect('/login');
});

// Маршрут для отображения ресурса
app.get('/resource', isAuthenticated, (req, res) => {
  console.log(req.user);
  res.send(`RESOURCE<br/>
  Пользователь: ${JSON.stringify(req.user)}`);
});

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + '/404.html'));
});

// Запуск сервера
app.listen(port, () => {
  console.log(`localhost:${port}`);
});