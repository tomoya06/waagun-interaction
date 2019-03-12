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
    display: 3
}

const audio = document.getElementById('appAudio')
const audioSource = audio.getElementsByTagName('source')[0]


Vue.component('text-flow', {
    props: {
        texts: Array,
        maxCounter: Number,
        textClass: String,
    },
    data: {
        counter: -1,
        intervalNum: -1,
    },
    created: function() {
        const self = this
        this.intervalNum = setInterval(() => {
            self.counter++
            if (self.counter >= self.maxCounter) {
                clearInterval(self.intervalNum)
                self.$emit('finish')
            }
        }, 1000);
    },
    template: `
        <ul>
            <li v-for="(text. index) in texts" v-bind:class="textClass" v-if="counter >= index">{{text}}</li>
        </ul>
    `
})


const app = new Vue({
    el: '#app',
    data: {
        status: state.working,
        lights: [false, true],
        // Main app
        sectionStorage: {
            where: '',
            selection: -1,
            bonus: ''
        },
        step: steps.where,
        // Where can i choose to go page
        wcindex: 5,
        wcInterval: 0,
        whereTexts: ['W H E R E', 'CAN I', 'C H O O S E', 'TO GO'],
        // choose page
        chooseSelections: [{
            title: '利己',
            content: '啥的哈克大家都哈韩的卡暗杀上课的哈健康的哈韩的卡大师的看哈的卡号ask等哈数据库的哈克的阿斯顿库哈斯的卡号看安康等哈就快点哈大大阿卡莎健康的哈克觉得啊是多久啊滑动卡顿啊啊的空间啥的',
            voiceUrl: './static/src/audio/TimePuzzle.mp3',
        }, {
            title: '白日夢',
            content: '',
            voiceUrl: ''
        }, {
            title: '人間噩旅',
            content: '',
            voiceUrl: ''
        }, {
            title: '莫比烏斯之帶',
            content: '',
            voiceUrl: ''
        }],
        // bonus page
        bonus: [{
            text: '',
            by: '',
        }, {
            text: '',
            by: '',
        }],
        chosenBonusIndex: -1,
    },
    methods: {
        updateStatusTo: function(newStatus) {
            this.status = newStatus
        },
        voiceFail: function() {
            this.status = state.launchFail
        },
        voiceSucc: function() {
            this.status = state.working
            this.step = steps.where
        },
        updateLights: function(l1, l2) {
            this.lights = [l1==true, l2==true]
        },
        clearSectionStorage: function() {
            this.sectionStorage.where = ''
            this.sectionStorage.selection = ''
            this.sectionStorage.bonus = ''
        },
        wcCounting: function() {
            this.wcInterval = setInterval(function() {
                app.wcindex += 1
                if (app.wcindex == 10) {
                    clearInterval(app.wcInterval)
                }
            }, 1000);
        },
        makeChoice: function(chooseIndex) {
            this.sectionStorage.selection = chooseIndex
            this.step = steps.display
        },
        nextStep: function(stepVal) {
            this.step = stepVal
        },
        playAudio: function(url) {
            while (!audio.paused) {
                audio.pause()
            }
            audioSource.src = url
            audio.load()
            audio.addEventListener('canplaythrough', function() {
                audio.play()
            })
        },
        pauseAudio: function() {
            if (audio.paused) {
                audio.play()
            } else {
                audio.pause()
            }
        }
    },
    watch: {
        status: function(newStatus, oldStatus) {
            if (newStatus == state.launching) {
                // TODO: launch voice recognition
                console.log('recording..')
                startRecord()
            } else if (newStatus == state.standby) {
                console.log('stand by...')
            } else if (newStatus == state.working) {
                console.log('Working...')
                this.chosenBonusIndex = Math.floor(Math.random() * this.bonus.length)
            }
        },
        step: function(newStep, oldStep) {
            if (oldStep == steps.display) {
                this.pauseAudio()
            }
            
            switch (newStep) {
                case steps.where: app.wcCounting(); break;
                case steps.choose: break;
                case steps.display: this.playAudio(this.chooseSelections[this.sectionStorage.selection].voiceUrl); break;
            }
        }
    },
})
