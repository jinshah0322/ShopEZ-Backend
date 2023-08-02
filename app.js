require("dotenv").config()
const express = require("express")
const dbConnect = require("./db/dbConnect")
const notFound = require("./middlewares/notFound")
const errorHandler = require("./middlewares/errorHandler")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/authRoutes")
const productRoutes = require('./routes/productRoute')
const morgan = require("morgan")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

app.use("/api/v1/user",authRoutes)
app.use("/api/v1/product",productRoutes)

app.use(notFound)
app.use(errorHandler)

const start = async ()=>{
    await dbConnect(process.env.MONGO_URI)
    app.listen(process.env.PORT,()=>{
        console.log(`Server is listening on PORT: ${process.env.PORT}`);
    })
}

start()