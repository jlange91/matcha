import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import messages from './modules/messages/index'
import session from './modules/session/index'
import profil from './modules/profil/index'
import tags from './modules/tags/index'

// import state from './state'
// import * as getters from './getters'
// import * as actions from './actions'
// import * as mutations from './mutations'

const store = () => {
    return new Vuex.Store({
        // state,
        // actions,
        // getters,
        // mutations,
        modules: {
            messages,
            session,
            profil, 
            tags
        }
    })
} 

export default store