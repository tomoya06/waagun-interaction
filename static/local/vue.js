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
        status: state.working,
        lights: [false, true],
        // Main app
        whereAns: '',
        selectionAns: -1,
        bonusAns: -1,
        step: steps.loadingBonus,
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
        // bonus page
        bonusBtnOn: false,
        bonus: [
            `孤单一条狗
            独行在夏日炎炎的
            人行道上
            仿佛拥有
            万神之力
            这是为什么？
            （《狗》，布考斯基）`.split('\n')
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
            if (audio.paused) {
                audio.play()
            } else {
                audio.pause()
            }
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
                    this.nextStep(steps.where)
            }
        },
        step: function (newStep, oldStep) {
            if (oldStep == steps.display) {
                this.pauseAudio()
            }

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
