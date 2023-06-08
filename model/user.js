const mongoose = require("mongoose");
/**
 * use the schema property of moogoose
 */
const Schema = mongoose.Schema;

/**
 * Define the Schmma and its Type with default value if we have
 */

const userSchma = new Schema({
    fullName: {type:String,default:null},
    phone: { type: Number,default:null },
    email: {type:String,default:null},
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() }
})

module.exports = mongoose.model("User", userSchma)