const state = {
    none: -1,
    standby: 0,
    launching: 1,
    analysing: 11,
    launchFail: 12,
    working: 2
}

const steps = {
    none: 0,
    where: 1,
    choose: 2,
    display: 3,
    loadingBonus: 41,
    bonus: 4,
    goodluck: 5,
    goodluckLoading: 51,
}

const audio = document.getElementById('appAudio')
const audioSource = audio.getElementsByTagName('source')[0]

audio.addEventListener('ended', function() {
    app.audioEnded = true
})


Vue.component('text-flow', {
    props: {
        texts: Array,
        maxCounter: Number,
        textClass: String,
        delay: Number,
        loop: Boolean
    },
    data: function () {
        return {
            counter: 0,
            intervalNum: -1,
            maxCounterLimit: 0
        }
    },
    methods: {
        counterAdder: function() {
            this.counter++
            console.log(this.counter)
            if (this.loop) {
                this.counter = this.counter % (this.maxCounterLimit + 1)
            } else if (this.counter > this.maxCounterLimit) {
                clearInterval(this.intervalNum)
                this.$emit('finish')
            }
        }
    },
    created: function () {
        if (!this.maxCounter) this.maxCounterLimit = this.texts.length
        else this.maxCounterLimit = this.maxCounter
        this.intervalNum = setInterval(this.counterAdder, this.delay)
        console.log(this, this.intervalNum)
    },
    template: `
        <ul>
            <li v-for="(text, index) in texts" v-bind:class="textClass" v-if="counter >= index + 1">{{text}}</li>
        </ul>
    `
})


