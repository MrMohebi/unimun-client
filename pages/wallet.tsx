import React, {useEffect, useRef, useState} from 'react';
import lottie from "lottie-web";
import books from "../assets/animations/books.json";
import WalletSVG from '../assets/svgs/wallet.svg'
import {currentNavActiveIndex} from "../store/navbar";
import Drawer from "../components/view/Drawer/Drawer";
import Button from "../components/view/Button/Button";

const Library = () => {

    const lottieRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (lottieRef.current)
            lottie.loadAnimation({
                container: lottieRef.current,
                renderer: "svg",
                animationData: books,
                loop: true,
                autoplay: true
            })
        currentNavActiveIndex(3)

    }, [])
    useEffect(() => {

    });

    const [drawerMaxHeight, setDrawerMaxHeight] = useState(400);
    const [drawerInitLimit, setDrawerInitLimit] = useState(0);
    const divRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className={'h-full w-full'} onLoad={() => {
            try {
                if (divRef.current && containerRef.current) {
                    setDrawerInitLimit(divRef.current.getBoundingClientRect().bottom)
                    setDrawerMaxHeight((containerRef.current.getBoundingClientRect().height - divRef.current.getBoundingClientRect().bottom) + 50)

                }

            } catch (e) {

            }

        }} ref={containerRef}>
            <Drawer initScroll={900} initHeight={drawerInitLimit} minHeight={700} wrap={
                <div className={'w-full grid grid-cols-3 px-3 pt-10'} ref={divRef}>
                    <div className={'col-span-2 p-2 relative'}>
                        <img className={'relative rounded-2xl overflow-hidden w-full  '} src="assets/svgs/jib-back.png"
                             alt=""/>
                        <div
                            className={'absolute top-0 left-0 w-full h-full px-4 pt-2 pb-5 flex flex-col justify-between items-center'}>
                            <div className={'w-full '}>
                                <span className={'IranSansMedium text-white text-sm'}>یـونی بانک</span>
                            </div>

                            <div className={'flex flex-col justify-center items-center '}>
                                <div className={'flex flex-row justify-center items-center'}>
                                    <span className={'IranSansMedium text-white text-3xl'}>50,000</span>
                                    <div className={'flex flex-col justify-between items-center'}>
                                        <img src="/assets/svgs/toman.svg" className={'mr-2'} alt=""/>

                                    </div>
                                </div>
                                <span className={'IranSansMedium text-white/70 text-sm -mt-2'}>موجودی</span>
                            </div>

                            <div
                                className={'bg-white/20 w-11/12  rounded-xl  m-0 flex flex-col justify-start items-center'}>

                                <div
                                    className={'flex w-full flex-row justify-start items-center h-8 pl-2 border-b border-white/40'}>
                                    <div
                                        className={'w-10 h-5 flex flex-col justify-center items-center border-l border-white'}>
                                        <img src="/assets/svgs/money-usable.svg" alt=""/>
                                        <span className={'IranSans text-[0.3rem] whitespace-nowrap text-white'}> قابل استفاده</span>
                                    </div>
                                    <div className={'w-full flex flex-row  justify-end items-center'}>
                                        <span className={'IranSansMedium text-white text-sm'}>50,000</span>
                                        <img src="/assets/svgs/toman.svg" className={'-mr-0.5 w-5 h-3'} alt=""/>
                                    </div>
                                </div>
                                <div className={'flex w-full flex-row justify-start items-center h-8 pl-2 '}>
                                    <div
                                        className={'w-10 h-5 flex flex-col justify-center items-center  border-l border-white'}>
                                        <img src="/assets/svgs/money-blocked.svg" alt=""/>
                                        <span
                                            className={'IranSans text-[0.3rem] whitespace-nowrap text-white'}>بلوکه</span>

                                    </div>
                                    <div className={'w-full flex flex-row  justify-end items-center'}>
                                        <span className={'IranSansMedium text-white text-sm'}>50,000</span>
                                        <img src="/assets/svgs/toman.svg" className={'-mr-0.5 w-5 h-3'} alt=""/>
                                    </div>
                                </div>


                            </div>
                        </div>

                    </div>

                    <div className={'col-span-1 flex flex-col-reverse justify-center items-center'}>
                        <img className={' rounded-2xl overflow-hidden w-full h-full py-2  '}
                             src="assets/svgs/unicoin.png" alt=""/>

                    </div>


                </div>
            }>
                <div style={{
                    height: drawerMaxHeight + "px"
                }} className={'w-full bg-white flex flex-col justify-between items-center'}>
                    <div className={'w-full flex flex-row justify-around items-center px-4'}>
                        <Button className={' h-10 rounded-xl bg-background flex flex-row justify-between items-center'}
                                id={'withdraw'} rippleColor={'rgba(0,0,0,0.14)'}>
                            <div
                                className={'h-10 w-10 rounded-xl bg-primary flex flex-col justify-center items-center'}>
                                <img src="/assets/svgs/deposit.svg" alt=""/></div>
                            <span className={"IranSansMedium text-primary text-sm mr-3 ml-3"}>واریــز وجه</span>
                        </Button>
                        <Button className={' h-10 rounded-xl bg-background flex flex-row justify-between items-center'}
                                id={'withdraw'} rippleColor={'rgba(0,0,0,0.14)'}>
                            <div
                                className={'h-10 w-10 rounded-xl bg-primary flex flex-col justify-center items-center'}>
                                <img src="/assets/svgs/withdraw.svg" alt=""/></div>
                            <span className={"IranSansMedium text-primary text-sm mr-3 ml-3"}>برداشت وجه</span>
                        </Button>
                    </div>

                    <div className={'flex flex-col justify-center items-center mt-10'}>
                        <img src="/assets/image/no-transactions.png" className={'w-14'} alt=""/>
                        <span
                            className={'IranSansMedium text-textDarker mt-2 text-[0.8rem]'}>تراکنشی انجام نداده اید</span>
                    </div>
                    <div className={'h-20'}></div>
                </div>
            </Drawer>
        </div>

    );
};

export default Library;