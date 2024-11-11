import ExpressBrute from "express-brute";
import MongooseStore from "express-brute-mongoose";
import mongoose from "mongoose";

const bruteForceSchema = new mongoose.Schema({
    _id: String,
    data: {
        count: Number,
        lastRequest: Date,
        firstRequest: Date
    },
    expires: { type: Date, index: { expires: '1d' } }
});

const BruteForceModel = mongoose.model("bruteforce", bruteForceSchema);
const store = new MongooseStore(BruteForceModel);

export const bruteForce = new ExpressBrute(store, {
    freeRetries: 4,
    minWait: 5 * 60 * 1000,
    maxWait: 60 * 60 * 1000,
    lifetime: 24 * 60 * 60,
    // minWait: 2 * 60 * 1000,
    // maxWait: 2 * 60 * 1000,
    // lifetime: 2 * 60 * 1000,
    failCallback: function (req, res, next, nextValidRequestDate) {
        res.status(429).json({
            message: "Too many login attempts. Please try again later.",
            nextValidRequestDate: nextValidRequestDate,
            minutesUntilNextTry: Math.ceil((nextValidRequestDate - new Date()) / 1000 / 60)
        });
    }
});

export const resetBruteForce = async (req, res, next) => {
    try {
        const key = req.ip;
        await BruteForceModel.findByIdAndDelete(key);
        next();
    } catch (error) {
        console.error('Error resetting brute force:', error);
        next();
    }
};