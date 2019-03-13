var rec = Recorder({
    type: 'wav'
})

const REC_PERIOD = 3

window.alert('Please Allow This Page to Get Access of Your Microphone. \nAnd Then It\'s Showtime.')

rec.open(function () {
    console.log("已打开");
}, function (e, isUserNotAllow) {
    console.log((isUserNotAllow ? "UserNotAllow，" : "") + "打开失败：" + e);
})

function startRecord() {
    if (rec) {
        rec.start()
        setTimeout(function() {
            rec.stop(function (blob) {
                _uploadBlob(blob)
            }, function (msg) {
                _recFailCB(msg)
            })
        }, REC_PERIOD * 1000)
    }
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
            if (json.code == 10105) {
                const ipAddr = json.desc.replace(/\D+(\d+.\d+.\d+.\d+)/, '$1')
                window.alert(`Please Contact Your Developer To Add This IP Address Into Whitelist: ${ipAddr}`)
                app.updateStatusTo(state.standby)
            } else {
                _checkKeyword(json.data, _recSuccCB, _recFailCB)
            }
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