const mongoose = require("mongoose")

const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    role: {
        type: String,
        required: true,
      },
    image: {
        type: String,
        // required: true,
    },
});


module.exports = mongoose.model("EmployeeList", employeeSchema)