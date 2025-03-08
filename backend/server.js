import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/database.js'
import { signupController } from './controllers/signup.controller.js'
import { loginOtpController, loginPasswordController, verifyOtpController } from './controllers/login.controller.js'
import { createProject,fetchProjects } from './controllers/project.controller.js'

config()

connectDB()

const app = express()

app.use(express.json())

app.use(cors())

app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT

app.post('/api/v1/signup', signupController)
app.post('/api/v1/login-with-otp', loginOtpController);
app.post('/api/v1/login-with-password', loginPasswordController)
app.post('/api/v1/verify-otp', verifyOtpController)
app.post("/api/v1/create-project", createProject);
app.post("/api/v1/fetch-projects", fetchProjects);

app.listen(port, () => {
    console.log(`Server running in port ${port}.`)
})