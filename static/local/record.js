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
    _startUploadCB()
    const url = 'http://localhost:3000/vtt'
    var fd = new FormData()
    fd.append('blob', blob)

    fetch(url, {
        body: fd,
        method: 'POST'
    }).then((res) => res.json())
    .then((json) => {
        _checkKeyword(json.data, _recSuccCB, _recFailCB)
    }).catch((err) => {
        _recFailCB(err)
    })
}

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

function _startUploadCB() {
    app.updateStatusTo(state.analysing)
}

function _recSuccCB() {
    app.voiceSucc()
}

function _recFailCB(msg) {
    console.error(msg)
    app.voiceFail()
}