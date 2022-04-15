import React, {useEffect, useRef} from 'react';
import lottie from "lottie-web";
import books from "../assets/animations/books.json";

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
    }, [])

    return (
        <div className={'w-full h-full overflow-hidden flex flex-col justify-start items-center'}>
            <div ref={lottieRef} className={'w-60'}/>

            <span className={'IranSansBold'}> کــتابخـونـه</span>
            <div className={'text-center IranSans text-textDarker text-sm px-4 mt-5 leading-6'}>
                توی
                <span className={'text-black IranSansBold'}> یونیـ<span
                    className={'text-primary'}>مـون </span></span>


                یه کتابخونه هم قراره احداث بشه که همین روزا کلی کتاب و جزوه از دانشگاه های مختلف توش قرار میگیره که
                میتونین ازشون استفاده کنید
            </div>
            <div className={'h-full w-full flex pb-40 flex-col justify-center items-center'}>
                <img src="/assets/stamps/soon.png" className={'w-32 mx-auto'} alt=""/>
            </div>

        </div>
    );
};

export default Library;