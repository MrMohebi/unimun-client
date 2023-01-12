import React, {useEffect, useRef} from 'react';
import lottie from 'lottie-web';
import upload from "../../../assets/animations/upload.json";
import CircularProgressBar from "../../view/CircularProgressBar/CircularProgressBar";


const UploadingFileLoading = (props: { show: boolean, dim?: boolean, whiteBack?: boolean, uploadPercentage: number }) => {


    const lottieRef = useRef(null);


    useEffect(() => {
        if (lottieRef.current)
            lottie.loadAnimation({
                container: lottieRef.current,
                renderer: "svg",
                animationData: upload,
                loop: true,
                autoplay: true
            })
    }, []);

    return (
        <div
            style={{
                background: props.dim ? 'rgba(0,0,0,0.4)' : "transparent"
            }}
            className={`fixed w-full h-full top-0 left-0   z-50 flex flex-col justify-center items-center transition-all ${props.show ? '' : 'pointer-events-none opacity-0 '} ${props.whiteBack ? "bg-white" : ''}`}>
            <div className={'h-60 w-60 flex flex-col justify-center items-center bg-white shadow rounded-2xl'}>
                <h2 className={"IranSansMedium mt-2 text-textDark"}>در حال آپلود فایل ها...</h2>
                <div className={'w-40 h-40'} ref={lottieRef}></div>

                <CircularProgressBar sqSize={40} strokeWidth={2} percentage={props.uploadPercentage} color={'#1da1f2'}/>
                <p className={'IranSans mt-1'}>{props.uploadPercentage}%</p>
            </div>

            {/*<LoadingDialog wrapperClassName={'w-20 h-20 bg-white rounded-xl '} color={'#1da1f2'}/>*/}
        </div>
    );
};

export default UploadingFileLoading;