const app = new Vue({
    el: '#app',
    data: {
        status: state.standby,
        lights: [false, true],
        // Main app
        whereAns: '',
        selectionAns: -1,
        bonusAns: -1,
        step: steps.none,
        // Where can i choose to go page
        whereDialogOn: false,
        whereTexts: ['W H E R E', 'CAN I', 'C H O O S E', 'TO GO'],
        // choose page
        chooseSelections: [{
            content: ['太空', '', '《2001太空漫游》'],
            voiceUrl: './static/src/audio/Space.wav'
        }, {
            content: ['梦境', '', '《2001太空漫游》'],
            voiceUrl: './static/src/audio/Dream.wav'
        }, {
            content: ['时间迷宫', '', '博尔赫斯'],
            voiceUrl: './static/src/audio/TimePuzzle.wav',
        }, {
            content: ['庆祝', '', '《为我庆祝》', '里尔克'],
            voiceUrl: './static/src/audio/Celebration.wav'
        }, {
            content: ['迷失', '', '后垮掉派诗歌'],
            voiceUrl: './static/src/audio/PostPoem.wav'
        }, {
            content: ['过去', '', '顾城'],
            voiceUrl: './static/src/audio/Kindergarden.m4a'
        }, {
            content: ['野外', '', '《昆虫记》', '法布尔'],
            voiceUrl: './static/src/audio/Insect.wav'
        }, {
            content: ['明天', '', '《解忧杂货铺》', '东野圭吾'],
            voiceUrl: './static/src/audio/Store.wav'
        }, {
            content: ['局外人', '', '《局外人》', '加缪'],
            voiceUrl: './static/src/audio/Outsider.wav'
        }],
        // display page
        displayBtnOn: false,
        audioEnded: false,
        // bonus page
        bonusBtnOn: false,
        bonus: [
            `孤单一条狗
            独行在夏日炎炎的
            人行道上
            仿佛拥有
            万神之力
            这是为什么？
            （布考斯基《狗》）`,
            `我们都会死去，所有人，多么荒谬！
            这种孤独的事实本应该让我们彼此相爱可是并没有。
            我们在琐事中变得恐惧平庸，我们被虚无蚕食了。
            (布考斯基)`,
            `人类总会选择最安全、最中庸的道路，群星就会变成遥不可及的梦幻。
            （艾萨克·阿西莫夫）`,
            `我们从未长大，也从未停止生长。
            （阿瑟·C·克拉克）`,
            `自由就是可以自由地說二加二等于四。如果这一点确定无疑，其他一切迎刃而解。
            《一九八四》`,
            `有很多事值得人为它而死，但爱是唯一值得让人为它而活的事。
            （克里斯多福·孟）`,
            `我有两次生命／一次还没有结束／一次刚刚开始
            (顾城)`,
            `把我的足迹／像图章印遍大地／世界也就溶进了／我的生命
            (顾城)`,
            `一切都有一个真正的开始
            (顾城)`,
            `我第一次敞开心胸，欣然接受这世界温柔的冷漠，体会到我与这份冷漠有多近似，简直亲如手足。
            加缪《局外人》`,
            `难解之题往往随着视角的转化不攻自破。
            （郑闻）`,
            `我第一次敞开心胸，欣然接受这世界温柔的冷漠，体会到我与这份冷漠有多近似，简直亲如手足。
            加缪《局外人》`,
            `难解之题往往随着视角的转化不攻自破。
            （郑闻）`,
            `对视频的热爱已经悄然进入人们的日常生活。在未来的某日，再次看到一幅摄于今日的图片中的自己，那曾是一个梦。
            1988年上海《新民晚报》`,
            `遵四时以叹逝，瞻万物而思纷……
            其始也，皆收视反听，耽思傍讯，
            精惊八极，心游万仞……
            （西晋诗人陆机）`,
            `赤条条来又赤条条去`,
            `万物生长、交叉纠缠、灰飞烟灭、生死轮回——无论是文明的残垣还是人类的思想。`,
            `不和谐以至针锋相对的矛盾也会有转向和谐的决定性一刻。`,
            `延续本身也可能是创造的开始。`,
            `赶紧做，埋头做，不管到底会做出什么。`,
            `先锋派也不过是在充满创造性地（再次）征用历史。`,
            `我们不会感到恐惧，因为还有明天。`,
            `明天何其多。`,
            `忘掉一切，从头再来。`,
            `趴在桌上小睡片刻，有舞者飘忽而过，趴在地上的小狗，是否也有南柯一梦。`,
            `怀疑让一切支离破碎，分崩离析。`,
            `夕阳无限好，明天还会有，无始亦无终。`,
            `你能去那儿。
            你想去那儿。
            你就去那儿。 
            还是要去那儿。
            你不能不去那儿。 
            你最终还是会去那儿。`,
            `“若要活，就要动”`,
            `因为我不停的运动，所以我才继续活着`,
            `既然回答不了那永恒的问题，就接近和融入到那永恒的自然中去吧！`,
            `飞转的陀螺。只有飞速旋转，它才能屹立不倒。这多像终日忙碌没事找事的我们。`,

        ],
        // good luck me page
        goodluckTexts: ['GOOD', 'LUCK', 'ME']
    },
    methods: {
        updateStatusTo: function (newStatus) {
            this.status = newStatus
        },
        voiceFail: function () {
            this.status = state.launchFail
        },
        voiceSucc: function () {
            this.status = state.working
            this.step = steps.where
        },
        updateLights: function (l1, l2) {
            this.lights = [l1 == true, l2 == true]
        },
        makeChoice: function (chooseIndex) {
            this.selectionAns = chooseIndex
            this.step = steps.display
        },
        nextStep: function (stepVal) {
            this.step = stepVal
        },
        playAudio: function (url) {
            while (!audio.paused) {
                audio.pause()
            }
            audioSource.src = url
            audio.load()
            audio.addEventListener('canplaythrough', function () {
                audio.play()
            })
        },
        replay: function () {
            audio.pause()
            audio.currentTime = 0
            audio.play()
        },
        pauseAudio: function () {
            audio.pause()
            audioSource.src = ''
        }
    },
    watch: {
        status: function (newStatus, oldStatus) {
            switch (newStatus) {
                case state.launching:
                    console.log('recording..')
                    startRecord()
                    break
                case state.standby:
                    console.log('stand by...')
                    break
                case state.working:
                    console.log('Working...')
                    this.whereAns = ''
                    this.selectionAns= -1
                    this.bonusAns = 0
                    this.whereDialogOn = false
                    this.whereAns = ''
                    this.displayBtnOn = false
                    this.bonusBtnOn = false
                    this.audioEnded = false
                    this.nextStep(steps.where)
            }
        },
        step: function (newStep, oldStep) {
            this.pauseAudio()

            switch (newStep) {
                case steps.where: break;
                case steps.choose: break;
                case steps.display: 
                    this.playAudio(this.chooseSelections[this.selectionAns].voiceUrl); 
                    break
                case steps.loadingBonus:
                    setTimeout(() => {
                        this.bonusAns = Math.floor(Math.random() * this.bonus.length)
                        this.nextStep(steps.bonus)
                    }, 1000);
                    break
                case steps.goodluckLoading:
                    setTimeout(() => {
                        this.nextStep(steps.goodluck)
                    }, 500);
                    break
            }
        }
    },
})
