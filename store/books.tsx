import {makeVar} from "@apollo/client";

export const lastBookSubmitSuccess = makeVar('')
export const isBrochure = makeVar(false)
export const lastGottenBooks = makeVar([])
// export const EditBookData = makeVar({} as {
//     title:string
//     attachments:any[]
//     language:string
//     writer:string
//     categoryID:string
//     category:{
//         title:string
//     }
//     appearance:{
//         title:string
//     }
//     files:any[]
// })
export const EditBookData = makeVar({} as any)

