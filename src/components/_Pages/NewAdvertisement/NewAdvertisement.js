import React,{useState} from 'react';
import {Input,Button} from "@material-ui/core";

import "./style.css"

const NewAdvertisement = () => {
    let [title, setTitle] = useState(null)
    let [price, setPrice] = useState(null)

    let handleSubmit = () =>{
        console.log(title, price)
    }

    return (
        <div className={"new-advertisement-container d-flex flex-column align-items-center justify-content-between"}>
            <Input className={"material-input-rtl"} lable="عنوان" value={title} onChange={(e)=>{setTitle(e.target.value)}} />
            <Input lable="قیمت" type={"number"} value={price} onChange={(e)=>{setPrice(e.target.value)}} />
            <Button onClick={handleSubmit} variant={"outlined"}>ثبت</Button>
        </div>
    );
};

export default NewAdvertisement;