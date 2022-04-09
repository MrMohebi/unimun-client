import * as queryBuilder from "gql-query-builder";

export const updateUser = (variables: object) => queryBuilder.mutation({
    operation: 'updateUser',
    variables: {
        ...variables
    },
    fields: ['status', {data: ['id']}]
})
