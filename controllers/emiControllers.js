const emiSchema = require('../models/EMI')

exports.addEMI = async function (req, res) {
    const { name, emiNo, date, contact, amount, numberOfEmis } = req.body
    const remainingEmis = numberOfEmis

    const parts = date.split('/');
    const yyyy = parts[2];
    const mm = parts[1];
    const dd = parts[0];
    const dateOfPurchase = yyyy + "-" + mm + "-" + dd
    const dueDates = nextDatesReverse(dateOfPurchase, numberOfEmis)
    const nextEmiDate = dueDates.pop()

    try {
        const newEmi = await emiSchema.create({
            name: name,
            contact: contact,
            dateOfPurchase: dateOfPurchase,
            dueDates: dueDates,
            nextEmiDate: nextEmiDate,
            emiNo: emiNo,
            amount: amount,
            numberOfEmis: numberOfEmis,
            remainingEmis: remainingEmis,
        })
        return res.status(200).send({
            message: "EMI created successfully",
            emi: newEmi
        })
    }
    catch (error) {
        return res.status(404).send({
            message: "Something went wrong",
            error: {
                name: error.name,
                message: error.message
            }
        })
    }
}

exports.payEMI = async function (req, res) {
    const { emiNo } = req.body
    const emi = await emiSchema.findOne({ emiNo: emiNo })
    if (emi) {

        emi.remainingEmis = emi.remainingEmis - 1
        if (emi.remainingEmis <= 0) {
            await emiSchema.deleteOne({ emiNo: emiNo })
            return res.status(200).send({
                message: "Successfully Paid & Customer EMIs completed"
            })
        }
        emi.nextEmiDate = emi.dueDates.pop()
        emi.save()
        return res.status(200).send({
            message: "Successfully Paid",
            emi
        })

    } else {
        return res.status(404).send({
            message: "EmiNo doesn't exist.",
        })
    }
}

exports.getEMIDetails = async function (req, res) {
    const emi = await emiSchema.findOne({ emiNo: req.body.emiNo })
    if (emi) {
        res.status(200).send({
            message: "EMINo Found",
            emi: emi
        })
    }
    else {
        res.status(404).send({
            message: "EMINo doesn't exists"
        })
    }
}

exports.getAllEMIDetails = async function (req, res) {
    const emi = await emiSchema.find()
    const count = emi.length
    /*if (emi) {
        res.status(200).send({
            message: `${count} records found`,
            emi: emi
        })
    }
    else {
        res.status(404).send({
            message: "EMINo doesn't exists"
        })
    }*/
    res.render('pages/allEMI', { emi: emi })
}

exports.upcomingEMIs = async function (req, res) {
    try {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const upcomingEmis = await emiSchema.find({
            nextEmiDate: {
                $gte: new Date().toISOString().slice(0, 10),
                $lte: nextWeek.toISOString().slice(0, 10),
            },
        }).sort('nextEmiDate');

        /*res.status(200).send({
            message: `${upcomingEmis.length} records found`,
            emis: upcomingEmis
        });
        */
        res.render('pages/upcoming', { emi: upcomingEmis })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

function nextDatesReverse(startDate, count) {
    const result = [];
    let currentDate = new Date(startDate);
    for (let i = 0; i < count; i++) {
        currentDate.setDate(currentDate.getDate() + 30);
        result.push(currentDate.toISOString().slice(0, 10));
    }
    return result.reverse();
}