const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'This email is invalid').isEmail(),
        check('password', 'The password should have at least 6 characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            console.log('Body: ', req.body)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Something is incorrect'
                })
            }
            const {email, password} = req.body
            const candidate = await User.findOne({ email })
            if (candidate) {
                return res.status(400).json({ message: 'This email is already used' })
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({ email, password: hashedPassword })
            await user.save()
            res.status(201).json({ message: 'User is registered' })
        } catch (e) {
            res.status(500).json({ message: 'Ooops, something went wrong. Please try again' })
        }
    }
)

// /api/auth/login
router.post('/login',
    [
        check('email', 'Email is not that').normalizeEmail().isEmail(),
        check('password', 'Password goes here').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Something is incorrect'
                })
            }
            const {email, password} = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: 'User is not found' })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ message: 'This password is incorrect' })
            }
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            res.json({ token, userId: user.id })
        } catch (e) {
            res.status(500).json({ message: 'Ooops, something went wrong. Please try again' })
        }
    }
)

module.exports = router