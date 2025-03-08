import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import { createServer } from 'http'
import { connectDB } from './config/database.js'
import { signupController } from './controllers/signup.controller.js'
import { loginOtpController, loginPasswordController, verifyOtpController } from './controllers/login.controller.js'
import { createProject, fetchProjects, addCollaborator, removeCollaborator } from './controllers/project.controller.js'
import { createDocument, getDocument, updateDocument, getUserDocuments, addComment, getComments } from './controllers/document.controller.js'
import { setupWebSocket } from './websocket.js'

config()

connectDB()

const app = express()
const server = createServer(app)

// Set up WebSocket server
setupWebSocket(server)

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT

app.post('/api/v1/signup', signupController)
app.post('/api/v1/login-with-otp', loginOtpController);
app.post('/api/v1/login-with-password', loginPasswordController)
app.post('/api/v1/verify-otp', verifyOtpController)

// Project routes
app.post("/api/v1/create-project", createProject);
app.post("/api/v1/fetch-projects", fetchProjects);
app.post("/api/v1/add-collaborator", addCollaborator);
app.post("/api/v1/remove-collaborator", removeCollaborator);

// Document routes
app.post('/api/v1/create-document', createDocument);
app.post('/api/v1/get-document', getDocument);
app.post('/api/v1/update-document', updateDocument);
app.post('/api/v1/get-user-documents', getUserDocuments);
app.post('/api/v1/add-comment', addComment);
app.post('/api/v1/get-comments', getComments);

server.listen(port, () => {
    console.log(`Server running in port ${port}.`)
})