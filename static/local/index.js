(function () {
    /**
     * 屏幕保护
     */
    var count = 0;
    var outTime = 1;//分钟
    window.setInterval(go, 1000);
    function go() {
        count++;
        if (count == outTime * 60) {
            app.updateStatusTo(state.standby)
        }
    }
    var x;
    var y;

    //监听鼠标
    document.onmousemove = function () {
        count = 0;
    };
    //监听键盘
    document.onkeydown = function () {
        count = 0;
    };

    /**
     * 指示灯闪烁
     */
    setInterval(() => {
        let l1 = Math.round(Math.random())
        let l2 = Math.round(Math.random())
        app.updateLights(l1, l2)
    }, 200);

    // app.voiceSucc()
})()