var rec = Recorder({
    type: 'wav'
})

const LONG_PERIOD = 6
const SHORT_PERIOD = 5

let REC_PERIOD = LONG_PERIOD

window.alert('IT IS SHOWTIME!!!')

rec.open(function () {
    console.log("已打开");
}, function (e, isUserNotAllow) {
    console.log((isUserNotAllow ? "UserNotAllow，" : "") + "打开失败：" + e);
})

function startRecord() {
    if (rec) {
        rec.start()
        setTimeout(function () {
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
            if (json.result) {
                _recSuccCB()
            } else if (json.code == 10105) {
                const ipAddr = json.desc.replace(/\D+(\d+.\d+.\d+.\d+)/, '$1')
                window.alert(`Please Contact Your Developer To Add This IP Address Into Whitelist: ${ipAddr}`)
                app.updateStatusTo(state.standby)
            } else {
                throw new Error(json.desc)
            }
        }).catch((err) => {
            _recFailCB(err)
        })
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

function uploadWhere(where) {
    fetch(`http://localhost:3000/where?where=${where}`)
}