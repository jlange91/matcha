export const setUserProfilId = ({ commit }, user_id) => {
    commit('SET_USER_PROFIL_ID', user_id)
}

export const clearUserProfilId = ({ commit }) => {
    commit('CLEAR_USER_PROFIL_ID')
}