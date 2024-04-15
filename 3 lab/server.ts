import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import path from "path";
import passport from "./passport-basic";
import passportDigest from "./passport-digest";

const app = express();
const port: number = 3011;
let IsUserLogout: boolean = false;

app.use(express.static('static'));
app.use(session({
    secret: 'pipapopa',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passportDigest.initialize());
app.use(passportDigest.session());

// Базовая аутентификация
app.get('/loginb',
    (req: Request, res: Response, next: NextFunction) => {
        if (req.headers.authorization && IsUserLogout) {
            IsUserLogout = false;
            delete req.headers.authorization;
        }
        next();
    }, passport.authenticate('basic', { session: true, successRedirect: '/resource' }),
);

app.get('/logoutb', (req: Request, res: Response) => {
    req.logOut((err) => { });
    res.status(200).clearCookie('connect.sid', {
        path: '/'
    });
    IsUserLogout = true;
    res.redirect('/');
});

// Digest аутентификация
app.get('/logind',
    (req: Request, res: Response, next: NextFunction) => {
        if (req.headers.authorization && IsUserLogout) {
            IsUserLogout = false;
            delete req.headers.authorization;
        }
        next();
    }, passportDigest.authenticate('digest', { session: true, successRedirect: '/resource' }),
);

app.get('/logoutd', (req: Request, res: Response) => {
    req.logOut((err) => { });
    res.clearCookie('connect.sid', {
        path: '/'
    });
    IsUserLogout = true;
    res.redirect('/');
});

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.get('/resource', (req: Request, res: Response) => {
    if (req.user) {
        res.send("RESOURCE")
        return;
    } else {
        res.redirect('/logind');
    }
});

app.get('/user', (req: Request, res: Response) => {
    res.json(req.user === undefined ? {} : req.user);
})

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname + '/static/404.html'));
});

app.listen(port, () => {
    console.log(`Server started: localhost:${port}`)
});