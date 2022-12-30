import {makeVar} from "@apollo/client";

export const lastBookSubmitSuccess = makeVar('')
export const isBrochure = makeVar(false)
export const BooksStore = makeVar([] as object[])
export const BooksEndCursor = makeVar("")
export const LastBooksScrollPosition = makeVar(0)


export interface Book {
    categoryPersian: string
    type: string
    ISBN: string
    appearance: string
    appearanceID: string
    attachments: [] | [any]
    bookFiles: [] | [any]
    category: string
    categoryID: string
    city: string
    cityID: string
    connectWay: string
    createdAt: string
    creator: string
    details: string
    edition: string
    id: string
    isBook: boolean
    isDownloadable: boolean
    isPurchasable: boolean
    language: string
    lessen: string
    modifiedContentAt: string
    pages: string
    price: string
    publishedAt: string
    publishedDate: string
    publisher: string
    seen: string
    sizeMB: string
    status: string
    teacher: string
    templateId: string
    term: string
    title: string
    university: string
    universityID: string
    verifiedAt: string
    writer: string
    wroteYear: string
}

export const EmptyBook = makeVar({

    attachments: [],
    price: '20000',
    type: 'physical',
    isBook: true,
    isDownloadable: false,
    isPurchasable: true,
    bookFiles: []

} as Book);
export const BookDataStore = makeVar({

    attachments: [],
    price: '20000',
    type: 'physical',
    isBook: true,
    isDownloadable: false,
    isPurchasable: true,
    bookFiles: []

} as Book)

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

