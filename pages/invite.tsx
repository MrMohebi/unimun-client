import React from 'react';
import BackButton from "../assets/svgCodes/BackButton";
import CopySVG from "../assets/svgs/copy.svg";
import PostBox from "../assets/svgs/postbox.svg";
import {useRouter} from "next/router";
import InviteSVG from '../assets/svgs/invite.svg'
import CircularProgressBar from "../components/view/CircularProgressBar/CircularProgressBar";

const Invite = () => {

    const router = useRouter()
    return (
        <div className={'flex flex-col justify-start items-center'}>
            <div className={'w-full pr-4 pt-3'}>
                <div onClick={() => {
                    router.push('/')
                }}>
                    {BackButton}
                </div>
            </div>

            <div className={'h-52 w-52 mx-auto mt-10'}>
                <InviteSVG/>
            </div>
            <span className={'IranSansBold text-lg mx-auto pt-6'}>دعوت از دوستان</span>

            <div className={'IranSansMedium mt-5 text-textDark'}>
                ده نفر از دوستان خودتون رو به یونیمون دعوت کنید
                <br/>
                و به ازای هر دعوت 80 <span className={'text-black IranSansBold'}>یـونی</span> <span
                className={'IranSansBold text-primary'}>کویـن</span> هدیه بگیرید
            </div>

            <div className={'w-52 h-16 mt-5 bg-white rounded-2xl shadow flex flex-row justify-around items-center'}>
                <CircularProgressBar sqSize={30} strokeWidth={5} percentage={5} color={'#1da1f2'}/>
                <span className={'font-medium select-all'}>MRM755</span>
                <div className={'w-10 h-10 '}>
                    <CopySVG/>
                </div>
            </div>
            <div className={'max-w-sm w-full h-full'}>
                <PostBox/>
            </div>
        </div>
    );
};

export default Invite;