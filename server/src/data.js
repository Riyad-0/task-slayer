import mongoose from "mongoose";
import dataFile from "./dataFile";
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
      throw "uh oh";
    }
  }
}

/**
 * @param {User} user
 */
async function addUser(user) {
  switch (env) {
    case "local": {
      dataFile.addUser(user);
      break;
    }
    case "remote": {
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
      dataFile.updateUser(user);
      break;
    }
    case "remote": {
      break;
    }
  }
}

const data = {
  getUsers,
  addUser,
  updateUser,
};

export default data;