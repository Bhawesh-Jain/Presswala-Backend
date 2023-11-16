const bcrypt = require('bcrypt');
const User = require('../models/User');

async function login(req, res) {
    res.status(200).header('Content-Type', 'text/json')

    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var phone = req.body.phone;
    var fcm_token = req.body.fcm_token;
    var city = req.body.city;
    var state = req.body.state;

    if (email && email.length > 0 && password && password.length > 0) {

        const user = await User.where({ email: email }).findOne();

        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    res.status(400).json({ "result": "true", "message": "Server Error" })
                } else {
                    if (result) {
                        const sanitizedUser = { ...user._doc, password: undefined };

                        res.json({
                            "result": "true",
                            "msg": "Login Successfull!",
                            data: sanitizedUser
                        })
                    }
                    else {
                        res.send(JSON.stringify({
                            "result": "false",
                            "msg": "Incorrect Password!"
                        }));
                    }
                }
            });
        } else {
            // Validate and sanitize inputs
            if (!name) name = "";
            if (!phone) phone = "";
            if (!fcm_token) fcm_token = "";
            if (!city) city = "";
            if (!state) state = "";

            const saltRounds = 10;

            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) {
                    console.error('Error generating salt:', err);
                    res.status(500).json({ "result": "false", "message": "Server Error" });
                } else {
                    bcrypt.hash(password, salt, async (err, hash) => {
                        if (err) {
                            console.error('Error hashing password:', err);
                            res.status(500).json({ "result": "false", "message": "Server Error" });
                        } else {
                            try {
                                const data = new User({
                                    email: email,
                                    password: hash,
                                    name: name,
                                    phone: phone,
                                    userType: "customer",
                                    FCM_TOKEN: fcm_token,
                                    createDate: new Date(),
                                    updateDate: new Date(),
                                    city: city,
                                    state: state,
                                });

                                const dataToSave = await data.save();
                                res.json({
                                    "result": "true",
                                    "msg": "New User Created",
                                    data: dataToSave
                                });
                            } catch (error) {
                                console.error('Error saving user to database', error);
                                res.status(400).json({ "result": "false", "message": "Server Error" });
                            }
                        }
                    });
                }
            });
        }

    } else {
        res.send(JSON.stringify({
            "result": "false",
            "msg": "Parameter Required email, password"
        }));
    }
}

async function getProfile(req, res) {
    res.status(200).header('Content-Type', 'text/json')

    var id = req.body.id;

    if (id && id.length > 0) {
        const user = await User.where({ _id: id }).findOne();
        const sanitizedUser = { ...user._doc, password: undefined };

        if (user) {
            res.json({
                "result": "true",
                "msg": "User Found!",
                data: sanitizedUser
            })
        } else {
            res.send(JSON.stringify({
                "result": "false",
                "msg": "User Not Found!"
            }));
        }
    } else {
        res.send(JSON.stringify({
            "result": "false",
            "msg": "Invalid Id"
        }));
    }
}


module.exports = { login, getProfile };