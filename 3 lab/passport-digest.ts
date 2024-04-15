import passport from "passport";
import { DigestStrategy } from "passport-http";
import users, { User } from "./users";


passport.use(new DigestStrategy(
    (usr: string, done) => {
        try {
            const user = users.find(user => user.username === usr);

            if (!user) return done(null, false);

            return done(null, user, user.password);
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