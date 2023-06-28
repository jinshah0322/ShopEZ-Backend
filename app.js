require("dotenv").config()
const express = require("express")
const dbConnect = require("./db/dbConnect")
const notFound = require("./middlewares/notFound")
const errorHandler = require("./middlewares/errorHandler")
const authRoutes = require("./routes/authRoutes")

const app = express()

app.use(express.json())

app.use("/api/v1/user",authRoutes)


app.use(notFound)
app.use(errorHandler)

const start = async ()=>{
    await dbConnect(process.env.MONGO_URI)
    app.listen(process.env.PORT,()=>{
        console.log(`Server is listening on PORT: ${process.env.PORT}`);
    })
}

start()