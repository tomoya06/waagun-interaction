const state = {
    'standby': 0,
    'launching': 1,
}

const app = new Vue({
    el: 'body',
    data: {
        status: state.standby
    }
})