export const CLEAR_USER_PROFIL_ID = (state) => {
    state.viewing_id = null
}

export const SET_USER_PROFIL_ID = (state, user_id) => {
    state.viewing_id = user_id
}
