import { http } from './components/index';
import express from 'express';

const { Server } = http;
const PORT = 3000;
const app = express();

const server = new Server(app, { PORT, autoHandle: true });



