const express = require("express")
const router = express.Router()

const { createEmpData, getEmployee, adminCount, employeeCount, salary, employeeLogin, getAdminDetails, deleteEmployee, adminLogin, dashboard, verifyUser, getEmpDetailsId, updateEmpDetailsId } = require("../Controller/controller")
const uploadMiddleware = require('../FileuploadMiddleware/UploadMiddleware')

router.route("/employeeCount").get(employeeCount)
router.route("/salary").get(salary)
router.route("/adminCount").get(adminCount)


router.route("/createemp").post(uploadMiddleware.single('image'), createEmpData)
router.route('/delete/:id').delete(deleteEmployee)

router.route("/getEmployee").get(getEmployee)
router.route("/getAdminDetails").get(getAdminDetails)

router.route("/adminLogin").post(adminLogin)
// router.route("/dashboard").get(dashboard)
router.route("/dashboard").get(verifyUser, dashboard)


router.route("/employeelogin").post(employeeLogin)
router.route("/get/:id").get(verifyUser, getEmpDetailsId)
router.route("/getforEdit/:id").get(getEmpDetailsId)

router.route("/update/:id").put(updateEmpDetailsId)


module.exports = router