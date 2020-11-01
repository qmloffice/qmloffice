const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const KEYS = require('./keys')

// set cookie base on this user
passport.serializeUser((user, done) => {

    console.log(`passport.serializeUser111`);

    console.log(user);

    let sessionUser = {
        _id: user.refreshToken,
        refreshToken: user.refreshToken,
        accessToken: user.accesstoken,
        name: user.name,
        pic_url: user.pic_url,
        email: user.email
    }

    done(null, sessionUser)

})

// get cookie & get relevent session data
passport.deserializeUser((sessionUser, done) => {

    console.log(`passport.deserializeUser`);
    done(null, sessionUser) // now can access request.user
})


passport.use(
    // google login
    new GoogleStrategy(
        // google keys
        {
            clientID: KEYS.googleOauth.clientID,
            clientSecret: KEYS.googleOauth.clientSecret,
            callbackURL: KEYS.googleOauth.callback,
            passReqToCallback: true,
            proxy: true

        }, (request, accessToken, refreshToken, profile, done) => {

            console.log(`passport.use(new GoogleStrategy(`);

            //save data in session
            user = {
                "refreshToken": refreshToken,
                "accesstoken": accessToken,
                'googleID': profile.id,
                'name': profile.displayName,
                'pic_url': profile._json.picture,
                'email': profile._json.email
            };

            console.log(profile)
            done(null, user)
        }
    )
)