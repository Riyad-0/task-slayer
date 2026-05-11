import mongoose from 'mongoose';
// /** @import { User as LocalUser } from "./types" */

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sessionCreated: { type: Number, required: true },
  hp: { type: Number, required: true },
  xp: { type: Number, required: true },
  class_: { type: String, enum: ["Warrior", "Scholar", "Bard", "Monk"], required: true },
  monsters: { type: Array, default: [], required: true },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

// /**
//  * 
//  * @param {LocalUser} user 
//  * @returns {User}
//  */
// function toDbUser(user) {
  
// }

// /**
//  * 
//  * @param {User} user 
//  * @returns {LocalUser}
//  */
// function fromDbUser(user) {
//   const u = user.find();
//     u.all().then(a => {
//       const g = a[0]
//   });
// }