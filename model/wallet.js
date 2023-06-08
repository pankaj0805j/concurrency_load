const mongoose = require("mongoose");
/**
 * use the schema property of moogoose
 */
const Schema = mongoose.Schema;

/**
 * Define the Schmma and its Type with default value if we have
 */

const walletSchma = new Schema({
    userId: {type:Schema.Types.ObjectId,default:null},
    amount: { type: Number,default:null },
    consistent: {type:Boolean,default:false},
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() }
})

module.exports = mongoose.model("Wallet", walletSchma)