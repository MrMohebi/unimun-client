import React, {useState} from 'react';
import UserOutlineSvg from "../../assets/svgs/useOutliner.svg";
import MaterialInput from "../../components/view/MaterialInput/MaterialInput";
import Dialog from "../../components/view/Dialog/Dialog";
import Button from "../../components/view/Button/Button";
import Header from "../../components/common/Header/Header";
import {useRouter} from "next/router";
import CheckSVG from '../../assets/svgs/check.svg'

const EditProfile = () => {

    const router = useRouter()
    const lastSeenDialog = useState(false)

    return (
        <div className={'w-full'}>
            <Header title={'ویرایش نمایه'} back={true} backOnClick={() => {
                router.back()
            }}>
                <div onClick={() => {
                    router.push('/profile')
                }} className={'w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2'}>
                    <CheckSVG/>
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
                        className={'IranSans h-16  w-full ml-4 border-b-gray-300 border-b border-textDark flex-row flex justify-between items-center'}>
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
            <div className={'w-full flex flex-col justify-center items-center'}>
                <div className={'w-full flex flex-col justify-center items-center'}>
                    <div
                        className={'w-28 h-28 bg-white shadow-lg rounded-3xl mt-10 flex flex-col justify-center items-center'}>
                        <div className={'w-12 h-12'}>
                            <UserOutlineSvg/>
                        </div>
                    </div>
                </div>
                <span className={'IranSansMedium text-primary text-md mt-5'}>ویرایش عکس نمایه</span>
            </div>
            <div className={'w-full justify-start items-start px-4 mt-10'}>
                <MaterialInput wrapperClassName={'w-full h-10 '} defaultValue={'محمد'} placeHolder={'نام'}/>
                <MaterialInput wrapperClassName={'w-full h-10 mt-6 '} defaultValue={''} placeHolder={'نام کاربری'}/>
                <MaterialInput wrapperClassName={'w-full h-10 mt-4 m'} defaultValue={''} placeHolder={'بیوگرافی'}/>


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
                        <span className={'IranSansMedium text-primary text-sm mt-5'}>همه کاربر ها</span>
                    </div>
                </div>
            </div>
            <div className={'px-4 w-full mt-6'}>
                <Button onClick={() => {

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