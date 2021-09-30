import React from 'react';

//css
import './style.css'
import buildings from './icons/buildings.svg';
import uniPicture from './icons/uniPic.svg'

const SearchPage = () => {
    return (
        <div>
            <div className={"paddings d-flex flex-row-reverse"} style={{paddingTop:25}}>
                <img src={buildings} alt="select Uni"/>
                <span className={"text-color-black"} style={{paddingRight:10}}>
                    دانشگاه شهید باهنر کرمان
                </span>
            </div>
            <div className={"paddings d-flex flex-row-reverse"}>
                <span dir={"rtl"} className={"text-color-blue end"}>
                    جستجو در همه دانشگاه ها
                </span>
            </div>
            <div className={"paddings d-flex flex-row-reverse justify-content-between"}>
                <img src={uniPicture} alt="Uni logo" style={{height:49, width:49}}/>
                <div className={"d-flex flex-column ml-auto"} dir={"rtl"} style={{paddingRight:12}}>
                    <span className={"text-color-black"}>
                        دانشگاه شهید باهنر کرمان
                    </span>
                    <span className={"text-color-black d-flex flex-row"}>
                        کرمان
                    </span>
                </div>
                <span className={"text-color-blue align-self-center me-auto"}>
                    درباره
                </span>
            </div>
        </div>
    );
};

export default SearchPage;