import React from 'react';


//css
import './style.css'
import BluePin from './icons/ActivatedPin.svg';
import WhitePin from './icons/UnactivePin.svg';
import DelIcon from './icons/DeleteIcon.svg';

const NullSearchPage = () => {
    return (
        <div>
            <div>
                Search-Bar goes here
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
                        <button className={"btn p-0 buttons-style"}>
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