const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {

    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password required'
        })
    }

    const duplicate = await User.findOne({ username })

    if (duplicate) {
        return res.status(409).json({
            message: 'User already exists'
        })
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const user = await User.create({
        username,
        password: hashedPwd
    })

    res.status(201).json({
        message: `New user ${user.username} created`
    })
}

const loginUser = async (req, res) => {

    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password required'
        })
    }

    const foundUser = await User.findOne({ username })

    if (!foundUser) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

    const match = await bcrypt.compare(
        password,
        foundUser.password
    )

    if (match) {

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '1d'
            }
        )

        res.json({
            accessToken
        })

    } else {
        res.status(401).json({
            message: 'Unauthorized'
        })
    }
}

module.exports = {
    registerUser,
    loginUser
}