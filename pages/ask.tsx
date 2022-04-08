import React, {useEffect, useRef} from 'react';
import lottie from 'lottie-web'
import ask from '../assets/animations/chat.json'

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
    }, [])

    return (
        <div className={'w-full flex flex-col justify-start items-center'}>
            <div ref={lottieRef} className={'  w-60'}/>

            <span className={'IranSansBold'}> بـپــرس!</span>
            <div className={'text-center IranSans text-textDarker text-sm px-10 mt-5 leading-6'}>
                یه بخش خیلی جذابه که به زودی به <span className={'text-black'}>یونی<span
                className={'text-primary'}>مـون</span></span> اضافه میشه <br/>
                تو این بخش میتونی سوالایی که داری رو بپرسی تا اونایی که بلدن بهت جواب بدن
            </div>
        </div>
    );
};

export default Ask;