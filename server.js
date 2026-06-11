require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const verifyJWT = require('./middleware/verifyJWT')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/auth', require('./routes/authRoutes'))

// Protected Route
app.get('/protected', verifyJWT, (req, res) => {
    res.json({
        message: `Welcome ${req.user}`
    })
})

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

mongoose.connection.once('open', () => {
    console.log('MongoDB Connected')

    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`)
    })
})

mongoose.connection.on('error', err => {
    console.log(err)
})