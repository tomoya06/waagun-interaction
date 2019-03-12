var rec = Recorder({
    type: 'wav'
})

const REC_PERIOD = 3

function startRecord() {
    rec.open(function() {
        rec.start()
        setTimeout(() => {
            rec.stop(function (blob) {
                _uploadBlob(blob)
                rec.close()
            }, function (msg) {
                _recFailCB(msg)
            })
        }, REC_PERIOD * 1000)
    })
}

function _uploadBlob(blob) {
    const url = 'http://localhost:3000/vtt'
    var fd = new FormData()
    fd.append('blob', blob)

    fetch(url, {
        body: fd,
        method: 'POST'
    }).then((res) => {
        _checkKeyword(res, _recSuccCB, _recFailCB)
    }).catch((err) => {
        _recFailCB(err)
    })
}

function _checkKeyword(str, successCB, failCB) {
    str.length == 5 ? successCB(): failCB()
    // TODO: implicit pinyin match
}

function _recSuccCB() {
    app.voiceSucc()
}

function _recFailCB(msg) {
    console.error(msg)
    app.voiceFail()
}