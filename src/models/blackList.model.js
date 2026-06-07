const mongoose = require("mongoose");

const tokenBlackListSchema = new mongoose.Schema({
    token: {
        type: String,
        require: [true, "Token is requried to blacklist."],
        unique: [true, "Token is alrady blacklisted."]
    },
    blacklistAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {
    timestamps: true
})


tokenBlackListSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 60 * 60 * 24 * 3 //3 days
})


const tokenBlackListModel = mongoose.model("tokenBlackList", tokenBlackListSchema);


module.exports = tokenBlackListModel;