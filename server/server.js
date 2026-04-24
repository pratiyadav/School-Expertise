import express from 'express';
import cors from 'cors';

const app = express();

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

app.use(express.json());

// api route 


app.get("/message", (req, res) => {
  res.json({message : "Hello from backend of school expertise"})
})

const PORT = 3000; 

app.listen(3000, () => {
  console.log("Server running");
});
