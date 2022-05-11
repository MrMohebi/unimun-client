import React from 'react';
import ImageSlider from "../../../components/normal/ImageSlider/ImageSlider";
import Header from "../../../components/common/Header/Header";

const Book = () => {


    return (
        <div>
            <Header backOnClick={() => {

            }} back={true} title={'کتاب'}/>
            <ImageSlider images={['']}/>

        </div>
    );
};

export default Book;