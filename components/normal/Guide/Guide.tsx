import React from 'react';

const Guide = (props: {
    onCLose: Function
    show: boolean
    // className: string
    descriptionClassName: string
    titleClassName: string
    title: string
    description: string
    positionAndSizeClassNames: string
}) => {


    return (
        <>

            <div
                className={`fixed h-full w-full z-[102] top-0 left-0 opacity-0 ${props.show ? "" : ' pointer-events-none'}`}
                onClick={() => {
                    props.onCLose();
                }}></div>
            <div
                className={props.positionAndSizeClassNames + " guide fixed origin-center  flex flex-col justify-center items-center bg-transparent z-[100]  " + (props.show ? "" : " pointer-events-none transition-all 0.2s scale-[5] opacity-0")}>

            </div>

            <div
                className={props.titleClassName + (props.show ? "" : " pointer-events-none transition-all 0.2s opacity-0")}>{props.title}
            </div>

            <div
                className={props.descriptionClassName + (props.show ? "" : " pointer-events-none transition-all 0.2s opacity-0")}>{props.description}</div>
        </>

    );
};

export default Guide;
