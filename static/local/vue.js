const state = {
    none: -1,
    standby: 0,
    launching: 1,
    working: 2
}

const steps = {
    none: 0,
    where: 1,
    choose: 2,
    display: 3
}

const bonus = [
    
]

const app = new Vue({
    el: '#app',
    data: {
        status: state.none,
        // choose page
        lights: [false, true],
        // Where can i choose to go page
        wcindex: -1,
        wcInterval: 0,
        sectionStorage: {
            where: '',
            selection: 0,
            bonus: ''
        },
        chooseSelections: [{
            title: '',
            content: '',
            voiceUrl: '',
        }, {
            title: '',
            content: '',
            voiceUrl: ''
        }],
        step: steps.none
    },
    methods: {
        reset2standby: function() {
            this.status = state.standby
        },
        updateStatusTo: function(newStatus) {
            this.status = newStatus
        },
        voiceFail: function() {

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
        makeChoice: function(index) {

        },
        nextStep: function(stepVal) {
            this.step = stepVal
        }
    },
    watch: {
        status: function(newStatus, oldStatus) {
            if (newStatus == state.launching && oldStatus == state.standby) {
                // TODO: launch voice recognition
                console.log('recording..')
                startRecord()
            } else if (newStatus == state.standby) {
                console.log('stand by...')
            } else if (newStatus == state.working) {
                console.log('Working...')
            }
        },
        step: function(newStep, oldStep) {
            switch (newStep) {
                case steps.where: app.wcCounting(); break;
            }
        }
    },
})
