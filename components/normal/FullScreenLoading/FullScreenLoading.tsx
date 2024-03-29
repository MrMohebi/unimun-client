import React from 'react';
import LoadingDialog from "../../view/LoadingDialog/LoadingDialog";

const FullScreenLoading = (props: { show: boolean, dim?: boolean, whiteBack?: boolean }) => {
    return (
        <div
            style={{
                background: props.dim ? 'rgba(0,0,0,0.4)' : "transparent"
            }}
            className={`fixed w-full h-full top-0 left-0  z-50 flex flex-col justify-center items-center transition-all ${props.show ? '' : 'pointer-events-none opacity-0 '} ${props.whiteBack ? "bg-white" : ''}`}>
            <LoadingDialog wrapperClassName={'w-20 h-20 bg-white rounded-xl '} color={'#1da1f2'}/>
        </div>
    );
};

export default FullScreenLoading;