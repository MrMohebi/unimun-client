import React, {useState}from 'react';
import BackButton from "../NullSearchPage/icons/ArrowRight.svg";
import {Slider, Checkbox}from '@mui/material';

import './style.css'
const FilterSearchPage = () => {

    function textValue(value) {
        return value;
    }
    const [value, setValue] = useState([100, 250]);
    const [maxLength] = useState(450);
    const [sliderMarksStep] = useState(30);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <div>
            <div className={"search-bar-container"}>
                <div className={"search-bar d-flex flex-row align-items-center"}>
                    <input placeholder={"جستجو"} dir={"rtl"}/>
                    <img src={BackButton} alt='Back Button'/>
                </div>
            </div>
            <div className="filter-page-container d-flex flex-column">
                <span className="blue-text ml-auto">
                    فیلترها
                </span>
                <div className="d-flex flex-row justify-content-between">
                    <span>
                        موضوع آگهی
                    </span>
                    <span>
                        موضوع
                    </span>
                </div>
            </div>
            <div className="filter-page-container d-flex flex-column">
                <div className="d-flex flex-row justify-content-between">
                    <span>
                        از 10 تا 450 هزارتومان
                    </span>
                    <span>
                        بودجه
                    </span>
                </div>
                <div className="slider-container align-self-center">
                    <Slider className="slider-color"
                        getAriaLabel={() => 'Minimum distance'}
                        onChange={handleChange}
                        value={value}
                        step={5}
                        min={0}
                        max={maxLength}
                        marks={Array(maxLength/sliderMarksStep).fill.map((_, index)=>({value:index* sliderMarksStep, label:"'"}))}
                        getAriaValueText={textValue}
                        valueLabelDisplay="auto"
                        disableSwap
                    />
                </div>
            </div>
            <div className="filter-page-container d-flex flex-row justify-content-between">
                <span>
                    نام دانشگاه
                </span>
                <span>
                    دانشگاه
                </span>
            </div>
            <div className="d-flex flex-row-reverse align-items-center">
                <Checkbox/>
                <span className="pt-2">
                    فقط آگهی های فوری
                </span>
            </div>
            <div className="filter-page-container d-flex flex-row-reverse">
                <span className="page-footer">
                    با انجام دادن آگهی های فوری امتیاز بیشتری دریافت میکنید
                </span>
            </div>
        </div>
    );
};

export default FilterSearchPage;