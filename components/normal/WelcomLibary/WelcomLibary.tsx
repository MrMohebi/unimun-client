import React, {useEffect, useRef, useState} from 'react';
import lottie from "lottie-web";
import book from "../../../assets/animations/book.json";
import {currentNavActiveIndex} from "../../../store/navbar";
import Button from "../../view/Button/Button";
import {getLocalStorageItem, setLocalStorageItem} from "../../../helpers/TokenHelper";

const WelcomLibary = (props: {
    onCLose: Function
    show: boolean
}) => {
    useEffect(() => {
        if (lottieRef.current)
            lottie.loadAnimation({
                container: lottieRef.current,
                renderer: "svg",
                animationData: book,
                loop: true,
                autoplay: true
            })
        currentNavActiveIndex(2)

    }, [])

    useEffect(() => {
        if (getLocalStorageItem('seenWelcomeDialog') && !props.show) {

            setTimeout(() => {
                setRenderNull(true)
            }, 500)

        }
    }, [props.show])

    const [renderNull, setRenderNull] = useState(false);
    const lottieRef = useRef(null);


    if (!renderNull)
        return (
            <>

                <div
                    className={`fixed top-0 left-0 h-full w-full bg-black/50 z-[100] transition-all  ${!props.show ? "opacity-0 pointer-events-none" : ""}`}
                    onClick={() => {
                        props.onCLose()
                    }}></div>

                <div
                    className={`fixed top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 w-[92%]  transition-all  rounded-2xl max-w-[24rem] max-h-[25rem] bg-white shadow z-[101] ${!props.show ? "opacity-0 scale-50 pointer-events-none" : ""}`}>
                    <div className={'h-full w-full  relative flex flex-col justify-start items-center'}>
                        <div ref={lottieRef} className={'h-20 scale-[1.8]'}></div>
                        <span className={'IranSansMedium pt-2 px-3'}>
                           خیـــلی خوش اومدی

                    </span>
                        <span className={'IranSans leading-7 pt-2 px-5 text-justify'}>

                    سلام به کتابخونه یونیمون خوش اومدی. اینجا جدای از این که کلی کتاب و جزوه برات داریم و میتونی اونی
                    که میخوای رو پیدا کنی... اگه کتاب یا جزوه ای داری میخوای به پول تبدیلش کنی میتونی اینجا اضافه کنی
                    تا به فروش برسه
                    </span>
                        <div></div>
                        <div className={' mt-5 mb-5 '}>
                            <Button onClick={() => {
                                props.onCLose()
                            }} rippleColor={'rgba(255,255,255,0.35)'}
                                    className={'w-32 h-14 bg-primary rounded-2xl pb-1 overflow-hidden'}>
                                <span className={'text-white text-lg IranSansMedium '}>مرسی</span>
                            </Button>

                        </div>
                    </div>
                </div>
            </>

        );
    else
        return <div></div>
};

export default WelcomLibary;
