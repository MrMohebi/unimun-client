import React from 'react';
import BackButton from "../../../assets/svgCodes/BackButton";


interface Props {
    alignment?: string,
    back?: boolean | string,
    backOnClick?: any
    title?: string,
    children?: any,
    background?: string,
    blurBackground?: boolean
    noShadow?: boolean
}

const Header = ({alignment, back, title, children, backOnClick, noShadow, blurBackground}: Props) => {

    return (
        <div className={'h-12'}>
            <div dir={alignment ?? 'rtl'}
                 className={`w-full items-center absolute top-0 left-0 z-40 ${noShadow ? "" : 'shadow-sm'}  flex  px-3 h-12 overflow-hidden ${alignment === 'center' ? 'justify-center flex-row-reverse' : alignment === 'left' ? 'flex-row' : alignment === 'between' ? 'justify-between' : alignment === 'right' ? 'flex-row-reverse' : ''} ${blurBackground ? "bg-white/70 backdrop-blur" : "bg-white"}`}>
                {
                    back ?
                        <div className={'px-1'} onClick={() => {
                            backOnClick()
                        }}>
                            {BackButton}
                        </div>
                        :
                        null
                }
                {
                    title ?
                        <div className={'px-2 -mt-2'}>
                            <span className={'IranSansMedium text-sm '}>{title} </span>
                        </div>
                        :
                        null
                }
                {
                    children
                }
            </div>
        </div>

    );
};

export default Header;