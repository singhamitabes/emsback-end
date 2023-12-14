const mongoose = require("mongoose")
const Database = process.env.DATA_BASE

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect("mongodb+srv://singhamitabes:Y9yeoAmXlbX5kpgy@ems-db.q41wki8.mongodb.net/?retryWrites=true&w=majority")
            .then(() => console.log("db is connected"))
    } catch (error) {
        console.log(error)
    }
}

module.exports = dbConnect