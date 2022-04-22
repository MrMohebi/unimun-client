import React, {useEffect, useRef, useState} from 'react';
import BackButton from "../assets/svgCodes/BackButton";
import CopySVG from "../assets/svgs/copy.svg";
import PostBox from "../assets/svgs/postbox.svg";
import {useRouter} from "next/router";
import InviteSVG from '../assets/svgs/invite.svg'
import CircularProgressBar from "../components/view/CircularProgressBar/CircularProgressBar";
import {getToken} from "../helpers/TokenHelper";
import {gql, useLazyQuery} from "@apollo/client";
import {getUserQuery} from "../Requests/normal/user";
import LoadingDialog from "../components/view/LoadingDialog/LoadingDialog";

const Invite = () => {

    const router = useRouter()

    const [refCode, sRefCode] = useState('')
    const [refCodeLeft, sRefCodeLeft] = useState('0')
    const refCodeLeftEl = useRef<HTMLSpanElement>(null)

    const [getUser, {
        data,
        loading
    }] = useLazyQuery(gql`${getUserQuery(['referenceCode','referenceCodeLeft']).query}`)
    useEffect(() => {
        console.log(getToken())
        getUser().then(e => {
            sRefCode(e.data.user.data.referenceCode ?? '')
            sRefCodeLeft(e.data.user.data.referenceCodeLeft)
        })
    }, [])
    return (
        <div className={'flex flex-col justify-start items-center'}>

            {
                loading ?
                    <div className={'fixed top-0 left-0 w-full h-full z-50 '} style={{background: 'rgba(0,0,0,0.4)'}}>
                        <div
                            className={'top-1/2 left-1/2 fixed bg-white rounded-3xl shadow p-4 -translate-x-1/2 -translate-y-1/2'}>
                            <LoadingDialog wrapperClassName={' w-16 h-16  '} color={'blue'}/>

                        </div>
                    </div>
                    : null
            }

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
                <div className={'h-10 w-10 flex flex-col justify-center items-center relative'}>
                    <CircularProgressBar sqSize={30} strokeWidth={5} percentage={(parseInt(refCodeLeft) * 100) / 10}
                                         color={'#1da1f2'}/>
                    <span ref={refCodeLeftEl}
                          className={'absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 IranSans'}>{refCodeLeft}</span>
                </div>

                <span className={'font-medium select-all'}>{refCode}</span>
                <div className={'w-10 h-10 '}>
                    <CopySVG/>
                </div>
            </div>
            <div className={'max-w-sm w-full h-full '} onClick={() => {
                window.open('https://www.instagram.com/p/CcqW8BHr2yD/?utm_source=ig_web_copy_link', '_blank')
            }}>
                <PostBox/>
            </div>
        </div>
    );
};

export default Invite;