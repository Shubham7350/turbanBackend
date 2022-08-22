const express = require('express')
const actions = require('../methods/actions')
const { FileRoute } = require('../methods/Files/FileRoute')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})

//@desc Adding new user
//@route POST /adduser
// router.post('/adduser', actions.addNew)
router.post('/signUp', actions.addNew)

//@desc Authenticate a user
//@route POST /authenticate
router.post('/authenticate', actions.authenticate)

//@desc Get info on a user
//@route GET /getinfo
router.get('/getinfo', actions.getinfo)

router.use("/files", FileRoute)

module.exports = router
