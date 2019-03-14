const express = require('express')
const path = require('path')
const multer = require('multer')
const fs = require('fs')

const Xunfei = require('xunfeisdk')
const { IATEngineType, IATAueType } = Xunfei

const xfClient = new Xunfei.Client('5c763be5')
xfClient.IATAppKey = '403a89a11868cdc6644e25e7c520e3b0'

const app = express()
const port = 3000

const testResult = false

const storage = multer.diskStorage({
    destination: 'voice',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.wav`)
    }
})

const upload = multer({
    storage
})

async function voice2text(filename) {
    const voiceFile = fs.readFileSync(filename)
    try {
        const result = await xfClient.IAT(voiceFile, IATEngineType.SMS16K_Mandarin, IATAueType.RAW)
        return [true, result]
    } catch (error) {
        return [false, error]
    }
}

app.use('/static', express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => {
    res.sendfile(path.resolve(__dirname, 'index.html'))
})

app.post('/vtt', upload.single('blob'), async (req, res) => {
    const [status, msg] = await voice2text(req.file.path)
    console.log(msg)
    if (status) {
        _checkKeyword(msg.data, function() {
            res.json({ result: true, ...msg })
        }, function() {
            res.json({ result: testResult, ...msg })
            deleteFile(req.file.path)
        })
    } else {
        res.json({ result: testResult, ...msg })
        deleteFile(req.file.path)
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


function _checkKeyword(str, successCB, failCB) {
    if (!str) {
        return failCB()
    }
    if (str.indexOf('有') > -1 || str.indexOf('无') > -1) {
        successCB()
    } else {
        failCB()
    }
}

function deleteFile(path) {
    fs.unlinkSync(path)
}