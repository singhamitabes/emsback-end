const express = require("express")
var cors = require('cors')

const dbConnect = require("./DbConnect/dbConnect")

const PORT =process.env.PORT || 4000
dbConnect()
const app = express()

// Serve static files from the 'public' directory
app.use('/public', express.static('public'));


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}))                  
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use("/ems", require('./Route/route') )

app.listen(PORT,()=>console.log(`server is start on ${PORT}`))