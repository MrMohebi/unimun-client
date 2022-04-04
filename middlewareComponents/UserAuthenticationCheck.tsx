import React, {useEffect, useState} from 'react';
import {getToken} from "../helpers/TokenHelper";
import {UserToken} from "../store/user";

const UserAuthenticationCheck = ({children}: any) => {

    const render = useState(false)
    useEffect(() => {
        render[1](true)
        if (getToken().length) {
            UserToken(getToken())
        }
    })
    return (
        render[0] ?
            children
            : null
    );
};

export default UserAuthenticationCheck;