var rec = Recorder({
    type: 'wav'
});
rec.open(function () {
    rec.start();
    setTimeout(function () {
        rec.stop(function (blob, duration) {
            uploadBlob(blob)
            console.log(blob.size, blob.type, duration)
            rec.close();
        }, function (msg) {
            console.log("录音失败:" + msg);
        });
    }, 3000);
}, function (msg) {
    console.log("无法录音:" + msg);
});

function uploadBlob(blob) {
    const url = 'http://localhost:3000/vtt'
    var fd = new FormData()
    fd.append('blob', blob)

    fetch(url, {
        body: fd,
        method: 'POST'
    }).then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err)
    })
}