import React from 'react';


//css
import './style.css'
import BluePin from './icons/ActivatedPin.svg';
import WhitePin from './icons/UnactivePin.svg';
import DelIcon from './icons/DeleteIcon.svg';
import BackButton from './icons/ArrowRight.svg';

const NullSearchPage = () => {

    let filters = [{text:"فیزیک"},{text:"حل تمرین"},{text:"ریاضی دو"},{text:"پیاز"},{text:"سیب زمینی"},{text:"پزتقال"},{text:"هلو"}]

    return (
        <div>
            <div className={"search-bar-container"}>
                <div className={"search-bar d-flex flex-row align-items-center"}>
                    <input placeholder={"جستجو"} dir={"rtl"}/>
                    <img src={BackButton} alt='Back Button'/>
                </div>
            </div>
            <div className={"page-container d-flex flex-row justify-content-between"}>
                <img src={DelIcon} alt="Delete Icon"/>
                <div className={"ml-auto"}>
                    <span className="" dir={"rtl"}>
                        جستجویی که پین کرده
                    </span>
                </div>
                <img src={BluePin} alt="Pined Item" className="pin-img"/>
            </div>
            <div className={"page-container d-flex justify-content-between"}>
                <img src={DelIcon} alt="Delete Icon"/>
                    <div className={"ml-auto"}>
                        <span dir={"rtl"}>
                            جستجویی که قبلا کرده
                        </span>
                    </div>
                    <img src={WhitePin} alt="Pined Button" className="pin-img"/>
                </div>
            <div className="page-container d-flex flex-column">
                <div className="d-flex flex-row justify-content-end">
                    <img src={DelIcon} alt="Delete Icon" className={"mr-auto"}/>
                    <span className="">
                        جستجویی که قبلا با فیلتر کرده
                    </span>
                    <img src={WhitePin} alt="Pined Button" className={"pin-img"}/>
                </div>

                <div className={"d-flex flex-row-reverse"} style={{overflowX: 'scroll'}}>
                    {filters.map(filter=>{
                        return(
                            <button className={"filter-btn btn"}>
                                {filter.text}
                            </button>
                        )
                    })}
                </div>
                    {/*<div className="d-flex flex-row-reverse flex-nowrap overflow-">*/}
                    {/*    */}
                    {/*</div>*/}

                {/*</div>*/}
            </div>
            <div className={"page-container d-flex justify-content-between"}>
                <img src={DelIcon} alt="Delete Icon" />
                <div className={"ml-auto"}>
                    <span className={""} dir={"rtl"}>
                        جستجویی که قبلا کرده
                    </span>
                </div>
                <img src={WhitePin} alt="Pined Button" className="pin-img"/>
            </div>
        </div>
    );
};

export default NullSearchPage;