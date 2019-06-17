export const setTags = ({ commit }, tags) => {
    commit('SET_TAGS', tags)
}

export const clearTags = ({ commit }) => {
    commit('CLEAR_TAGS')
}