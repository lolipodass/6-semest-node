import passport from "passport";
import { BasicStrategy } from "passport-http";
import users, { User } from "./users";

passport.use(new BasicStrategy(
    (usr: string, pwd: string, done) => {
        try {
            const user = users.find(user => user.username === usr);

            if (!user) return done(null, false);
            if (user?.password !== pwd) return done(null, false);

            return done(null, user);
        } catch (err) {
            done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: User, done) => {
    const userF = users.find(user => user?.username === user?.username);
    done(null, userF);
});

export default passport;