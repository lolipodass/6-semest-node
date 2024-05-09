import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AbilityBuilder, defineAbility } from '@casl/ability';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
const prisma = new PrismaClient();

interface RequestWithUserId extends Request {
  user?: string;
}

const generateAccessToken = (id: number) => {
  return jwt.sign({ id }, 'access-secret', { expiresIn: '10m' });
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req: RequestWithUserId, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) return next();

    jwt.verify(accessToken, 'access-secret', async (err: any, decoded: any) => {
      if (err) {
        res.clearCookie('accessToken');
        return res.status(401).send('Неаутентифицированный доступ');
      }
      const id = parseInt(decoded.id);
      const user = await prisma.users.findUnique({ where: { id } });
      if (!user) return res.status(401).send('Неаутентифицированный доступ');

      req.user = user;
      next();
    });
  } catch (error) {
    next();
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    res.status(err.status || 500).json({ error: err.message });
  } else {
    next();
  }
});

const checkAbility = (action: string, subject: string, params: string = "") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ability = (req as any).ability;
    const { id } = req.params;
    //  console.log(ability.can(action, subject));


    if ((subject !== 'user' && action === 'update')
      || (action === 'create' && subject === 'Commit')) {
      const repo = await prisma.repos.findUnique({
        where: { id: parseInt(id) },
        select: {
          authorId: true,
        },
      });

      if (ability.can(action, subject, String(repo?.authorId))) {
        return next();
      } else {
        return res.status(403).send('Доступ запрещен');
      }
    }

    if (ability.can(action, subject, id)) {
      return next();
    } else {
      return res.status(403).send('Доступ запрещен');
    }
  };
};

app.use((req: RequestWithUserId, res, next) => {
  const user: any = req.user;
  const ability = defineAbility((can, cannot) => {

    if (user?.role === 'guest' || user === undefined) {
      can('read', 'Commit');
      can('read', 'Repo');
      can('read', 'Ability');
    }
    else if (user.role === 'user') {
      can('read', 'Commit');
      can('read', 'user', String(user.id));
      can('read', 'Repo');
      can('read', 'Ability');
      can('create', 'Repo');
      can('create', 'Commit', String(user.id));
      can('update', 'Repo', String(user.id));
      can('update', 'Commit', String(user.id));
    }
    else if (user.role === 'admin') {
      can("manage", "all");
      //  can('read', 'Commit');
      //  can('read', 'allUsers');
      //  can('read', 'Repo');
      //  can('read', 'Ability');
      //  can('manage', 'Repo');
      //  can('manage', 'Commit');
    }
  });

  (req as any).ability = ability;
  next();
});

app.get('/api/ability', checkAbility('read', 'Ability'), (req, res) => {
  res.json(JSON.stringify((req as any).ability));
});

app.get('/register', (req, res) => {
  res.send(`
       <h1>Форма регистрации</h1>
       <form action="/register" method="POST">
         <input type="text" name="username" placeholder="Имя пользователя" required /><br/>
         <input type="email" name="email" placeholder="Email" required /><br/>
         <input type="password" name="password" placeholder="Пароль" required /><br/>
         <button type="submit">Зарегистрироваться</button>
       </form>
    `);
});

app.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await prisma.users.create({
      data: { username, email, password, role: 'user' },
    });
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user });
  } catch (error) {
    next(error);
  }
});

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

app.post('/login', async (req: RequestWithUserId, res) => {
  const { username, password } = req.body;

  const user: any = await prisma.users.findUnique({ where: { username, password } });

  if (user) {
    req.user = user;
    const accessToken = generateAccessToken(user.id);

    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict' });

    res.redirect(`/api/user/${user.id}`);
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.send('Выход из системы успешно выполнен');
});

app.get('/api/user', checkAbility('read', 'allUsers'), async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.get('/api/user/:id', checkAbility('read', 'user'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.get('/api/repos', checkAbility('read', 'Repo'), async (req, res, next) => {
  try {
    const repos = await prisma.repos.findMany({
      select: {
        id: true,
        name: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });
    res.json(repos);
  } catch (error) {
    next(error);
  }
});

app.get('/api/repos/:id', checkAbility('read', 'Repo'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const repo = await prisma.repos.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!repo) {
      return res.status(404).json({ message: 'Репозиторий не найден' });
    }
    res.json(repo);
  } catch (error) {
    next(error);
  }
});

app.post('/api/repos', checkAbility('create', 'Repo'), async (req: RequestWithUserId, res, next) => {
  try {
    const { name } = req.body;
    const authorId = (req.user as any).id;
    const repo = await prisma.repos.create({
      data: { name, authorId },
    });
    res.status(201).json({ message: 'Репозиторий успешно создан', repo });
  } catch (error) {
    next(error);
  }
});

app.put('/api/repos/:id', checkAbility('update', 'Repo'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const repo = await prisma.repos.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json({ message: 'Информация об репозитории успешно обновлена', repo });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/repos/:id', checkAbility('manage', 'Repo'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.repos.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Репозиторий успешно удален' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/repos/:id/commits', checkAbility('read', 'Commit'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const commits = await prisma.commits.findMany({
      where: { repoId: parseInt(id) },
      select: {
        id: true,
        message: true,
      },
    });
    res.json(commits);
  } catch (error) {
    next(error);
  }
});

app.get('/api/repos/:id/commits/:commitId', checkAbility('read', 'Commit'), async (req, res, next) => {
  try {
    const { id, commitId } = req.params;
    const commit = await prisma.commits.findUnique({
      where: { id: parseInt(commitId), repoId: parseInt(id) },
      select: {
        id: true,
        message: true,
      },
    });
    if (!commit) {
      return res.status(404).json({ message: 'Коммит не найден' });
    }
    res.json(commit);
  } catch (error) {
    next(error);
  }
});

app.post('/api/repos/:id/commits/', checkAbility('create', 'Commit'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const commit = await prisma.commits.create({
      data: { message, repoId: parseInt(id) },
    });
    res.status(201).json({ message: 'Коммит успешно создан', commit });
  } catch (error) {
    next(error);
  }
});

app.put('/api/repos/:id/commits/:commitId', checkAbility('update', 'Commit'), async (req, res, next) => {
  try {
    const { id, commitId } = req.params;
    const { message } = req.body;
    const commit = await prisma.commits.update({
      where: { id: parseInt(commitId), repoId: parseInt(id) },
      data: { message },
    });
    res.json({ message: 'Информация о коммите успешно обновлена', commit });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/repos/:id/commits/:commitId', checkAbility('manage', 'Commit'), async (req, res, next) => {
  try {
    const { id, commitId } = req.params;
    await prisma.commits.delete({
      where: { id: parseInt(commitId), repoId: parseInt(id) },
    });
    res.json({ message: 'Коммит успешно удален' });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).send('Страница не найдена');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});