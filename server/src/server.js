import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { isClass } from './types';
/** @import { Class, Guest, Session, User } from "./types" */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

const sessionCookieName = "session";
const sessionMaxAge = 7 * 24 * 60 * 60 * 1000;

/** @type {express.CookieOptions} */
const sessionCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: sessionMaxAge,
};

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Task Slayer Server is running' });
});

// AI Test Route (Person D)
import { generateMonsterData } from './services/aiService';
import { generateGuest, generateGuestWithId, getUserBySessionId } from './user';
import { getProfile } from './profile';
import data from './data';
app.post('/api/summon', async (req, res) => {
  const { description } = req.body;
  const monster = await generateMonsterData(description);
  res.json(monster);
});

app.get('/api/profile', async (req, res) => {
  const sessionId = req.cookies[sessionCookieName];
  if (sessionId !== undefined) {
    const foundUser = await getUserBySessionId(sessionId);
    if (foundUser) {
      res.json({
        result: "success",
        profile: getProfile(foundUser),
      });
    } else {
      const guest = await generateGuestWithId(sessionId)
      await data.addUser(guest);
      res.json({ result: "success", profile: getProfile(guest)});
      // res.json({ result: "session expired", profile: getProfile(guest)});
    }
  } else {
    const sessionId = req.headers['X-Guest-Id'];
    if (sessionId === undefined || Array.isArray(sessionId)) {
      res.json({ result: "not logged in" });
    } else {
      const guest = await generateGuestWithId(sessionId);
      await data.addUser(guest);
      res
        .cookie(sessionCookieName, guest.session.id, sessionCookieOptions)
        .json({ result: "success", profile: getProfile(guest)});
    }
    // const guest = await generateGuest();
    // await data.addUser(guest);
    //     console.log("None!");

    // res
    //   .cookie(sessionCookieName, guest.session.id, sessionCookieOptions)
    //   .json({ result: "success", profile: getProfile(guest)});
  }
});

app.post("/api/class", async (req, res) => {
  const class_ = req.body.class_;
  if (!isClass(class_)) {
    res.json({ result: "invalid class" });
    return;
  }
  const sessionId = req.cookies[sessionCookieName];
  if (sessionId !== undefined) {
    const foundUser = await getUserBySessionId(sessionId);
    if (foundUser !== undefined) {
      foundUser.class_ = class_;
      await data.updateUser(foundUser);
      res.json({ result: "success", profile: getProfile(foundUser) });
    } else {
      res.json({ result: "session expired" });
    }
  } else {
    const guest = await generateGuest();
    guest.class_ = class_;
    await data.addUser(guest);
    res
      .cookie(sessionCookieName, guest.session.id, sessionCookieOptions)
      .json({ result: "success", profile: getProfile(guest) });
  }
});

app.post("/api/monsters", async (req, res) => {
  const monsters = req.body.monsters;
  if (!Array.isArray(monsters)) {
    res.json({ result: "invalid monsters" });
    return;
  }
  const sessionId = req.cookies[sessionCookieName];
  if (sessionId !== undefined) {
    const foundUser = await getUserBySessionId(sessionId);
    if (foundUser !== undefined) {
      foundUser.monsters = monsters;
      await data.updateUser(foundUser);
      res.json({ result: "success", profile: getProfile(foundUser) });
    } else {
      res.json({ result: "session expired" });
    }
  } else {
    const guest = await generateGuest();
    guest.monsters = monsters;
    await data.addUser(guest);
    res
      .cookie(sessionCookieName, guest.session.id, sessionCookieOptions)
      .json({ result: "success", profile: getProfile(guest) });
  }
});

data.init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// if (process.env.MONGODB_URI === undefined) {
//   console.error("Expected 'MONGODB_URI' environment variable");
// } else {
//   mongoose.connect(process.env.MONGODB_URI)
//     .then(() => {
//       console.log("Connected to MongoDB Atlas");
//       app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//       });
//     })
//     .catch(err => {
//       console.error("MongoDB connection error:", err);
//     });
// }