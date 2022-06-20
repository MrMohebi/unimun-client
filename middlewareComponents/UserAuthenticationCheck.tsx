import React, {useEffect, useState} from 'react';
import {getId, getToken, setId, setToken} from "../helpers/TokenHelper";
import {UserId, UserToken} from "../store/user";

const UserAuthenticationCheck = ({children}: any) => {

    const render = useState(false)
    useEffect(() => {
        render[1](true)
        if (UserToken()) {
            setToken(UserToken())
        }
        if (getToken().length) {
            UserToken(getToken())
        }
        if (UserId()) {
            setId(UserId())
        }
        if (getId().length) {
            UserId(getId())
        }
    })
    return (
        render[0] ?
            children
            : null
    );
};

export default UserAuthenticationCheck;