export const SET_SESSION = (state, token) => {
    state.logged = true
    state.token = token
}

export const SET_SOCKET = (state) => {
  state.socket = true;
}

export const UNSET_SOCKET = (state) => {
  state.socket = false;
}

export const CLEAR_SESSION = (state) => {
    state.logged = false
    state.token = ""
    state.exp = ""
}

export const SET_EXP = (state, exp) => {
    state.exp = exp
}

export const SET_USER = (state, user) => {
    state.user = user
}

export const CLEAR_USER = (state) => {
    state.user = {
        id: null,
        username: null,
        email: null,
        last_name: null,
        first_name: null,
        avatar: null,
        spam: null
    }
}
