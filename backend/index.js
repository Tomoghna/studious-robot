import app from "./app.js";
import dotenv from "dotenv";
import { db } from "./configs/firebase.js";

dotenv.config({
    path: './env'
});

app.get("/", (req, res) => {
    res.send("API is running....");
});


const PORT = process.env.PORT || 8000;

db.collection("test").get()
    .then(() => {
        app.listen(PORT || 8000, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to Firestore:", error);
    }
);  
