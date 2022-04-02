import React from "react";

const TOKEN_KEY = 'UNIMUN_USER_TOKEN_1'
export const setToken = (token: string) => {
    window.localStorage.setItem(TOKEN_KEY, token)
}
export const getToken = () => {
    return window.localStorage.getItem(TOKEN_KEY)??""
}
export const removeToken = () => {
    return window.localStorage.removeItem(TOKEN_KEY)
}