import { createStore } from 'redux'
import { actionConstants } from './constants';

const initialState = {
    sidebarShow: 'responsive',
    language: 'English',
    language_data: [],
}

export const reducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case actionConstants.SET_SIDEBAR:
            return {
                ...state,
                sidebarShow: payload
            }
        case actionConstants.SET_LANGUAGE:
            return {
                ...state,
                language: payload
            }
        case actionConstants.SET_LANGUAGEDATA:
            return {
                ...state,
                language_data: payload
            }
        default:
            return state
    }
}

export const getCurrentLanugage = (state) => {
    return state.language;
}

export const getCurrentSidebarShow = (state) => {
    return state.sidebarShow;
}

export const getLanguageData = (state) => {
    return state.language_data;
}