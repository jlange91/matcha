export const setVisibility = ({ commit }, visibility) => {
    commit('SET_VISIBILITY', visibility)
}

export const setSuccess = ({ commit }, success) => {
    commit('SET_SUCCESS', success)
}

export const setMessage = ({ commit }, message) => {
    commit('SET_MESSAGE', message)
}

export const clearMessage = ({ commit }) => {
    commit('CLEAR_MESSAGE')
}