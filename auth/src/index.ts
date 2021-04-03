const express = require('express');
import 'express-async-errors';
import {json} from 'body-parser';
const mongoose = require('mongoose');
const cookieSession =  require('cookie-session');

import {currentUserRouter} from './routes/current-user';
import {signinRouter} from './routes/signin';
import {signoutRouter} from './routes/signout';
import {signupRouter} from './routes/signup';
import { errorHandler } from "./middlewares/error-handlers";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req,res,next) => {
    throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {

    if(!process.env.JWT_KEY) {
        throw new Error("JWT_KEY not found");
    }

    try{
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("connected to mongodb")
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log("Listening on 3000")
    })
}

start();