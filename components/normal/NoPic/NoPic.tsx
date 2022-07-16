import React from 'react';
import Nopic from '../../../assets/svgs/nopic.svg'
import Lib from '../../../assets/svgs/library.svg'
import Unimun from '../../../assets/svgs/unimun.svg'

const NoPic = () => {
    return (
        <div className={'w-full h-full flex bg-background flex-col justify-center items-center'}>
            <div className={'h-10'}/>


            <div className={'w-10'}>
                <Nopic/>
            </div>

            <div className={'w-14 mt-5'}>
                <Lib/>
            </div>

            <div className={'h-8'}/>


            <div className={'w-10 '}>
                <Unimun/>
            </div>
            <div className={'h-5'}></div>


        </div>
    );
};

export default NoPic;