import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link'
import HelpSvg from '../../assets/svgs/help.svg';
import UserOutlineSvg from '../../assets/svgs/useOutliner.svg';
import Button from "../../components/view/Button/Button";
import Badge from "../../components/view/Badge/Badge";
import Drawer from "../../components/view/Drawer/Drawer";
import JudgeSVG from '../../assets/svgs/judge.svg'
import InfoSVG from '../../assets/svgs/info.svg'
import SupportSVG from '../../assets/svgs/support.svg'
import SettingsSVG from '../../assets/svgs/settings.svg'
import MyAppealsSVG from '../../assets/svgs/myAppeals.svg'
import BookSVG from '../../assets/svgs/book.svg'
import PeopleSVG from '../../assets/svgs/people.svg'
import SaveSVG from '../../assets/svgs/save.svg'
import DownloadAppSVG from '../../assets/svgs/downloadApp.svg'
import {UserData, UserPhone, UserToken} from "../../store/user";
import {gql, useLazyQuery} from "@apollo/client";
import {getUserQuery} from "../../Requests/normal/user";
import {useRouter} from "next/router";
import CircularProgressBar from "../../components/view/CircularProgressBar/CircularProgressBar";
import Head from "next/head";
import VersionSVG from '../../assets/svgs/version.svg'

import TelSVG from '../../assets/svgs/telegran-gray.svg'
import InstaSVG from '../../assets/svgs/instagram-gray.svg'
import TwitterSVG from '../../assets/svgs/twitter-gray.svg'
import LoadingDialog from "../../components/view/LoadingDialog/LoadingDialog";
import SkeletonElement from "../../components/view/Skeleton/Skeleton";

