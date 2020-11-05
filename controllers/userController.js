const { promisify } = require('util')
const User = require("../modals/user");
const express = require("express");
const jwt = require('jsonwebtoken')


exports.getUser = async (req, res) => {
    try {
        //  const users = await User.find().sort('-created_on');
        let user = req.user;
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "failure",
            error: err,
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
      //  console.log(err)
        if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate user
            return res.status(422).send({ status: "Failue", message: 'User already exist!' });
        }
        else if (err.errors) {
            return res.status(422).send({ status: "Failue", message: err.message });
        }
        res.status(500).send(err);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email + " loginn.. " + password)

    if (!email || !password) {
        console.log("no email or pwd..");
        res.status(200).json({
            status: "Failue",
            message: `Please enter ${!email ? 'email':'password'}`
        });
    }
    else {
        try {
            console.log("awaiting result..")
            const user = await User.findOne({ email, password });
            console.log(user);
            if (user) {
                console.log("if")
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '7d'
                });
                res.status(200).json({
                    status: "success",
                    token
                });
            }
            else {
                console.log("else")
                res.status(401).json({
                    status: "Failure",
                    message: "user name or password doesn't match"
                });
            }

        } catch (err) {
            console.log("err " + err)
            res.status(500).send({
                status: "failure",
                error: err,
            });
        }
    }
}

exports.protectRoute = async (req, res, next) => {
    try {
        console.log(req.headers);
        const token = req.headers.authorization;
        console.log(`token is ${token}`);


        if (!token) {
            console.log("sending 401");

            res.status(401).json({
                status: "Authentication error",
                message: "please login to proceed"
            });
        } else {
            try {
                const tokenObj = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
                console.log("id is " + JSON.stringify(tokenObj.id));
                const user = await User.findById(tokenObj.id);
                if (user) {
                    req.user = user;
                    console.log("calling next function")
                    next();
                } else {
                    res.status(401).send({
                        status: "Authentication error",
                        message: "Please login"
                    });
                }
            } catch (exp) {
                res.status(401).send({
                    status: "Authentication error",
                    error: exp,
                    message: "Please login"
                });
            }
        }

    } catch (err) {
        res.status(500).send({
            status: "failure",
            error: err,
        });
    }

}
