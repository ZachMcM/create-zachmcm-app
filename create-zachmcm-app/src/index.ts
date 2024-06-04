import "dotenv/config"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser";

const port = process.env.PORT || 8000

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "200mb" }));
app.use(bodyParser.text({ limit: "200mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
    thanks: "Thanks for using create-zachmcm-app!",
    rate: "Please give this repo a star if you like it!"
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})