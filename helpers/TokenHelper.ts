const TOKEN_KEY = 'UNIMUN_USER_TOKEN_1'
const ID_KEY = 'UNIMUN_USER_ID_1'
export const setToken = (token: string) => {
    window.localStorage.setItem(TOKEN_KEY, token)
}
export const getToken = () => {
    return window.localStorage.getItem(TOKEN_KEY) ?? ""
}
export const setId = (token: string) => {
    window.localStorage.setItem(ID_KEY, token)
}
export const getId = () => {
    return window.localStorage.getItem(ID_KEY) ?? ""
}
export const removeToken = () => {
    removeId()
    return window.localStorage.removeItem(TOKEN_KEY)
}
export const removeId = () => {
    return window.localStorage.removeItem(ID_KEY)
}