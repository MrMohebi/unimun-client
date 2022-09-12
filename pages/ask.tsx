import React, {useEffect, useRef} from 'react';
import lottie from 'lottie-web'
import ask from '../assets/animations/chat.json'
import HelpSvg from "../assets/svgs/help.svg";
import {currentNavActiveIndex} from "../store/navbar";

const Ask = () => {

    const lottieRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (lottieRef.current)
            lottie.loadAnimation({
                container: lottieRef.current,
                renderer: "svg",
                animationData: ask,
                loop: true,
                autoplay: true
            })
        currentNavActiveIndex(0)

    }, [])

    return (
        <div className={'w-full h-full overflow-hidden flex flex-col justify-start items-center'}>

            <div ref={lottieRef} className={'  w-60'}/>

            <span className={'IranSansBold'}> بـپــرس!</span>
            <div className={'text-center IranSans text-textDarker text-sm px-4 mt-5 leading-6'}>
                یه بخش خیلی جذابه که به زودی به <span className={'text-black IranSansBold'}>یونیـ<span
                className={'text-primary'}>مـون</span></span> اضافه میشه <br/>
                تو این بخش میتونی سوالایی که داری رو بپرسی تا اونایی که بلدن بهت جواب بدن
            </div>
            <div className={'h-full w-full flex pb-40 flex-col justify-center items-center'}>
                <img src="/assets/stamps/soon.png" className={'w-32 mx-auto'} alt=""/>
            </div>
        </div>
    );
};

export default Ask;