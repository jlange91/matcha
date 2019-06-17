export const setUserProfil = ({ commit }, profil) => {
    commit('SET_USER_PROFIL', profil)
}

export const clearUserProfil = ({ commit }) => {
    commit('CLEAR_USER_PROFIL')
}

export const setUserLocation = ({ commit }, location) => {
    commit('SET_USER_LOCATION', location)
}

export const clearUserLocation = ({ commit }) => {
    commit('CLEAR_USER_LOCATION')
}