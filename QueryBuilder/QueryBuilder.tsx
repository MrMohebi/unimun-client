import * as gql from "gql-query-builder";

interface Params {
    type: 'query' | 'mutation',
    operation: string,
    operationName: string,
    fields: [],

}


const QueryBuilder = (type:'query'|'mutation',operationName:string,operation:string,fields:any) => {
    if (type === 'query') {
        return (
            gql.query({operation: operation, fields: fields}, null, {operationName: operationName})
        )
    }
}

export default QueryBuilder
