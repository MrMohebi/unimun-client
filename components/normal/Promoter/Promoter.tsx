import React from 'react';
import Button from "../../view/Button/Button";


interface Props {
    icon: string
    text: string
    image: string
    className: string
    buttonText: string
}

const Promoter = (props: Props) => {
    return (
        <div
            className={` w-full  rounded-2xl p-2 bg-white shadow flex-col justify-center items-center  ${props.className}`}>
            <div className={'w-full h-full relative'}>
                <div className={'flex flex-row'}>
                    <img className={'w-32 h-32'} src={props.image} alt="Unimun Promoter"/>
                    <div
                        className={'w-full px-3 text-textDarker row-span-4 text-center text-justify pl-9 IranSansMedium text-sm'}>
                        <span>{props.text}</span>
                    </div>
                </div>
                <img className={'w-5 h-5 absolute left-3 row-span-4 top-3'} src={props.icon} alt="Unimun Promoter"/>
                <Button id={'promoter-button'}
                        className={'w-full   bg-transparent border border-primary rounded-lg text-center mt-3 text-primary IranSansMedium h-8'}
                        rippleColor={'rgba(0,111,255,0.59)'}>{props.buttonText}</Button>

            </div>

        </div>
    );
};

export default Promoter;