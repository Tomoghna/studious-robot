import app from "./app.js";
import dotenv from "dotenv";
import { connectionDB } from "./db/db-connection.js";

dotenv.config();

const PORT = process.env.PORT;

connectionDB()
.then(() => {
    app.listen(PORT || 8000, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
})
.catch((error) => {
    console.error("Error connecting to DB", error);
});  