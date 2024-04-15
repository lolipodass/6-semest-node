import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import session from 'express-session';
import client_secret from "./client_secret.json"
import path from 'path';

const app = express();

passport.use(new GoogleStrategy({
    clientID: client_secret.web.client_id as string,
    clientSecret: client_secret.web.client_secret as string,
    callbackURL: client_secret.web.redirect_uris[0] as string
},
    (accessToken, refreshToken, profile, done) => {
        done(null, profile);
    }
));

declare global {
    namespace Express {
        interface User extends Profile { } // Объявляем тип User, расширяя его до типа Profile
    }
}

app.use(session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done: (err: any, id?: any) => void) => {
    done(null, user);
});

passport.deserializeUser((obj, done: (err: any, id?: any) => void) => {
    done(null, obj);
});



app.get('/login', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/resource');
    });

app.get('/logout', (req, res) => {
    req.logout((er) => console.log(er));
    res.redirect('/login');
});

app.get('/resource', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`RESOURCE: User ID is ${req.user.id}, User name is ${req.user.displayName}`);
    } else {
        res.redirect('/login');
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/404.html'));
});


app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
