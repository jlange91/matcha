export const setSession = ({ commit }, session) => {
    commit('SET_SESSION', session)
}

export const clearSession = ({ commit }) => {
    commit('CLEAR_SESSION')
}

export const setExp = ({ commit }) => {
    commit('SET_EXP')
}

export const setUser = ({ commit }, user) => {
    commit('SET_USER', user)
}

export const clearUser = ({ commit }) => {
    commit('CLEAR_USER')
}

export const setSocket = ({ commit }) => {
    commit('SET_SOCKET')
}

export const unsetSocket = ({ commit }) => {
    commit('UNSET_SOCKET')
}
