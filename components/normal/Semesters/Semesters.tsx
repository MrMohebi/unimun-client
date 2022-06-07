import React, {useEffect, useRef, useState} from 'react';
import Header from "../../common/Header/Header";
import Back from '../../../assets/svgs/back.svg'
import {gql, useLazyQuery} from "@apollo/client";
import LoadingDialog from "../../view/LoadingDialog/LoadingDialog";
import {useRouter} from "next/router";

import SearchSVG from "../../../assets/svgs/search.svg";
import CloseSVG from "../../../assets/svgs/close.svg";
import moment from "jalali-moment";

const Semesters = (props: { onCatSelected: Function }) => {

    const [tree, _tree] = useState([] as [])
    const data = useRef(null)
    const [semesters, setSemesters] = useState([""] as [string]);
    const lastClicked = useRef([])
    const [searchText, _searchText] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)


    useEffect(() => {

        let arr = [""] as [string];
        const currentYear = parseInt(moment().locale('fa').format('YYYY'))
        Array(50).fill("").map((el, index) => {
            arr.push(`${" " + (currentYear - index) + " "}ترم تابستان `)
            arr.push(`${" " + (currentYear - index) + " "} ترم پاییز `)
            arr.push(`${" " + (currentYear - index) + " "}ترم بهار `)
        })

        setSemesters((prevState) => {
            return (
                arr.filter((el) => {
                    return el.length
                })
            ) as [string]
        })

        console.log(semesters)
        setTimeout(() => {
            console.log(semesters)
        }, 1000);


    }, [])


    const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {


    }


    const router = useRouter();
    return (
        <div className={'w-full h-full fixed top-0 left-0 z-40 bg-background overflow-scroll pb-10 '}>
            <Header title={'انتخاب ترم'} back={true} backOnClick={() => {
                props.onCatSelected("")
            }}/>

            <div className={'h-20 rounded-b-xl w-full bg-white px-4 pt-5'}>

                <div
                    className={`bg-background px-3 h-10 w-full flex flex-row items-center justify-between  rounded-xl  transition-all overflow-hidden duration-200 origin-top `}>
                    <div className={'w-8 h-full  relative flex flex-col justify-center items-center p-1'}>
                        <div
                            className={`'overflow-hidden origin-center transition-all  duration-300 flex flex-col justify-center items-center w-full h-full '`}>
                            <SearchSVG/>
                        </div>

                    </div>
                    <input ref={inputRef} id={'search-input'}
                           className={'w-full h-full bg-transparent outline-0 px-2 text-sm IranSansMedium'}
                           placeholder={'جستجو'} type="text" onChange={onSearchInputChange}/>
                    <div
                        className={`w-5 h-5 flex flex-col justify-center transition-all duration-100 items-center p-0.5 ${searchText ? "scale-100" : 'scale-0'}`}
                        onClick={() => {
                            if (inputRef.current)
                                inputRef.current.value = ''

                            _searchText('')
                        }}><CloseSVG/></div>

                </div>


            </div>

            {/*{*/}
            {/*    lastClicked.current.length > 0 && searchText === '' ?*/}
            {/*        <div className={'w-full IranSansMedium text-sm px-3 pt-2 text-textDark scale-95 mb-2'}>*/}
            {/*            کتاب ها و جزوه هامونو تو این 3 تا دسته ی اصلی قرار دادیم تا راحت تر بتونی چیزی که میخوای رو پیدا*/}
            {/*            کنی*/}
            {/*        </div> : null*/}
            {/*}*/}


            {
                semesters.map((semester, index) => {
                    return (
                        <div key={'cat' + index}
                             className={'w-full flex flex-col justify-start items-center pt-3 animate__animated animate__fadeInUp '}
                             style={{animationDelay: index * 50 + 'ms', animationDuration: '.15s'}}
                             onClick={() => {
                                 props.onCatSelected(semester)
                             }}
                        >
                            <div
                                className={'w-11/12 rounded-xl h-14 bg-white max-w-sm flex flex-row justify-between items-center px-4'}>

                                <span dir={'ltr'} className={'IranSansMedium'}>{semester}</span>

                            </div>
                        </div>
                    )
                })
            }


        </div>
    );
};

export default Semesters;