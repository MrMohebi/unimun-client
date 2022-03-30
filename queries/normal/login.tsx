import React from "react";
import * as queryBuilder from "gql-query-builder";


export const SendVCodeQuery = (phoneNumber:string) => queryBuilder.mutation({
    operation: 'sendVCode',
    variables: {
        phone: {value: phoneNumber, required: true},
    },
    fields: ['status', 'message', 'errors', {data: ['vCode', 'isSignup']}]
})

export const VerifyVCode = (phoneNumber:string,vCode:string,referenceCode:string)=> queryBuilder.mutation({
    operation: 'verifyVCode',
    variables: {
        phone: {value: phoneNumber, required: true},
        vCode: {value: vCode, required: true},
        referenceCode: referenceCode
    },
    fields: ['status', 'message', {data: ['id', 'phone', 'token']}]
})
