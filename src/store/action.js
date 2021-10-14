import {actionConstants} from './constants';

export const setLanguage = (value) => {
    return {
        type: actionConstants.SET_LANGUAGE,
        payload: value
    }
}

export const setSidebarShow = (value) => {
    return {
        type: actionConstants.SET_SIDEBAR,
        payload: value
    }
}

export const setLanguageData = (value) => {
    return {
        type: actionConstants.SET_LANGUAGEDATA,
        payload: value
    }
}