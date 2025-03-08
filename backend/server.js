import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/database.js'

config()

connectDB()

const app = express()

app.use(express.json())

app.use(cors())

app.use(express.urlencoded({ extended: false }));

app.post('/api/v1/sign-up', signupController)
app.post('/api/v1/login-with-otp', loginOtpController);
app.post('/api/v1/login-with-password', loginPasswordController)
app.post('/api/v1/verify-otp', verifyOtpController)

app.listen(port, () => {
    console.log(`Server running in port ${port}.`)
})