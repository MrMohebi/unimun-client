import React from 'react';
import Header from "../components/common/Header/Header";
import {passedTime} from "../helpers/passedTime";
import {useRouter} from "next/router";

const Notifications = () => {
    const router = useRouter();
    return (
        <div className={'overflow-y-scroll h-full'}>
            <Header title={'اعلان ها'} back={true} backOnClick={() => {
                router.back()
            }}/>
            <div className={'h-5'}/>
            <div className={'h-full w-1 rounded bg-textDark absolute right-3 top-24 '}/>

            <div
                className={'norif -mt-1 w-full overflow-hidden relative  flex flex-row justify-start items-start pl-3 pr-5  pb-6'}>
                <div className={'h-full w-4 absolute right-1.5 top-0  flex flex-col justify-center items-center '}>
                    <div className={'h-full w-1 rounded bg-primary '}/>
                    <div
                        className={'w-4 h-4 absolute rounded-2xl border border-4 border-background top-2 left-1/2 bg-primary -translate-x-1/2'}/>
                </div>
                <div className={'w-full flex flex-col justify-start items-center'}>
                    <div className={'w-full flex flex-row justify-between pt-0.5 items-center '}>
                        <span className={'IranSansMedium text-md pr-2 '}>سلام</span>
                        <span className={'IranSans text-sm pr-2 text-sm text-primary'}>{passedTime(1650806443)}</span>
                    </div>
                    <p className={'px-3 pt-5 IranSansMedium text-sm text-right w-full'}>
                        به یونیمون خوش اومدی!
                    </p>
                </div>
            </div>


        </div>
    );
};

export default Notifications;