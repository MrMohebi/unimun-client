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
}

const Header = ({alignment, back, title, children, backOnClick}: Props) => {

    return (
        <div dir={'ltr'}
             className={`w-full items-center shadow-sm flex bg-white px-3 h-12 overflow-hidden ${alignment === 'center' ? 'justify-center flex-row-reverse' : alignment === 'left' ? 'flex-row' : alignment === 'between' ? 'justify-between' : alignment === 'right' ? 'flex-row-reverse' : ''}`}>
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
                        <span className={'IranSansMedium text-md '}>{title} </span>
                    </div>
                    :
                    null
            }

            {
                children
            }


        </div>
    );
};

export default Header;