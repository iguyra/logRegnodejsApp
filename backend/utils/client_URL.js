const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });


let URL = "process.env" + process.env; 
if (process.env.NODE_ENV === "development") {
    URL = "http://127.0.0.1:3000"
} else{
    URL =  "https://isavefrontend1.vercel.app"
}
module.exports = URL