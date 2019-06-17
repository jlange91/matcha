export const CLEAR_TAGS = ({state}) => {
    state.tags = null
}

export const SET_TAGS = ({state}, tags) => {
    state.tags = tags
}
