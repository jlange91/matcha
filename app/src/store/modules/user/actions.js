export const setData = ({ commit }, data) => {
    commit('SET_DATA', data)
}

export const clearData = ({ commit }) => {
    commit('CLEAR_DATA')
}