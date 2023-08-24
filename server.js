const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const dbconnection = require("./config/dbconnection");
const User = require("./models/models");
const bcrypt = require('bcryptjs');

dbconnection();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json("hi from server")
});

app.post('/signup', async(req, res) => {
    const { firstName, lastName, email, password } = req.body;
   
    if (!(firstName && lastName && email && password)) {
        res.json("all feilds mandatory!");
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName, lastName, email, password: hashedPassword
        })
        const token = jwt.sign(
            { id: user._id },
            'asdfgasdfgqwerty',//secret code
            {
                expiresIn: "2h"
            }
        );
        user.token = token;
        user.password = undefined;
        res.status(201).json(user);
    }
    else {
        res.status(400).json("email already registrerd, please try new Email");
    }

})
app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const existedUser = await User.findOne({ email });
        if (existedUser.email !== email) {
            res.json("Email does not exist, Please Register!");
        }
        else {
            var isMatched = await bcrypt.compare(password, existedUser.password);
            if (existedUser && isMatched) {
                const token = jwt.sign(
                    {id: existedUser._id },
                    'asdfgasdfgqwerty',//secret code
                    {
                        expiresIn: "2h"
                    }
                );
                existedUser.token = token
                existedUser.password = undefined;

                //cookies section 
                const options = {
                    expires: new Date(Date.now() + 24 * 3 * 60 * 60 * 1000),//upto 3 dAYS
                    httpOnly: true
                };//object
                res.status(200).cookie(token, token, options).json({ success: true, existedUser });
            }
            else {
                res.status(400).json("Wrong password");
            }
        }
    }
    else {
        res.status(400).json("Please Enter all the data")
    }
    app.get('/logout', () => {

    })
});
app.listen(3456, () => {
    console.log(`server is running on http://localhost:3456`)
});
