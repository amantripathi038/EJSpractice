const mongoose = require("mongoose");

const eSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"]
    },
    emiNo: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    dateOfPurchase: {
        type: String
    },
    dueDates: [{
        type: String
    }],
    nextEmiDate: {
        type: String
    },
    amount: {
        type: Number
    },
    numberOfEmis: {
        type: Number
    },
    remainingEmis: {
        type: Number
    },
    contact: {
        type: Number,
        required: [true, "Please Enter Your Contact Nummber"]
    },
})

const emiSchema = mongoose.model("EMIs", eSchema);

emiSchema.ensureIndexes()
module.exports = emiSchema