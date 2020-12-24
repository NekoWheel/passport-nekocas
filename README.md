# passport-nekocas
[Passport](http://passportjs.org/) strategy for authenticating with [NekoCAS](https://github.com/NekoWheel/NekoCAS)

## Install
```bash
$ npm install passport-nekocas
```

## Usage
Configure Strategy:
```javascript
const NekocasStrategy = require('passport-nekocas').Strategy

passport.use(new NekocasStrategy({
  serviceBaseURL: 'http://localhost',
  secret: 'vNOZpKdqnUYcztBjUhvvPLpeYCIIBVev',
  domain: 'https://cas.n3ko.co'
}, function (user, done) {
  models.User.findOrCreate({
    where: {
      email: user.email
    }
  }).spread(function (user) {
    if (!user) return done(null, false)
    return done(null, user)
  }).catch(function (err) {
    return done(err)
  })
}))
```
Authenticate Requests:
```javascript
passport.authenticate('nekocas', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/',
    failureFlash: 'Failed to login.'
})(req, res, next)
```