import React, {useEffect, useState} from 'react';

interface Props {
    wrapperClassName?: string
    className?: string
    placeHolder?: string
    onChange?: Function
    defaultValue?: string
    maxLen?: number
}

const MaterialInput = (props: Props) => {
    const text = useState("");

    useEffect(() => {
        text[1](props.defaultValue ?? '')
    }, [])
    return (
        <div className={`relative ${props.wrapperClassName} `}>
            <input maxLength={props.maxLen} defaultValue={props.defaultValue ?? ''} onChange={(e) => {

                text[1](e.currentTarget.value)
                if (props.onChange)
                    props.onChange(e)
            }} className={`w-full IranSans h-full bg-transparent outline-0 px-2 border-b ${props.className ?? ''}`}/>
            <div
                className={`${text[0] ? '-top-3 right-0 mr-0 text-sm' : 'top-1/2 -translate-y-1/2 right-0 text-md '} pointer-events-none mr-2  absolute transition-all IranSans text-textDark`}>{props.placeHolder}</div>
        </div>
    );
};

export default MaterialInput;