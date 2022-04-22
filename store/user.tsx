import React from 'react';
import {makeVar} from "@apollo/client";

export const UserToken = makeVar<string>("1")
export const UserPhone = makeVar<string>("")
export const UserData = makeVar({} as {
    username: string,
    name: string,
    phone: string,
    bio: string,
})

