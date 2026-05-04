import express from 'express';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import usersDb from './db/users.js';

// passport

const verify = (username, password, done) => {
  usersDb.findByUsername(username, (err, user) => {
      if (err) {return done(err)}
      if (!user) { return done(null, false) }

      if( !usersDb.verifyPassword(user, password)) {
          return done(null, false)
      }

      return done(null, user)
  })
}

const options = {
  usernameField: "username",
  passwordField: "password",
}

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser( (id, cb) => {
  usersDb.findById(id,  (err, user) => {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

// express

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(session({ secret: 'SECRET'}));
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.redirect('/api/user/login');
});

app.get('/api/user/login', (req, res) => {
    res.render('login');
});

app.post('/api/user/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err);}

        if (!user) {
            return res.render('signup', {
                username: req.body.username,
                password: req.body.password
            })
        }

        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.redirect('/api/user/me');
        });
    })(req, res, next)
});

app.post('/api/user/signup', (req, res, next) => {
  const { username, password, email } = req.body

  usersDb.findByUsername(username, (err, existingUser) => {
    if (err) return next(err)

    if (existingUser) {
      return res.send('User already exists')
    }

    usersDb.createUser({ username, password, email }, (err, newUser) => {
      if (err) return next(err)

      req.logIn(newUser, (err) => {
        if (err) return next(err)
        return res.redirect('/api/user/me')
      })
    })
  })
})


app.get('/api/user/me',
    (req, res, next) => {
        console.log('Accessing /api/user/me. Req.isAuthenticated(): ', req.isAuthenticated());
        if (!req.isAuthenticated()) {
            console.log('User is not authenticated. Redirecting to login page.');
            return res.redirect('/api/user/login');
        }
        next()
    },
    (req, res) => {
        console.log('User is authenticated. Rendering user info page. Req.user: ', req.user);
        res.render('me', { user: req.user })
    }
);

app.get('/api/user/logout',  (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/api/user/login');
    });
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});