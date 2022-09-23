import {makeVar} from "@apollo/client";

export const lastBookSubmitSuccess = makeVar('')
export const isBrochure = makeVar(false)
export const BooksStore = makeVar([])
export const BooksEndCursor = makeVar("")
export const LastBooksScrollPosition = makeVar(0)

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

