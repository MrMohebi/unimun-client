import React, {useEffect, useState} from 'react';
import Library from '../../assets/svgs/library.svg';

const Scan = () => {
    const [data, setData] = useState("")

    useEffect(() => {
        setTimeout(
            () => {
                setData("fad")

            }, 1000
        )
    }, [])
    return (
        <div className={'h-full overflow-scroll pb-20'}>

            <div className={'w-full pt-16  flex flex-col justify-center items-center  '}>
                <div className={'w-24'}>
                    <Library/>

                </div>


                <span className={'IranSans mt-10 '}> بارکـد کتاب را اسکن کنید</span>
                <p className={'text-center IranSans text-[0.75rem] block mt-3 text-textDark'}>کتاب که الان تو دستاته به
                    همین سادگی میتونه تو یونیمون به فروش برسه
                    <br/>
                    فقط کافیه اکسنش کنی
                </p>
                <div className={'w-72 h-72 border-primary border-2  rounded-2xl overflow-hidden mt-5 '}>


                </div>
                <img className={'w-24 mt-3 h-auto'} src="/assets/image/qr-sample.png" alt=""/>
                <span className={'IranSansMedium'}>یه همچین بارکـدی باید رو کتابت باشه
</span>
            </div>


        </div>
    );
};

export default Scan;