import React from 'react';

interface Props {
    children: any
    open: boolean
    closable: boolean
    afterClosed?: Function
}

const Dialog = (props: Props) => {
    return (
        <div onClick={(e) => {
            if (e.target === e.currentTarget)
                if (props.closable) {
                    if (props.afterClosed)
                        props.afterClosed()
                }
        }}
             className={`${props.open ? 'opacity-100 delay-0 pointer-events-auto' : 'opacity-0 pointer-events-none delay-300 '} ease-in-out px-4 duration-300 fixed w-full h-full top-0 transition-all left-0 z-50`}
             style={{background: 'rgba(0,0,0,0.45)'}}>

            <div
                className={`w-11/12 fixed  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full bg-white  rounded-2xl ease-in-out duration-300 overflow-hidden transition-all ${props.open ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                {props.children}
            </div>

        </div>
    );
};

export default Dialog;