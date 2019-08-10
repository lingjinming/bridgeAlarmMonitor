import Vue from 'vue'
import Vuex from 'vuex'
import vm from '@/main'
Vue.use(Vuex)

const state = { //要设置的全局访问的state对象，要设置的初始属性值,即所谓的状态
    userName: '',
    userId: '',
    role: '',
    maxSize: 10485760,
    appTempUrl: 'http://60.174.207.208:21000/', //外网
    // appTempUrl:'http://10.5.4.115:8000/',//内网
    appTempURLForJq: 'http://60.174.207.208:21000/bridge/bridgeService/', //外网jq
    // appTempURLForJq:'http://10.5.4.115:8000/bridge/bridgeService/',//内网jq
    supportType: ['bmp', 'jpg', 'jpeg', 'png', 'pdf', 'word', 'doc', 'docx', 'pages', 'xls', 'xlsx'],
    totleList: null,
    isCare: null,
    listIndex: null,
    listLength: '',
    isCareLength: ''
};
const getters = { //实时监听state值的变化(最新状态)//方法名随意,主要是来承载变化的showFooter的值
    totleListInfo(state) {
        return state.totleList
    },
    isCareInfo(state) {
        return state.isCare
    },
    isSupportType(state) {
        return state.supportType
    },
    getUserName(state) {
        return state.userName
    },
    getUserId(state) {
        return state.userId
    },
    getUserRole(state) {
        return state.role
    },
    isLeader(state) {
        if (state.userName == '2c9381c46ab405ed016ab5440dcd04eb') {
            return true
        } else {
            return false
        }
    },
    getMaxSize(state) {
        return state.maxSize
    },
    getAppTempUrl(state) {
        return state.appTempUrl
    },
    getAppTempUrlForJq(state) {
        return state.appTempURLForJq
    },

};
const mutations = { //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
    getConcernList(state, bridgename) {
        vm.$axios({
            method: 'post',
            url: 'getCareBridgeIndex.mvc',
            params: {
                "userName": vm.common.getUserName(),
                "isSet": true,
                "bridgename": bridgename || ''
            }
        }).then((res) => {
            state.totleList = res.data.data
            console.log(state.totleList)
            state.totleList.forEach(function(item) {
                state.listIndex.push(item.index)
            })
            Storage.set('tempList', state.totleList);

            state.isCare = state.totleList.filter(function(item) {
                return item.bridges[0].isCare == 1
            })
            state.listLength = state.totleList.length
            state.isCareLength = state.isCare.length

            // this.$vux.loading.hide()
        }).catch((err) => {
            console.log('error', err)
        })
    },
    changeRole(state, role) {
        state.role = role
    },
    changeRoleName(state, userName) {
        state.userName = userName
    },
    changeRoleId(state, userId) {
        state.userId = userId
    }
};
const actions = { //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性，num为要变化的形参

    beginGetTotleList(context) {
        context.commit('getConcernList')
    }

};

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})