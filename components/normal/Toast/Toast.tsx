import React from 'react';
import {toast} from "react-toastify";


const Toast = (text: string, style?: string, autoClose?: any, icon?: string | React.ReactElement, bottom?: number) => {

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
        style: changedStyle
    });
}
export default Toast;