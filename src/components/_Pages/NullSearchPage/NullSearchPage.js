import React from 'react';


//css
import './style.css'
import BluePin from './icons/ActivatedPin.svg';
import WhitePin from './icons/UnactivePin.svg';
import DelIcon from './icons/DeleteIcon.svg';
import BackButton from './icons/ArrowRight.svg';

const NullSearchPage = () => {
    return (
        <div>
            <div className={"search-bar-container"} >
                <div className={"search-bar d-flex flex-row align-items-center"}>
                    <input placeholder={"جستجو"} dir={"rtl"}/>
                    <img src={BackButton} alt='Back Button'/>
                </div>
            </div>
            <div className={"d-flex flex-row justify-content-between paddings"}>
                <img src={DelIcon} alt="Delete Icon"/>
                <div className={"ml-auto"} style={{paddingRight: 15}}>
                    <span className={""} dir={"rtl"}>
                        جستجویی که پین کرده
                    </span>
                </div>
                <img src={BluePin} alt="Pined Item"/>
            </div>
            <div className={"d-flex justify-content-between paddings"}>
                <img src={DelIcon} alt="Delete Icon"/>
                    <div className={"ml-auto"} style={{paddingRight: 15}}>
                        <span className={""} dir={"rtl"}>
                            جستجویی که قبلا کرده
                        </span>
                    </div>
                    <img src={WhitePin} alt="Pined Button"/>
                </div>
            <div className={"d-flex justify-content-between paddings"}>
                <img src={DelIcon} alt="Delete Icon" className={"align-self-start"}/>
                <div className={"d-flex flex-column ml-auto"} style={{paddingRight: 15}}>
                    <span>
                        جستجویی که قبلا با فیلتر کرده
                    </span>
                    <div className={"d-flex flex-row-reverse"}>
                        <button className={"btn p-0 button-container"}>
                            فیلتر اول
                        </button>
                    </div>

                </div>
                <img src={WhitePin} alt="Pined Button" className={"align-self-start"}/>
            </div>
            <div className={"d-flex justify-content-between paddings"}>
                <img src={DelIcon} alt="Delete Icon"/>
                <div className={"ml-auto"} style={{paddingRight: 15}}>
                    <span className={""} dir={"rtl"}>
                        جستجویی که قبلا کرده
                    </span>
                </div>
                <img src={WhitePin} alt="Pined Button"/>
            </div>
        </div>
    );
};

export default NullSearchPage;