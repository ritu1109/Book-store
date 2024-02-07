import dotenv from "dotenv";
dotenv.config();
import  express  from "express";
const app = express();
const PORT = process.env.PORT || 3000;
// import fileUpload from "express-fileupload";

app.use(express.json());


//  ==========================    ROUTES     ===============================//


import  UserRoutes  from "./Routes/UserRoutes.js";
import  BookRoutes  from "./Routes/BookRoutes.js";
import Reply from "./Helpers/Reply.js";
app.use('/api/user', UserRoutes);
app.use('/api/book', BookRoutes);


//  ==========================    ROUTES END    ===============================//



app.get("/", (req, res) => {
  return res.json({ status: "Working" });
});

// Note: Make Sure this route is always in end
// 404 NOT FOUND 
app.all("*", function (req, res) {
  res.status(404).json(Reply.notfound()); 
});



app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});



