import React, {ReactEventHandler, useEffect, useRef, useState} from 'react';
import UserOutlineSvg from "../../assets/svgs/useOutliner.svg";
import MaterialInput from "../../components/view/MaterialInput/MaterialInput";
import Dialog from "../../components/view/Dialog/Dialog";
import Button from "../../components/view/Button/Button";
import Header from "../../components/common/Header/Header";
import {useRouter} from "next/router";
import CheckSVG from '../../assets/svgs/check.svg'
import {route} from "next/dist/server/router";
import {UserData} from "../../store/user";
import {updateUser} from "../../Requests/withAuthentication/user";
import {gql, useMutation} from "@apollo/client";
import {TailSpin} from "react-loader-spinner";
import LoadingDialog from "../../components/view/LoadingDialog/LoadingDialog";

const EditProfile = () => {
    const router = useRouter()
    const lastSeenDialog = useState(false)
    const usernameError = useState(false)
    const requestDialog = useState(false)
    const userUpdatedInfo = useRef({
        username: UserData().username ?? '',
        name: UserData().name ?? '',
        bio: UserData().bio ?? ''
    })


    const [updateQuery, {
        data,
        loading,
    }] = useMutation(gql`${updateUser(userUpdatedInfo.current).query}`, {variables: updateUser(userUpdatedInfo.current).variables})

    const usernameReg = /^[a-z0-9_.]+$/
    if (data)
        console.log(data)

    return (
        <div className={'w-full'}>
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
                        <input id={'allUsers'} name={'lastSeen'} type={'radio'}/>
                    </div>
                </div>

                <div className={'w-full px-10'}>
                    <div
                        className={'IranSans h-16  w-full ml-4 border-b-gray-300 border-b border-textDark flex-row flex justify-between items-center'}>
                        <label className={'w-full h-full align-middle '} style={{lineHeight: '400%'}}
                               htmlFor={'withChat'}>دارای گفتگو</label>
                        <input id={'withChat'} name={'lastSeen'} type={'radio'}/>
                    </div>
                </div>

                <div className={'w-full px-10'}>
                    <div
                        className={'IranSans h-16  w-full ml-4   border-textDark flex-row flex justify-between items-center'}>
                        <label className={'w-full h-full align-middle '} style={{lineHeight: '400%'}}
                               htmlFor={'noOne'}>هیچکس</label>
                        <input id={'noOne'} name={'lastSeen'} type={'radio'}/>
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
                        <input id={'allUsers-request'} name={'allowToRequest'} type={'radio'}/>
                    </div>
                </div>

                <div className={'w-full px-10'}>
                    <div
                        className={'IranSans h-16  w-full ml-4 border-b-gray-300 border-b border-textDark flex-row flex justify-between items-center'}>
                        <label className={'w-full h-full align-middle '} style={{lineHeight: '400%'}}
                               htmlFor={'withChat-request'}>دارای گفتگو</label>
                        <input id={'withChat-request'} name={'allowToRequest'} type={'radio'}/>
                    </div>
                </div>

                <div className={'w-full px-10'}>
                    <div
                        className={'IranSans h-16  w-full ml-4   border-textDark flex-row flex justify-between items-center'}>
                        <label className={'w-full h-full align-middle '} style={{lineHeight: '400%'}}
                               htmlFor={'noOne-request'}>هیچکس</label>
                        <input id={'noOne-request'} name={'allowToRequest'} type={'radio'}/>
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
            <div className={'w-full justify-start items-start px-4 mt-10'}>
                <MaterialInput onChange={(e: any) => {
                    userUpdatedInfo.current.name = e.currentTarget.value
                }} wrapperClassName={'w-full h-10 '} defaultValue={UserData().name ?? ''}
                               placeHolder={'نام'}/>
                <MaterialInput onChange={(e: any) => {
                    // e.currentTarget.value = e.currentTarget.value.match(usernameReg)
                    if (!usernameReg.test(e.currentTarget.value) && e.currentTarget.value.length > 3) {
                        usernameError[1](true)
                    } else {
                        usernameError[1](false)

                    }
                    userUpdatedInfo.current.username = e.currentTarget.value
                }} wrapperClassName={'w-full h-10 mt-6 '} defaultValue={UserData().username ?? ''}
                               placeHolder={'نام کاربری'}/>
                {
                    usernameError[0] ?
                        <div className={'text-tiny mt-1 mb-3 text-errorRed IranSansMedium'}>نام کاربری نا معتبر</div> :
                        null
                }
                <MaterialInput onChange={(e: any) => {
                    userUpdatedInfo.current.bio = e.currentTarget.value
                }} wrapperClassName={'w-full h-10 mt-4 m'} defaultValue={UserData().bio ?? ''}
                               placeHolder={'بیوگرافی'}/>


                <div className={'mt-7'}>
                    <span className={'text-primary IranSansBold text-sm mt-'}>  حریم خصوصی</span>
                    <div className={'w-full flex flex-row justify-between items-center'}>
                        <span className={'IranSansMedium text-sm mt-5'}>آخرین بازدید و آنلاین بودن</span>
                        <span onClick={() => {
                            lastSeenDialog[1](true)
                        }} className={'IranSansMedium text-primary text-sm mt-5'}>همه کاربر ها</span>
                    </div>
                    <div className={'w-full flex flex-row justify-between items-center'}>
                        <span className={'IranSansMedium text-sm mt-5'}>درخواست آگهی</span>
                        <span className={'IranSansMedium text-primary text-sm mt-5'} onClick={() => {
                            requestDialog[1](true)
                        }}>همه کاربر ها</span>
                    </div>
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