const Index = () => {
    const router = useRouter()

    const [getUser, {
        data,
        loading
    }] = useLazyQuery(gql`${getUserQuery(['id', 'name', 'created_at', 'phone', 'referenceCode','username','bio']).query}`)
    const [progressPercentage, setProgressPercentage] = useState(0)
    const editProfButton = useRef<HTMLDivElement>(null)
    const drawerInitHeight = useState(170)
    const drawerMinHeight = useState(100)
    const loginRegisterBtn = useRef<HTMLDivElement>(null)
    const telContainer = useRef<HTMLDivElement>(null)


    const redirectTo = (path: string) => {
        router.push(path).then()
    }

    useEffect(() => {
        if (editProfButton.current) {
            drawerInitHeight[1](editProfButton.current.getBoundingClientRect().top + 50)
        }
        if (loginRegisterBtn.current && loginRegisterBtn.current.firstChild) {
            drawerInitHeight[1]((loginRegisterBtn.current.firstChild.firstChild as HTMLDivElement).getBoundingClientRect().top + 50)
        }
        if (UserToken())
            getUser().then()
    }, [])
    useEffect(() => {

        if (data) {
            if (data.user.data) {
                UserPhone(data.user.data.phone)
                UserData(data.user.data)
            }
            if (editProfButton.current) {
                drawerInitHeight[1](editProfButton.current.getBoundingClientRect().top + 50)
            }
            if (loginRegisterBtn.current && loginRegisterBtn.current.firstChild) {
                drawerInitHeight[1]((loginRegisterBtn.current.firstChild.firstChild as HTMLDivElement).getBoundingClientRect().top)
            }

        }

    }, [data])


    return (
        <div className={'w-full h-full'}>
            <Head>
                <title>Unimun Profile</title>
                <meta name="description" content="Unimun"/>
            </Head>

            {
                UserToken() && loading ?
                    <div className={'fixed top-0 left-0 w-full h-full z-50 '} style={{background: 'rgba(0,0,0,0.4)'}}>
                        <div
                            className={'top-1/2 left-1/2 fixed bg-white rounded-3xl shadow p-4 -translate-x-1/2 -translate-y-1/2'}>
                            <LoadingDialog wrapperClassName={' w-16 h-16 '} color={'#009dff'}/>

                        </div>
                    </div> :
                    null
            }

            <Drawer minHeight={drawerMinHeight[0]} initHeight={drawerInitHeight[0]}
                    closedHeight={170} wrap={
                <div className={'w-full h-full IranSansMedium text-textBlack text-sm overflow-scroll '}>
                    <div className={'w-full px-4 pt-3 flex flex-row justify-between'}>
                        <div className={'IranSansBlack text-md'}>
                            <span>پرو <span className={'text-primary -mr-1'}>فایل</span></span>
                        </div>
                        <div className={'h-6 w-6 opacity-0'} onClick={() => {
                            //help on click
                        }}>
                            <HelpSvg/>
                        </div>
                    </div>
                    <div className={'w-full flex flex-col justify-center items-center'}>
                        <div
                            className={'w-24 h-24 bg-white shadow-lg rounded-3xl mt-10 flex flex-col justify-center items-center'}>
                            <div className={'w-10 h-10'}>
                                <UserOutlineSvg/>
                            </div>
                        </div>
                    </div>

                    {UserToken() ?
                        data && data.user && data.user.data ?
                            <div className={'contents'}>
                                <div className={'w-full flex flex-col justify-center items-center'}>
                                    <span
                                        className={'mt-3 IranSansBold text-lg'}>{data.user.data.name ?? "بدون نام"}</span>
                                    <span
                                        className={'mt-1 IranSans text-sm text-textDark'}>{"اخیرا پیوسته به یونیمون"}</span>
                                </div>


                                <div className={'w-full flex flex-row justify-between items-center px-4 mt-4'}>
                                    <div
                                        className={'bg-white  flex flex-col justify-center items-center rounded-2xl py-4 px-6'}>
                                        <span className={'text-primary IranSansBold text-xl'}>0</span>
                                        <span className={'text-primary IranSansBold text-tiny'}>آگهی</span>
                                        <span className={'text-textBlack IranSansBold text-sm'}>انجام شده</span>
                                    </div>
                                    <div
                                        className={'bg-white  flex flex-col justify-center items-center rounded-2xl py-4 px-6'}>
                                        {/*<span className={'text-primary IranSansBold text-xl'}>0</span>*/}
                                        {/*<span className={'text-primary IranSansBold text-tiny'}>آگهی</span>*/}
                                        <CircularProgressBar sqSize={60} strokeWidth={2} percentage={progressPercentage}
                                                             color={'#1da1f2'}/>
                                        <span className={'text-textBlack IranSansBold text-sm mt-3'}>سطح</span>

                                    </div>
                                    <div
                                        className={'bg-white  flex flex-col justify-center items-center rounded-2xl py-4 px-6'}>
                                        <span className={'text-primary IranSansBold text-xl'}>0</span>
                                        <span className={'text-primary IranSansBold text-tiny'}>سوال</span>
                                        <span className={'text-textBlack IranSansBold text-sm'}>پاسخ داده</span>
                                    </div>

                                </div>

                                <div ref={editProfButton} id={'edit-profile'} className={'px-4 w-full mt-4'}>
                                    <Button onClick={() => {
                                        router.push('/profile/editProfile')
                                    }} id={'edit-profile-button'} rippleColor={'rgba(22,155,255,0.5)'}
                                            className={'w-full border-2 border-primary rounded-lg h-10 text-primary'}>
                                        <span>ویرایش نمایه</span>
                                    </Button>

                                </div>


                            </div>

                            :

                            <div className={'contents'}>
                                <div className={'w-full flex flex-col justify-center items-center'}>
                                    <SkeletonElement className={'mt-3 IranSansBold h-5 w-20 text-lg '}/>
                                    <SkeletonElement className={'mt-3 IranSansBold h-5 w-32 text-lg '}/>
                                </div>


                                <div className={'w-full flex flex-row justify-between items-center px-4 mt-4'}>
                                    <SkeletonElement className={'mt-3 IranSansBold h-24 w-20 text-lg '}/>
                                    <SkeletonElement className={'mt-3 IranSansBold h-28 w-24 text-lg '}/>
                                    <SkeletonElement className={'mt-3 IranSansBold h-24 w-20 text-lg '}/>


                                </div>

                                <div ref={editProfButton} id={'edit-profile'} className={'px-4 w-full mt-4'}>
                                    <Button onClick={() => {
                                        router.push('/profile/editProfile')
                                    }} id={'edit-profile-button'} rippleColor={'rgba(22,155,255,0.5)'}
                                            className={'w-full border-2 border-primary rounded-lg h-10 text-primary'}>
                                        <span>ویرایش نمایه</span>
                                    </Button>

                                </div>


                            </div>
                        :
                        <div className={'contents'}>
                            <div className={'w-full flex flex-col justify-center items-center'}>
                                <span className={'mt-5'}>وقتشه وارد دنیای جذاب یونیمون بشید</span>
                                <div className={'flex flex-row justify-center items-center mt-5'}>
                                    <span className={'mx-2'}>کلی اتفاق خوب منتظر شماست</span>
                                    <img className={'w-6 h-6'} src={'/assets/image/blink-emoji.png'} alt={''}/>
                                </div>
                                <div ref={loginRegisterBtn}>
                                    <Badge className={'mt-5'}>
                                        <Button id={'login-register'} onClick={() => {
                                            router.push('/profile/login')
                                        }} rippleColor={'rgba(255,255,255,0.58)'}
                                                className={'bg-primary w-36 h-11 rounded-xl text-white '}>
                                            <span>ورود | ثبت نام</span>
                                        </Button>
                                    </Badge>
                                </div>

                            </div>

                        </div>
                    }
                </div>
            }>


                <div>

                    {UserToken() ?
                        <div className={'mb-4'}>
                            <span className={' IranSansBold text-sm text-primary mr-4'}>حساب</span>
                            <Link passHref={true} href={'/profile/accountSettings'}>
                                <Button rippleColor={"rgba(0,0,0,0.15)"} onClick={() => {
                                    redirectTo('/profile/accountSettings')
                                }} id={'acc-settings'} className={'drawer-drag  drawer-buttons'}>
                                    <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                                        <div className={'profile-drawer-svg'}><SettingsSVG/></div>
                                        <div
                                            className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>تنظیمات
                                        </div>
                                    </button>
                                </Button>
                            </Link>


                            <Button id={'my-appeals'} rippleColor={"rgba(0,0,0,0.15)"} className={'drawer-buttons'}>
                                <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                                    <div className={'profile-drawer-svg'}><MyAppealsSVG/></div>
                                    <div
                                        className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>اگهی
                                        های من
                                    </div>
                                </button>
                            </Button>

                            {/*<Button id={'my-books'} rippleColor={"rgba(0,0,0,0.15)"} className={'drawer-buttons'}>*/}
                            {/*    <button className={'flex flex-row justify-start mt-4 items-center w-full'}>*/}
                            {/*        <div className={'profile-drawer-svg'}><BookSVG/></div>*/}
                            {/*        <div*/}
                            {/*            className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>کتاب*/}
                            {/*            های من*/}
                            {/*        </div>*/}
                            {/*    </button>*/}
                            {/*</Button>*/}

                            <Button onClick={() => {
                                router.push('/invite')
                            }} id={'invite-friends'} rippleColor={"rgba(0,0,0,0.15)"} className={'drawer-buttons'}>
                                <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                                    <div className={'profile-drawer-svg'}><PeopleSVG/></div>
                                    <div
                                        className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>دعوت
                                        از دوستان
                                    </div>
                                </button>
                            </Button>

                            {/*<Button id={'saved'} rippleColor={"rgba(0,0,0,0.15)"} className={'drawer-buttons'}>*/}
                            {/*    <button className={'flex flex-row justify-start mt-4 items-center w-full'}>*/}
                            {/*        <div className={'profile-drawer-svg'}><SaveSVG/></div>*/}
                            {/*        <div*/}
                            {/*            className={'text-md IranSansMedium w-full text-right mx-4  pb-4'}>نشان*/}
                            {/*            ها و یاداشت ها*/}
                            {/*        </div>*/}
                            {/*    </button>*/}
                            {/*</Button>*/}

                        </div>
                        : null}


                    <span className={'IranSansBold text-primary text-sm mr-4'}>دربارمون</span>
                    <Button id={'rules'} rippleColor={"rgba(0,0,0,0.15)"} className={'drawer-buttons'}>
                        <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                            <div className={'profile-drawer-svg'}><JudgeSVG/></div>
                            <div className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>قوانین و
                                مقررات
                            </div>
                        </button>
                    </Button>

                    <Button id={'about-us'} rippleColor={"rgba(0,0,0,0.15)"} className={'drawer-buttons'}>
                        <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                            <div className={'profile-drawer-svg'}><InfoSVG/></div>
                            <div className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>درباره
                                یونیمون
                            </div>
                        </button>
                    </Button>

                    <Button id={'backup-btn'} rippleColor={"rgba(0,0,0,0.15)"} className={'drawer-buttons'}>
                        <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                            <div className={'profile-drawer-svg'}><SupportSVG/></div>
                            <div className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>پشتیبانی
                                24
                                ساعته
                            </div>
                        </button>
                    </Button>
                    <Button id={'get-app'} rippleColor={"rgba(0,0,0,0.15)"} className={'drawer-buttons'}>
                        <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                            <div className={'profile-drawer-svg'}><DownloadAppSVG/></div>
                            <div className={'text-md IranSansMedium text-textDark w-full text-right mx-4 pb-4'}>دریافت
                                اپلیکیشن
                                <span className={'text-sm  scale-75 mt-1'}> (به زودی)</span>
                            </div>
                        </button>
                    </Button>
                </div>
                <div className={'h-48 flex flex-col justify-start items-center mt-10'}>
                    <div className={'flex flex-row justify-center items-center'}>

                        <div ref={telContainer} className={'w-5 h-5 mx-3 transition-all'} onClick={() => {
                            window.open('https://t.me/unimun_me', '_blank')
                        }}>
                            <TelSVG/>
                        </div>
                        <div className={'w-5 h-5 mx-3'} onClick={() => {
                            window.open('https://www.instagram.com/unimun.me/', '_blank')
                        }}>
                            <InstaSVG/>
                        </div>
                        <div className={'w-5 h-5 mx-3 transition-all '} onClick={(e) => {
                            e.currentTarget.classList.toggle('translate-x-24')
                            if (telContainer.current)
                                telContainer.current.classList.toggle('-translate-x-24')
                        }}>
                            <TwitterSVG/>
                        </div>

                    </div>
                    <div className={'w-20 scale-90 mt-5'}>
                        <VersionSVG/>
                    </div>
                </div>


            </Drawer>


        </div>

    );
};

export default Index;