export const SET_VISIBILITY = (state, visibility) => {
    state.visible = visibility
}

export const SET_SUCCESS = (state, success) => {
    state.success = success
}

export const SET_MESSAGE = (state, message) => {
    state.message = message
}

export const CLEAR_MESSAGE = (state) => {
    state.message = ""
}