import React from 'react';

interface Props {
    open: boolean
    children: any
    onClose: Function
}

const BottomSheet = (props: Props) => {
    return (
        <div
            className={`fixed w-full h-full top-0 left-0  ${props.open ? "pointer-events-auto" : "pointer-events-none"} z-[50]  `}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    props.onClose()
                }
            }}
            style={{background: props.open ? 'rgba(0,0,0,0.42)' : 'rgba(255,255,255,0)', zIndex: '60'}}>

            <div
                className={`absolute bottom-0 bg-white rounded-tr-2xl overflow-hidden rounded-tl-2xl h-auto transition-all w-full duration-150 ${props.open ? 'translate-y-0' : 'translate-y-full'}`}>
                {
                    props.children
                }
            </div>

        </div>
    );
};

export default BottomSheet;