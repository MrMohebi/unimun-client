import React from 'react';

//css
import './style.css'
import AdsCard from "../../AdsCard/AdsCard";
import BackButton from "../NullSearchPage/icons/ArrowRight.svg";
import DelIcon from '../NullSearchPage/icons/DeleteIcon.svg';

const SearchPageTyping = () => {
    return (
        <div>
            <div className={"search-bar-container"} >
                <div className={"search-bar d-flex flex-row align-items-center"}>
                    <div className="select-uni-search p-1 d-flex flex-row align-items-center">
                        <img src={DelIcon} alt='Clear Search'/>
                    </div>
                    <input placeholder={"جستجو"} dir={"rtl"}/>
                    <img src={BackButton} alt='Back Button'/>
                </div>
            </div>
            <div className="typing-page-container d-flex flex-row justify-content-between">
                <div dir={"rtl"} className={"d-flex flex-row-reverse"}>
                    <span>
                        آگهی
                    </span>
                    <span style={{paddingLeft: 10}}>
                        +40
                    </span>
                </div>
                <div className={"d-flex flex-column"}>
                    <span>
                        پیشنهاد اول
                    </span>
                    <span className={"d-flex flex-row-reverse"} style={{fontSize:""}}>
                        در موضوع
                    </span>
                </div>
            </div>
            <div className="border-bottom ml-4 mr-4 mt-3"/>
            <div>
                <AdsCard adsTitle={"عنوان آگهی"} adsCategory={"موضوع آگهی"}/>
            </div>
            <div className="border-bottom ml-4 mr-4 mt-3 mb-3"/>
            <div className={"d-flex justify-content-center"}>
                <span style={{color:"#1DA1F2"}}>
                    مشاهده آگهی های مشابه
                </span>
            </div>
        </div>
    );
};

export default SearchPageTyping;