export const storeInSession = (key, value) =>{
    return sessionStorage.setItem(key, value);
}

export const lookIn = (key) => {
    return sessionStorage.getItem(key)
}

export const removeSession = (key) =>{
    return sessionStorage.removeItem(key)
}

export const logOut = () => {
    sessionStorage.clear()
}
