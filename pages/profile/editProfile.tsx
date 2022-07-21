import React, {useRef, useState} from 'react';
import UserOutlineSvg from "../../assets/svgs/useOutliner.svg";
import MaterialInput from "../../components/view/MaterialInput/MaterialInput";
import Dialog from "../../components/view/Dialog/Dialog";
import Button from "../../components/view/Button/Button";
import Header from "../../components/common/Header/Header";
import {useRouter} from "next/router";
import CheckSVG from '../../assets/svgs/check.svg'
import {UserData} from "../../store/user";
import {updateUser} from "../../Requests/withAuthentication/user";
import {gql, useMutation} from "@apollo/client";
import {TailSpin} from "react-loader-spinner";
import CircularProgressBar from "../../components/view/CircularProgressBar/CircularProgressBar";

const EditProfile = () => {
    const router = useRouter()
    const lastSeenDialog = useState(false)
    const usernameError = useState(false)
    const [bio, sBio] = useState('')
    const [showBC, sShowBC] = useState(false)
    const requestDialog = useState(false)
    const showBcTimer = useRef(null)
    const timer = useRef(setTimeout(() => {

        
    }, 200))
    const userUpdatedInfo = useRef({
        username: UserData().username ?? '',
        name: UserData().name ?? '',
        bio: UserData().bio ?? ''
    })


    const [updateQuery, {
        data,
        loading,
    }] = useMutation(gql`${updateUser(userUpdatedInfo.current).query}`, {variables: updateUser(userUpdatedInfo.current).variables})

    const usernameReg = /[0-9][^a-zA-Z0-9_]/g


    // const checkBio = _.debounce(logHi, 1000)

    const onDialogOptionChange = (e: any) => {
        console.log(e)
        lastSeenDialog[1](false)
        requestDialog[1](false)
    }
    return (
        <div className={'w-full overflow-y-scroll h-full'}>
            <Header title={'ویرایش نمایه'} back={true} backOnClick={() => {
                router.back()
            }}>
                <div onClick={() => {
                    if (!usernameError[0])
                        if (userUpdatedInfo.current.username || userUpdatedInfo.current.name || userUpdatedInfo.current.bio) {
                            updateQuery({variables: userUpdatedInfo.current}).then(res => {
                                if (res.data.updateUser.status === "SUCCESS") {
                                    router.push('/profile')
                                }
                            })
                        } else {
                            router.push('/profile')
                        }


                }} className={'w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2'}>
                    {
                        loading ?
                            <TailSpin height={20} width={20} color={'#22a2ff'}/>
                            :
                            <CheckSVG/>
                    }
                </div>
            </Header>
            <Dialog
                afterClosed={() => {
                    lastSeenDialog[1](false)
                }}
                open={lastSeenDialog[0]} closable={true}>
                <div className={'mr-4 mt-4 IranSansMedium'}> آخرین بازدید و آنلاین بودن</div>
                <div className={'w-full bg-background text-textDark IranSansMedium text-sm py-2 pr-4 mt-2'}><span> چه کسی وضعیت آنلاین بودن شما را ببیند ؟</span>
                </div>

                <div className={'w-full px-10'}>
                    <div
                        className={'IranSans h-16  w-full ml-4 border-b-gray-300 border-b border-textDark flex-row flex justify-between items-center'}>
                        <label className={'w-full h-full align-middle '} style={{lineHeight: '400%'}}
                               htmlFor={'allUsers'}>همه کاربر ها</label>
                        <input onChange={onDialogOptionChange} id={'allUsers'} name={'lastSeen'} type={'radio'}/>
                    </div>
                </div>

                <div className={'w-full px-10'}>
                    <div
                        className={'IranSans h-16  w-full ml-4 border-b-gray-300 border-b border-textDark flex-row flex justify-between items-center'}>
                        <label className={'w-full h-full align-middle '} style={{lineHeight: '400%'}}
                               htmlFor={'withChat'}>دارای گفتگو</label>
                        <input onChange={onDialogOptionChange} id={'withChat'} name={'lastSeen'} type={'radio'}/>
                    </div>
                </div>

                <div className={'w-full px-10'}>
                    <div
                        className={'IranSans h-16  w-full ml-4   border-textDark flex-row flex justify-between items-center'}>
                        <label className={'w-full h-full align-middle '} style={{lineHeight: '400%'}}
                               htmlFor={'noOne'}>هیچکس</label>
                        <input onChange={onDialogOptionChange} id={'noOne'} name={'lastSeen'} type={'radio'}/>
                    </div>
                </div>


                <div className={'w-full bg-background text-textDark IranSansMedium text-sm py-2 pr-4 mt-2'}><span>همه کاربر های یونیمون میتوانند وضعیت آنلاینی شما را مشاهده کنند</span>
                </div>

                <div className={'my-4 mx-4 flex flex-row-reverse justify-start items-center'} onClick={() => {
                    lastSeenDialog[1](false)
                }}>
                    <span className={'text-primary IranSansMedium'}>لغو</span>
                </div>

            </Dialog>

            <Dialog
                afterClosed={() => {
                    requestDialog[1](false)
                }}
                open={requestDialog[0]} closable={true}>
                <div className={'mr-4 mt-4 IranSansMedium'}>درخواست ها</div>
                <div className={'w-full bg-background text-textDark IranSansMedium text-sm py-2 pr-4 mt-2'}><span> چه کسی میتواند به شما درخواست بدهد ؟</span>
                </div>

                <div className={'w-full px-10'}>
                    <div
                        className={'IranSans h-16  w-full ml-4 border-b-gray-300 border-b border-textDark flex-row flex justify-between items-center'}>
                        <label className={'w-full h-full align-middle '} style={{lineHeight: '400%'}}
                               htmlFor={'allUsers-request'}>همه کاربر ها</label>
                        <input onChange={onDialogOptionChange} id={'allUsers-request'} name={'allowToRequest'}
                               type={'radio'}/>
                    </div>
                </div>

                <div className={'w-full px-10'}>
                    <div
                        className={'IranSans h-16  w-full ml-4 border-b-gray-300 border-b border-textDark flex-row flex justify-between items-center'}>
                        <label className={'w-full h-full align-middle '} style={{lineHeight: '400%'}}
                               htmlFor={'withChat-request'}>دارای گفتگو</label>
                        <input onChange={onDialogOptionChange} id={'withChat-request'} name={'allowToRequest'}
                               type={'radio'}/>
                    </div>
                </div>

                <div className={'w-full px-10'}>
                    <div
                        className={'IranSans h-16  w-full ml-4   border-textDark flex-row flex justify-between items-center'}>
                        <label className={'w-full h-full align-middle '} style={{lineHeight: '400%'}}
                               htmlFor={'noOne-request'}>هیچکس</label>
                        <input onChange={onDialogOptionChange} id={'noOne-request'} name={'allowToRequest'}
                               type={'radio'}/>
                    </div>
                </div>


                <div className={'w-full bg-background text-textDark IranSansMedium text-sm py-2 pr-4 mt-2'}><span>همه کاربر های یونیمون میتوانند وضعیت آنلاینی شما را مشاهده کنند</span>
                </div>

                <div className={'my-4 mx-4 flex flex-row-reverse justify-start items-center'} onClick={() => {
                    requestDialog[1](false)
                }}>
                    <span className={'text-primary IranSansMedium'}>لغو</span>
                </div>

            </Dialog>

            <div className={'w-full flex flex-col justify-center items-center'}>
                <div className={'w-full flex flex-col justify-center items-center'}>
                    <div
                        className={'w-28 h-28 bg-white shadow-lg rounded-3xl mt-10 flex flex-col justify-center items-center'}>
                        <div className={'w-12 h-12'}>
                            <UserOutlineSvg/>
                        </div>
                    </div>
                </div>
                <span className={'IranSansMedium select-none text-primary text-md mt-5'}>ویرایش عکس نمایه</span>
            </div>
            <div className={'w-full justify-start items-start  mt-10'}>
                <div className={' px-4'}>
                    <MaterialInput maxLen={32} onChange={(e: any) => {
                        userUpdatedInfo.current.name = e.currentTarget.value
                        e.currentTarget.value = e.currentTarget.value.slice(0, 32)
                    }} wrapperClassName={'w-full h-10 '}
                                   defaultValue={UserData().name ?? ''}
                                   placeHolder={'نام'}/>
                    <MaterialInput maxLen={32} dir={'ltr'} onChange={(e: any) => {
                        if (!isNaN(parseInt(e.currentTarget.value.slice(1, 2)))) {
                            e.currentTarget.value = ''
                        }
                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9a-zA-Z]/g, '')
                        if (e.currentTarget.value.length)
                            e.currentTarget.value = '@' + e.currentTarget.value.replaceAll('@', '');

                        e.currentTarget.value = e.currentTarget.value.slice(0, 32)
                        userUpdatedInfo.current.username = e.currentTarget.value
                    }} className={'no-font font-normal'} wrapperClassName={'w-full h-10 mt-6 no-font '}
                                   defaultValue={UserData().username ?? ''}
                                   placeHolder={'نام کاربری'}/>
                    {
                        usernameError[0] ?
                            <div className={'text-tiny  mt-1 mb-3 text-errorRed IranSansMedium'}>نام کاربری نا
                                معتبر</div> :
                            null
                    }
                    <div className={'relative w-full'}>
                        <MaterialInput multiLine maxLen={70} onChange={(e: any) => {

                            sShowBC(true)
                            clearTimeout(timer.current)
                            timer.current = setTimeout(() => {
                                sShowBC(false)
                            }, 1000)

                            e.currentTarget.value = e.currentTarget.value.slice(0, 70)
                            userUpdatedInfo.current.bio = e.currentTarget.value
                            sBio(e.currentTarget.value)
                        }} wrapperClassName={'w-full hide-scrollbars mt-4 pl-8 pt-4'}
                                       defaultValue={UserData().bio ?? ''}
                                       placeHolder={'بیوگرافی'}/>
                        <div
                            className={`absolute left-0 top-1/2 -translate-y-1/2  h-6 w-6 z-10 transition-all ${showBC ? 'scale-100' : 'scale-0'}`}>

                            <div
                                className={`h-full text-primary text-sm IranSans absolute w-full flex flex-col justify-center items-center  ${70 - bio.length > 60 ? 'scale-0' : 'scale-90'} transition-all duration-300 ease-in-out`}
                                style={{
                                    color: 70 - bio.length > 50 ? '#4eb3f1' : 70 - bio.length > 30 ? '#FF8800' : '#ff3333'
                                }}>
                                {70 - bio.length}
                            </div>

                            <CircularProgressBar emptyColor={'#e9ecef'} sqSize={25}
                                                 strokeWidth={70 - bio.length > 60 ? 4 : 3}
                                                 percentage={(bio.length * 100) / 70}
                                                 color={70 - bio.length > 50 ? '#4eb3f1' : 70 - bio.length > 30 ? '#FF8800' : '#ff3333'}/>
                        </div>
                    </div>
                </div>


                <div className={'mt-7'}>
                    <span className={'text-primary IranSansBold text-sm px-4'}> حریم خصوصی</span>
                    <Button id={'a-ripple'} rippleColor={'#dadada'} onClick={() => {
                        lastSeenDialog[1](true)
                    }} className={'w-full  h-14  px-4 flex flex-row justify-between items-center'}>
                        <span className={'IranSansMedium text-sm '}>آخرین بازدید و آنلاین بودن</span>
                        <span className={'IranSansMedium text-primary text-sm '}>همه کاربر ها</span>
                    </Button>
                    <div className={'w-3/4  border-b-2 mx-auto'}></div>
                    <Button id={'b-ripple'} rippleColor={'#dadada'} onClick={() => {
                        requestDialog[1](true)
                    }} className={'w-full h-14 flex flex-row px-4 justify-between items-center'}>
                        <span className={'IranSansMedium text-sm '}>درخواست آگهی</span>
                        <span className={'IranSansMedium text-primary text-sm '}
                        >همه کاربر ها</span>
                    </Button>
                </div>
            </div>
            <div className={'px-4 w-full mt-6'}>
                <Button onClick={() => {
                    router.push('/profile/accountSettings')
                }} id={'account-settings'} rippleColor={'rgba(22,155,255,0.5)'}
                        className={'w-full text-sm IranSansMedium border-2 border-primary rounded-lg h-10 text-primary'}>
                    <span>تنظیمات حساب کاربری</span>
                </Button>

            </div>
            <div className={'h-20'}/>

        </div>
    );
};

export default EditProfile;