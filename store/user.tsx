import React from 'react';
import {makeVar} from "@apollo/client";

export const IsLoggedIn = makeVar<boolean>(false)
export const UserToken = makeVar<string>("")

