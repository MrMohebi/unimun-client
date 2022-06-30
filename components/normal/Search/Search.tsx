import React, {ChangeEventHandler, useEffect, useRef, useState} from 'react';
import NotifSVG from '../../../assets/svgs/notif.svg'
import SearchSVG from '../../../assets/svgs/search.svg'
import CitySVG from '../../../assets/svgs/city.svg'
import CloseSVG from '../../../assets/svgs/close.svg'
import Badge from "../../view/Badge/Badge";
import {TailSpin} from "react-loader-spinner";
import {useRouter} from "next/router";
import MyBooks from '../../../assets/svgs/mybook.svg'
import LoadingDialog from "../../view/LoadingDialog/LoadingDialog";
import {UserToken} from "../../../store/user";
import Unimun from "../../assets/svgs/unimun.svg";


interface Props {
    onInputChange: ChangeEventHandler
    debounceOnChange?: Function
    collapse: boolean
    searchLoading: boolean,
    lib?: boolean
}

const Search = (props: Props) => {
    const manualSearch = useState(false)
    const inputText = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        manualSearch[1](false)

    }, [props.collapse])

    return (
        <div
            className={`absolute top-0 left-0 px-4 w-full  bg-white pt-3 ${props.collapse && !manualSearch[0] ? 'pb-1 ' : 'pb-4'} rounded-br-xl rounded-bl-xl z-10 shadow`}>
            <div className={'search-upper flex flex-row justify-between items-center'}>


                <div className={'IranSansBlack'}><span dir={'ltr'} className={'text-primary'}><span
                    className={'text-textBlack'}>{props.lib ? 'کتابـ' : 'یونیـ'}</span>{props.lib ? 'خونه' : 'مـون'}</span>
                </div>

                <div className={'flex flex-row justify-center items-center'}>
                    <div
                        onClick={() => {
                            manualSearch[1](true)
                        }}
                        className={`chat rounded-lg bg-background w-9 h-9 ml-2 p-2 h-full flex flex-col justify-center items-center  transition-all ${props.collapse && !manualSearch[0] ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                        <SearchSVG/></div>
                    {
                        props.lib ?


                            <Badge color={'#ff1a1a'}>
                                <div className={'chat rounded-lg bg-background p-1.5 w-9 h-9'} onClick={() => {
                                    if (UserToken()) {
                                        router.push('/profile/myBooks')

                                    } else {
                                        router.push('/profile/login')

                                    }
                                }}>
                                    <MyBooks/>
                                </div>
                            </Badge>
                            :
                            <Badge color={'#ff1a1a'}>
                                <div className={'chat rounded-lg bg-background p-1.5 w-9 h-9'} onClick={() => {
                                    router.push('/notifications')
                                }}>
                                    <NotifSVG/>
                                </div>
                            </Badge>
                    }

                </div>
            </div>
            <div
                className={`bg-background px-3 w-full flex flex-row items-center justify-between  rounded-xl mt-3 transition-all overflow-hidden duration-200 origin-top ${props.collapse && !manualSearch[0] ? 'h-0' : 'h-12'}`}>
                <div className={'w-8 h-full  relative flex flex-col justify-center items-center p-1'}>
                    <div style={{transform: props.searchLoading ? 'scale(0)' : 'scale(1)'}}
                         className={`'${props.searchLoading ? 'scale-0 ' : 'scale-100 '} overflow-hidden origin-center transition-all  duration-300 flex flex-col justify-center items-center w-full h-full '`}>
                        <SearchSVG/>
                    </div>
                    <div style={{transform: props.searchLoading ? 'scale(1)' : 'scale(0)'}}
                         className={`origin-center transition-all duration-300  w-full absolute top-0 left-0 h-full flex flex-col items-center justify-center `}>
                        {/*<TailSpin color="#42b0f3" height={25} width={25}/>*/}
                        <LoadingDialog wrapperClassName={'w-7 h-7'} color={'#2aa0ff'} />
                    </div>
                </div>
                <input ref={inputRef} id={'search-input'}
                       className={'w-full h-full bg-transparent outline-0 px-2 text-sm IranSansMedium'}
                       placeholder={'جستجو'} type="text" onChange={(e) => {
                    inputText[1](e.currentTarget.value)
                    if (props.onInputChange)
                        props.onInputChange(e)
                }}/>
                < div
                    className={`w-5 h-5 flex flex-col justify-center transition-all duration-100 items-center p-0.5 ${inputText[0].length ? "scale-100" : 'scale-0'}`}
                    onClick={() => {
                        if (inputRef.current)
                            inputRef.current.value = ''
                        inputText[1]('')
                    }}><CloseSVG/></div>

                {/*<div className={'flex flex-row items-center justify-center grayscale opacity-0'}>*/}
                {/*    <div className={'w-8 h-full flex flex-col justify-center items-center p-1'}><CitySVG/></div>*/}
                {/*    <span className={'IranSansMedium ml-2'}>همه</span>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default Search;