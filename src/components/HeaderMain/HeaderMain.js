import React from 'react';
import directIcon from "./icons/directIcon.svg";

import "./style.css"

const HeaderMain = () => {
    return (
        <div className={"d-flex flex-row justify-content-between align-items-center header-main"}>
            <img src={directIcon} alt='directIcon' style={{height:30, width:30}}/>
            <div className={"d-flex flex-row-reverse IranSansBold"}>
                <span style={{color: '#000'}}>
                    یونیـــ
                </span>
                <span style={{color: '#1da1f2'}}>
                                مون
                </span>
            </div>
        </div>
    );
};

export default HeaderMain;