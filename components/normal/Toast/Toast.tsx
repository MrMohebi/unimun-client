import React from 'react';
import {cssTransition, toast} from "react-toastify";


const Toast = (text: string, style?: string, autoClose?: any, icon?: string | React.ReactElement, bottom?: number) => {


    const bounce = cssTransition({
        enter: "animate__animated animate__fadeInUp",
        exit: "animate__animated animate__fadeOutDown"
    });
    let styles = {


        "normal": {
            bottom: (bottom ?? '40') + 'px',
            width: '95%',
            height: '1.2rem',
            minHeight: '3.3 rem',
            borderRadius: ' 20px',
            padding: '10px',
            display: 'flex',
            flexFlow: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            writable: true

        },
        'test': {
            bottom: (bottom ?? '40') + 'px',
            width: '95%',
            height: "3rem",
            minHeight: "3rem",
            borderRadius: ' 1rem',
            padding: '0px',
            display: 'flex',
            flexFlow: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            background: "rgba(255,255,255,0.9)",
            writable: true
        }
    } as any


    let changedStyle;

    if (style)
        changedStyle = {...styles[style]}
    else
        changedStyle = styles["normal"]

    toast.info(text, {
        icon: icon ?? ' ',
        position: "bottom-center",
        autoClose: autoClose ?? false,
        pauseOnHover: true,
        closeButton: <div/>,
        style: changedStyle,
        transition: bounce
    });
}
export default Toast;