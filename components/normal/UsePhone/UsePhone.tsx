import React, {useEffect, useState} from 'react';

import Mobile from '../../../assets/svgs/mobile.svg'
import Button from "../../view/Button/Button";

const UsePhone = () => {


    const [phoneAlert, setPhoneAlert] = useState(false);
    const [destroy, setDestroy] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setPhoneAlert(true)
        }, 2000);
        setTimeout(() => {
            setDestroy(true)
        }, 30000);
    }, []);

    if (!destroy)
        return (
            <div
                className={`w-full  ${phoneAlert ? 'opacity-100' : 'opacity-0 '} transition-all duration-300  flex flex-col justify-center items-center  animate__faster h-full fixed top-0 left-0 backdrop-blur-md z-50`}>

                <div
                    className={` pb-4 px-4 pt-4 ${phoneAlert ? 'scale-100' : 'scale-0'} duration-300 delay-200 transition-all  rounded-3xl bg-white shadow  z-50 flex flex-col justify-center items-center flex flex-col justify-center items-center`}
                >

                    <div className={'w-full flex flex-row justify-start items-center mb-3 px-3'}>
                        <div className={'w-9 h-9 ml-3 flex flex-col justify-center items-start'}>
                            <Mobile/>
                        </div>
                        <span className={' text-right leading-7 IranSansMedium'}>
                            <span className={'whitespace-nowrap'}>
                                                        بـرای تـجـربـه ی بهـتـر

                            </span>
                        <br/>
                            <span className={'whitespace-nowrap'}>
                                                        از تـلفن همـراه استـفاده کنیـد

                            </span>
                    </span>
                    </div>


                    <Button id={'use-phone'} className={'w-full h-14 bg-primary mx-10 rounded-2xl'}
                            rippleColor={'rgba(255,255,255,0.17)'} onClick={() => {
                        setPhoneAlert(false)

                        setTimeout(() => {
                            setDestroy(true)
                        }, 500);
                        // setTimeout(() => {
                        //     setPhoneAlert(true)
                        // }, 2000);
                    }}>
                        <span className={'IranSansMedium text-white text-lg'}>اوکـی </span>
                    </Button>
                </div>


            </div>
        );

    else
        return null

};

export default UsePhone;
