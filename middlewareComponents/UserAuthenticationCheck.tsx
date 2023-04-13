import React, {useEffect, useState} from "react";
import {getId, getToken, setId, setToken} from "../helpers/TokenHelper";
import {UserId, UserToken} from "../store/user";
import {useRouter} from "next/router";

const UserAuthenticationCheck = ({children}: any) => {

    const render = useState(false);
    const router = useRouter();
    const {token, id} = router.query;

    useEffect(() => {
        render[1](true);
        if (token && id) {

            UserToken(token as string);
            setToken(token as string);
            UserId(id as string);
            setId(id as string);
            alert("به عنوان کاربر وارد شدید.");
            return;
        }
        if (UserToken()) {
            setToken(UserToken());
        }
        if (getToken().length) {
            UserToken(getToken());
        }
        if (UserId()) {
            setId(UserId());
        }
        if (getId().length) {
            UserId(getId());
        }
    }, [router.query]);
    return (
        render[0] ?
            children
            : null
    );
};

export default UserAuthenticationCheck;