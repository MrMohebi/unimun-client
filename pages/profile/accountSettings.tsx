import React from 'react';
import Header from "../../components/common/Header/Header";
import UserOutlineSvg from '../../assets/svgs/useOutliner.svg';
import SimcardSVG from '../../assets/svgs/simcard.svg';
import VerifySVG from '../../assets/svgs/verify.svg';
import LogoutSVG from '../../assets/svgs/logout.svg';
import {useRouter} from "next/router";
import {UserPhone, UserToken} from "../../store/user";
import {removeToken, setId, setToken} from "../../helpers/TokenHelper";
import Button from "../../components/view/Button/Button";

const AccountSettings = () => {

    const router = useRouter();


    const logoutOnClickHandler = () => {
        removeToken()
        UserToken('')
        setToken('')
        setId('')
        window.location.pathname = '/'
    }

    return (
        <div>
            <Header title={'حساب کاربری'} back={true} backOnClick={() => {
                router.back()
            }}/>
            <div className={'w-full flex flex-row justify-end'}>
                <div dir={'ltr'} className={'grid grid-rows-2 grid-cols-3 mt-5 ml-5'}>
                    <div
                        className={'w-20 h-20 row-span-2 col-span-1 bg-white shadow-md justify-items-center rounded-2xl flex justify-center items-center'}>
                        <div className={'w-8 h-8'}>
                            <UserOutlineSvg/>
                        </div>
                    </div>
                    <div className={'col-span-2 IranSansBold ml-5 flex items-end'}>{UserPhone()}</div>
                    <div className={'col-span-2 IranSansMedium ml-5 flex items-start text-textDark text-sm'}>شماره
                        تلفن
                    </div>
                </div>
            </div>

            <div className={'flex flex-row items-center justify-start w-full IranSansMedium px-4 mt-10'}>
                <div className={'h-8 w-8 flex justify-center items-center'}>
                    <VerifySVG/>
                </div>
                <div
                    className={'text-sm opacity-50 h-10 flex justify-start items-center ml-10 mr-4 border-b border-gray-200 py-6 w-full select-none'}> درخواست
                    تیک آبی <span className={'text-sm  scale-75 mt-1'}> (به زودی)</span>
                </div>
            </div>

            <div className={'flex flex-row items-center justify-start w-full IranSansMedium px-4'}>
                <div className={'h-8 w-8 flex justify-center items-center'}>
                    <SimcardSVG/>
                </div>
                <div
                    className={'text-sm opacity-50 h-10 flex justify-start items-center ml-10 mr-4 border-b border-gray-200 py-6 w-full select-none'}>تغیر
                    شماره تلفن<span className={'text-sm  scale-75 mt-1'}> (به زودی)</span>
                </div>
            </div>

            <div className={'flex flex-row items-center justify-start w-full IranSansMedium px-4'}
                 onClick={logoutOnClickHandler}>
                <div className={'h-8 w-8 flex justify-center items-center'}>
                    <LogoutSVG/>
                </div>
                <Button id={'log-Out'}>
                    <div
                        className={'text-sm h-10 flex justify-start items-center ml-10 mr-4  py-6 w-full text-errorRed select-none'}>خروج
                        از حساب کاربری
                    </div>
                </Button>

            </div>

        </div>
    );
};

export default AccountSettings;