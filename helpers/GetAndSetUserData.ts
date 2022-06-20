import {gql, useLazyQuery} from "@apollo/client";
import {getUserQuery} from "../Requests/normal/user";
import {useEffect} from "react";


export function getAndSetUserData() {


    let a = () => {
        const [getUser, {
            data,
            loading
        }] = useLazyQuery(gql`${getUserQuery(['id', 'name', 'created_at', 'phone', 'referenceCode','username','bio','level','xpLevelPercentage']).query}`)

        getUser().then((value) => {
            console.log(value)
        })
    }


    console.log('are')
    return a

}

