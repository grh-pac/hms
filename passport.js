





// passport.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Doctor = require('./models/doctor');
const Patient = require('./models/patient');
const Admin = require('./models/admin');

module.exports = function(passport) {
    // Doctor Local Strategy
    passport.use('doctor', new LocalStrategy(
        { usernameField: 'email' },
        async function(email, password, done) {
            try {
                const doctor = await Doctor.findOne({ email: email });

                if (!doctor) {
                    return done(null, false, { message: 'Incorrect email.' });
                }

                bcrypt.compare(password, doctor.password, function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    if (res) {
                        return done(null, doctor);
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                });
            } catch (err) {
                return done(err);
            }
        }
    ));

    // Patient Local Strategy
    passport.use('patient', new LocalStrategy(
        { usernameField: 'email' },
        async function(email, password, done) {
            try {
                const patient = await Patient.findOne({ email: email });

                if (!patient) {
                    return done(null, false, { message: 'Incorrect email.' });
                }

                bcrypt.compare(password, patient.password, function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    if (res) {
                        return done(null, patient);
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                });
            } catch (err) {
                return done(err);
            }
        }
    ));

    // Admin Local Strategy
    passport.use('admin', new LocalStrategy(
        { usernameField: 'username' },
        async function(username, password, done) {
            try {
                const admin = await Admin.findOne({ username: username });

                if (!admin) {
                    return done(null, false, { message: 'Incorrect username.' });
                }

                bcrypt.compare(password, admin.password, function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    if (res) {
                        return done(null, admin);
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                });
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser(function(user, done) {
        let serializedUser = {
            id: user._id,
            type: user.constructor.modelName
        };
        done(null, serializedUser);
    });

    passport.deserializeUser(async function(serializedUser, done) {
        try {
            let user;

            switch (serializedUser.type) {
                case 'Doctor':
                    user = await Doctor.findById(serializedUser.id);
                    break;
                case 'Patient':
                    user = await Patient.findById(serializedUser.id);
                    break;
                case 'Admin':
                    user = await Admin.findById(serializedUser.id);
                    break;
                default:
                    throw new Error('Invalid user type');
            }

            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.ensureAuthenticated = function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    };

    return passport;
};
