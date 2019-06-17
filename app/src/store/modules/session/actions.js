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