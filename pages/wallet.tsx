import React, {useEffect, useRef} from 'react';
import lottie from "lottie-web";
import books from "../assets/animations/books.json";
import WalletSVG from '../assets/svgs/wallet.svg'
import {currentNavActiveIndex} from "../store/navbar";

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

    return (
        <div className={'w-full h-full overflow-hidden flex flex-col justify-start items-center'}>
            <div className={'w-full mt-10'}>
                <WalletSVG/>
            </div>

            <span className={'IranSansBold'}> کــیــف پـول</span>
            <div className={'text-center IranSans text-textDarker text-sm px-4 mt-5 leading-6'}>
                توی
                <span> </span>
                <span className={'text-black IranSansBold'}> یونیـ<span
                    className={'text-primary'}>مـون </span></span>ممکنه پول لازمت بشه
                یه کیف پول خیلی باحال برات قراره به زودی فعال بشه تا بتونی پولاتو اینجا نگه داری
            </div>
            <div className={'h-full w-full flex pb-40 flex-col justify-center items-center'}>
                <img src="/assets/stamps/soon.png" className={'w-32 mx-auto'} alt=""/>
            </div>
        </div>
    );
};

export default Library;