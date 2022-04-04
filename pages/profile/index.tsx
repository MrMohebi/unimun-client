import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link'
import Image from "next/image";
import HelpSvg from '../../assets/svgs/help.svg';
import UserOutlineSvg from '../../assets/svgs/useOutliner.svg';
import BlinkEmoji from '../../assets/images/emojies/blink.png'
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
import {UserToken} from "../../store/user";
import {gql, useLazyQuery} from "@apollo/client";
import {getUserQuery} from "../../queries/normal/user";
import {useRouter} from "next/router";
import CircularProgressBar from "../../components/view/CircularProgressBar/CircularProgressBar";
import Head from "next/head";

const Index = () => {
    const router = useRouter()

    console.log(getUserQuery().query);
    const [getUser, {data, loading, error}] = useLazyQuery(gql`${getUserQuery().query}`)
    const [progressPercentage, setProgressPercentage] = useState(0)
    const editProfButton = useRef<HTMLDivElement>(null)
    const drawerInitHeight = useState(170)

    if (data)
        console.log(data)
    useEffect(() => {
        if (UserToken())
            getUser()

        if (data) {
            if (editProfButton.current) {
                drawerInitHeight[1](window.innerHeight - editProfButton.current.getBoundingClientRect().top - 50)
                console.log(editProfButton.current.getBoundingClientRect())
            }

        }

    }, [data])


    return (
        <div className={'w-full h-full'}>
            <Head>
                <title>Unimun Profile</title>
                <meta name="description" content="Unimun"/>
            </Head>
            <div className={'w-full h-full IranSansMedium text-textBlack text-sm overflow-scroll'}>
                <div className={'w-full px-4 pt-3 flex flex-row justify-between'}>
                    <div className={'IranSansBlack text-md'}>
                        <span>پرو <span className={'text-primary -mr-1'}>فایل</span></span>
                    </div>
                    <div className={'h-6 w-6'} onClick={() => {
                        //help on click
                    }}>
                        <HelpSvg/>
                    </div>
                </div>
                <div className={'w-full flex flex-col justify-center items-center'}>
                    <div
                        className={'w-28 h-28 bg-white shadow-lg rounded-3xl mt-10 flex flex-col justify-center items-center'}>
                        <div className={'w-12 h-12'}>
                            <UserOutlineSvg/>
                        </div>
                    </div>
                </div>

                {UserToken() ?
                    data ?
                        <div className={'contents'}>
                            <div className={'w-full flex flex-col justify-center items-center'}>
                                <span className={'mt-3 IranSansBold text-lg'}>{data.name ?? "بدون نام"}</span>
                                <span className={'mt-1 IranSans text-sm text-textDark'}>{data.name ?? "بدون نام"}</span>
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
                                <Button rippleColor={'rgba(22,155,255,0.5)'}
                                        className={'w-full border-2 border-primary rounded-lg h-10 text-primary'}>
                                    <span>ویرایش نمایه</span>
                                </Button>
                            </div>


                        </div> :
                        null
                    :
                    <div className={'contents'}>
                        <div className={'w-full flex flex-col justify-center items-center'}>
                            <span className={'mt-5'}>وقتشه وارد دنیای جذاب یونیمون بشید</span>
                            <div className={'flex flex-row justify-center items-center mt-5'}>
                                <span className={'mx-2'}>کلی اتفاق خوب منتظر شماست</span>
                                <Image src={BlinkEmoji} alt={''}/>
                            </div>
                            <Badge className={'mt-5'}>
                                <Button onClick={() => {
                                    router.push('/profile/login')
                                }} rippleColor={'rgba(255,255,255,0.58)'}
                                        className={'bg-primary w-36 h-11 rounded-xl text-white '}>
                                    <span>ورود | ثبت نام</span>
                                </Button>
                            </Badge>
                        </div>

                    </div>
                }
                <div className={'h-96'}/>

                <Drawer initHeight={drawerInitHeight[0]}
                        closedHeight={170}>
                    {
                        UserToken() ?
                            <div className={'mb-4'}>
                                <span className={'IranSansBold text-primary'}>حساب</span>
                                <Link passHref={true} href={'/profile/accountSettings'}>
                                    <div className={'flex flex-col justify-center items-center IranSans'}>
                                        <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                                            <div className={'profile-drawer-svg'}><SettingsSVG/></div>
                                            <div
                                                className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>تنظیمات
                                            </div>
                                        </button>
                                    </div>
                                </Link>


                                <div className={'flex flex-col justify-center items-center IranSans'}>
                                    <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                                        <div className={'profile-drawer-svg'}><MyAppealsSVG/></div>
                                        <div
                                            className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>اگهی
                                            های من
                                        </div>
                                    </button>
                                </div>

                                <div className={'flex flex-col justify-center items-center IranSans'}>
                                    <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                                        <div className={'profile-drawer-svg'}><BookSVG/></div>
                                        <div
                                            className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>کتاب
                                            های من
                                        </div>
                                    </button>
                                </div>

                                <div className={'flex flex-col justify-center items-center IranSans'}>
                                    <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                                        <div className={'profile-drawer-svg'}><PeopleSVG/></div>
                                        <div
                                            className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>دعوت
                                            از دوستان
                                        </div>
                                    </button>
                                </div>

                                <div className={'flex flex-col justify-center items-center IranSans'}>
                                    <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                                        <div className={'profile-drawer-svg'}><SaveSVG/></div>
                                        <div
                                            className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>نشان
                                            ها و یاداشت ها
                                        </div>
                                    </button>
                                </div>

                            </div>
                            : null
                    }

                    <span className={'IranSansBold text-primary '}>دربارمون</span>
                    <div className={'flex flex-col justify-center items-center IranSans'}>
                        <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                            <div className={'profile-drawer-svg'}><JudgeSVG/></div>
                            <div className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>قوانین و
                                مقررات
                            </div>
                        </button>
                    </div>

                    <div className={'flex flex-col justify-center items-center IranSans'}>
                        <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                            <div className={'profile-drawer-svg'}><InfoSVG/></div>
                            <div className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>درباره
                                یونیمون
                            </div>
                        </button>
                    </div>

                    <div className={'flex flex-col justify-center items-center IranSans'}>
                        <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                            <div className={'profile-drawer-svg'}><SupportSVG/></div>
                            <div className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>پشتیبانی 24
                                ساعته
                            </div>
                        </button>
                    </div>


                    <div className={'flex flex-col justify-center items-center IranSans'}>
                        <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                            <div className={'profile-drawer-svg'}><DownloadAppSVG/></div>
                            <div className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>دریافت
                                اپلیکیشن
                            </div>
                        </button>
                    </div>


                    <div className={'h-44'}></div>

                </Drawer>

            </div>
        </div>

    );
};

export default Index;