import "dotenv/config"
import express from "express"
import cors from "cors"
import multer from "multer"
const port = process.env.PORT || 8000

const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer()
app.use(upload.any())

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