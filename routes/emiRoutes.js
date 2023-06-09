const express = require("express")
const { addEMI, payEMI, getEMIDetails, getAllEMIDetails, upcomingEMIs, completedEMIs } = require("../controllers/emiControllers")

const router = express.Router()

router.route("/addEMI").post(addEMI)

router.route("/payEMI").post(payEMI)

router.route("/getEMIDetails").post(getEMIDetails)

router.route("/upcomingEMIs").get(upcomingEMIs)

router.route("/getAllEMIDetails").get(getAllEMIDetails)

router.route("/completedEMIs").get(completedEMIs)

module.exports = router;