import React from 'react';
import {toast} from "react-toastify";

const Toast = (text: string) => {
    toast.info(text, {
        position: "bottom-center",
        autoClose: 2000,
        pauseOnHover: true,
        closeButton: <div/>,
        style: {
            bottom: '10px',
            width: '95%',
            borderRadius: ' 20px',
            padding: '10px',
            display: 'flex',
            flexFlow: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto'
        }
    });
}
export default Toast;