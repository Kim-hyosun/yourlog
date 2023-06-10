require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

// import api from './api';

//비구조할당으로 process.env내부 값에 대한 레퍼런스 만들기
const { MONGO_URI } = process.env;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.error(e);
  });

export { Koa, Router, bodyParser };
