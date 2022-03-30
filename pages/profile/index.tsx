import React from 'react';
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
import DownloadAppSVG from '../../assets/svgs/judge.svg'

const Index = () => {


    return (
        <div className={'w-full '}>
            <div className={'w-full flex flex-col justify-center items-center IranSansMedium text-textBlack text-sm'}>
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
                <div
                    className={'w-28 h-28 bg-white shadow-lg rounded-3xl mt-10 flex flex-col justify-center items-center'}>
                    <div className={'w-12 h-12'}>
                        <UserOutlineSvg/>
                    </div>
                </div>
                <span className={'mt-5'}>وقتشه وارد دنیای جذاب یونیمون بشید</span>
                <div className={'flex flex-row justify-center items-center mt-5'}>
                    <span className={'mx-2'}>کلی اتفاق خوب منتظر شماست</span>
                    <Image src={BlinkEmoji} alt={''}/>
                </div>
                <Badge className={'mt-5'}>
                    <Button rippleColor={'rgba(255,255,255,0.58)'}
                            className={'bg-primary w-36 h-11 rounded-2xl text-white '}>
                        <span>ورود | ثبت نام</span>
                    </Button>
                </Badge>

                <Drawer>

                    <span className={'IranSansBold text-primary'}>دربارمون</span>
                    <div className={'flex flex-col justify-center items-center IranSans'}>
                        <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                            <div className={'profile-drawer-svg'}><JudgeSVG/></div>
                            <div className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>قوانین و مقررات
                            </div>
                        </button>
                    </div>

                    <div className={'flex flex-col justify-center items-center IranSans'}>
                        <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                            <div className={'profile-drawer-svg'}><InfoSVG/></div>
                            <div className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>درباره یونیمون</div>
                        </button>
                    </div>

                    <div className={'flex flex-col justify-center items-center IranSans'}>
                        <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                            <div className={'profile-drawer-svg'}><SupportSVG/></div>
                            <div className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>پشتیبانی 24 ساعته</div>
                        </button>
                    </div>

                    <div className={'flex flex-col justify-center items-center IranSans'}>
                        <button className={'flex flex-row justify-start mt-4 items-center w-full'}>
                            <div className={'profile-drawer-svg'}><DownloadAppSVG/></div>
                            <div className={'text-md IranSansMedium w-full text-right mx-4 border-b pb-4'}>دریافت اپلیکیشن</div>
                        </button>
                    </div>


                    <div className={'h-32'}></div>

                </Drawer>

            </div>
        </div>
    );
};

export default Index;