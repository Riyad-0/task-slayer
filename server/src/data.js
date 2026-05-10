import mongoose from "mongoose";
import dataFile from "./dataFile";
import { User as DbUser } from "./models/User";
/** @import { User } from "./types" */

/** @type {"local" | "remote"} */
let env = "remote";

async function init() {
  if (process.env.LOCAL_DATA === "true") {
    env = "local";
  } else {
    env = "remote";
    if (process.env.MONGODB_URI === undefined) {
      console.error("Expected 'MONGODB_URI' environment variable");
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("Connected to MongoDB Atlas");
      })
      .catch(err => {
        console.error("MongoDB connection error:", err);
      });
  }
}

/**
 * @returns {Promise<User[]>}
 */
async function getUsers() {
  switch (env) {
    case "local": {
      return await dataFile.getUsers();
    }
    case "remote": {
      return (await DbUser.find()).map(dbUser => {
        return {
          session: {
            id: dbUser._id,
            created: dbUser.sessionCreated,
          },
          class_: dbUser.class_,
          monsters: dbUser.monsters,
        };
      });
    }
  }
}

/**
 * @param {User} user
 */
async function addUser(user) {
  switch (env) {
    case "local": {
      await dataFile.addUser(user);
      break;
    }
    case "remote": {
      await DbUser.insertOne({
        _id: user.session.id,
        sessionCreated: user.session.created,
        class_: user.class_,
        monsters: user.monsters,
      });
      break;
    }
  }
}

/**
 * @param {User} user
 */
async function updateUser(user) {
  switch (env) {
    case "local": {
      await dataFile.updateUser(user);
      break;
    }
    case "remote": {
      await DbUser.updateOne(user, {
        _id: user.session.id,
        sessionCreated: user.session.created,
        class_: user.class_,
        monsters: user.monsters,
      });
      break;
    }
  }
}

const data = {
  init,
  getUsers,
  addUser,
  updateUser,
};

export default data;