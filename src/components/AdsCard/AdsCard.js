import React from 'react';

//css
import './style.css'
import noteBook from "./icons/noteBookIcon.svg";
import views from "./icons/eye.svg";
import immediate from'./icons/fori-sign.svg';


const AdsCard = ({adsTitle, adsCategory, adsPrice, adsOptions}) => {
    // let prices
    return (
        <div className={"ads-card-container"}>
            <div className={"d-flex flex-row-reverse justify-content-between h-100"}>
                <div className="d-flex flex-column justify-content-between align-items-end">
                    <div>
                        <h6 className={"IranSansBold"}>{adsTitle}</h6>
                        <span className={"IranSansMedium ad-category d-flex flex-row-reverse"}>{adsCategory}</span>
                    </div>
                    <span className={"IranSansBold ad-price"} style={{fontSize:"0.7em"}}>
                        بدون محدودیت
                    </span>
                </div>
                <div className="d-flex flex-column justify-content-between">
                    <img src={noteBook} alt={'note book icon'} style={{height:30, width:30}}/>
                    <div className={"d-flex flex-row-reverse"}>
                        <span>23</span>
                        <img src={views} alt={"Shows the number of views"} style={{height:12, width:15}}/>
                        <span style={{color:"#1DA1F2"}}>|</span><span dir={"rtl"}>4 ساعت پیش</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdsCard;