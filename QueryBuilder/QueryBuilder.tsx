import {gql} from "@apollo/client";
import {getAds} from "./Queries/Ads";


const QueryBuilder = ()=>{

}

// gql`
// query ads(){
//
// }
// `

// const QueryBuilder = (type: "mutation" | "query", queryName: string, queryParams?: object[], data: any) => {
//
//     return gql`
//         ${type}{
//             ${queryName}${queryParams?.length ? "(" : ""}
//             ${queryParams?.length ? queryParams.map((param) => `
//             ${param['name']}:${param['val']},
//             `) : ""}
//             ${queryParams?.length ? ")" : ""}
//             ${"{"}
//             ${data.map((level1) => {
//         return `
//                 ${level1['name']}
//                 ${level1['subsets']?.length ? `
//                 {
//                 ${level1['subsets'].map(subset => subset)}
//                 }
//                 ` : ``}
//                 `
//     })}
//             ${"}"}
//         }
//     `
//
//     return gql``;
// }
// export default QueryBuilder
