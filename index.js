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
        // console.log(result)
        return [true, result]
    } catch (error) {
        // console.log(error)
        return [false, error]
    }
}

app.use('/static', express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => {
    res.sendfile(path.resolve(__dirname, 'index.html'))
})

app.post('/vtt', upload.single('blob'), async (req, res) => {
    console.log('receive new blob')
    const [status, msg] = await voice2text(req.file.path)
    if (status) {
        res.json(msg)
    } else {
        res.status(403).send(null)
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})