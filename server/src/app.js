import express from "express"
import cookieParser from 'cookie-parser';
import cors from "cors"

const app = express() ;

app.use(cors(
{
    origin: [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:3000",
    
      // add production url 
    ],
    credentials: true,
    // methods: ["GET", "POST"],
    // allowedHeaders: ["Content-Type" , "Authorization"]
}
)); 

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Something went wrong"
    });
});

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,     
    limit: "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser()) 


export {app}

