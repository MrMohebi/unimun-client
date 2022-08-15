import React from 'react';

const Preview = () => {
    return (
        <div className={'h-full overflow-scroll'}>

            <div className={'w-full h-full flex flex-col justify-start items-center'}>


                <div className={'flex flex-col justify-center items-center w-full mt-20 '}>
                    <img src="/assets/image/noBookImage.png" className={'h-auto w-32'} alt=""/>
                    <div
                        className={'w-11/12 bg-white shadow-md rounded-2xl h-32 -translate-y-1/3 mx-2 flex flex-col justify-start items-center'}></div>
                </div>

            </div>

        </div>
    );
};

export default Preview;