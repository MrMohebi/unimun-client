import React, {useEffect, useRef, useState} from 'react';
import Header from "../../components/common/Header/Header";
import Input from "../../components/view/Input/Input";
import Button from "../../components/view/Button/Button";
import VCodeInput from "../../components/normal/profile/VCodeInput/VCodeInput";
import * as queryBuilder from 'gql-query-builder'
import {gql, useLazyQuery, useMutation, makeVar} from "@apollo/client";
import {useRouter} from "next/router";
import {IsLoggedIn} from "../../store/user";
import {Token} from "../../store/user";
import PostSVG from '../../assets/svgs/post.svg'
import {SendVCodeQuery, VerifyVCode} from "../../queries/normal/login";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('00000000000')
    const [currentStep, setStep] = useState(0)
    const [allowForNextStep, setAllowForNextStep] = useState(false)
    const [vCodeHint, setVCodeHint] = useState(0)
    const [vCodeError, setVCodeError] = useState(false)
    const [vCode, setVCode] = useState("")
    const [referenceCode, setReferenceCode] = useState("")
    const router = useRouter()


    const [sendVcode, sendVCodeResult] = useMutation(gql`${SendVCodeQuery(phoneNumber).query}`, {variables: SendVCodeQuery(phoneNumber).variables})
    const [verifyVCode, verifyVCodeResult] = useMutation(gql`${VerifyVCode(phoneNumber,vCode,referenceCode).query}`, {variables: VerifyVCode(phoneNumber, vCode, referenceCode).variables})
    // const [setName, setNameResult] = useMutation(gql`${VerifyVCode.query}`, {variables: VerifyVCode.variables})

    let phoneNumberValidation = (phone: string) => {
        if (phone[0] === '0' && phone[1] === '9') {
            if (phone.length === 11) {
                return true;
            }
        }
        return false;
    }

    let codeValidation = (code: string) => {
        return code.length === 4;
    }
    let stepBack = () => {
        sendVCodeResult.reset()
        setStep(0)
    }

    const steps = [
        {
            title: 'شماره تلفن خود را وارد کنید',
            description: 'یک کد برای این شماره ارسال خواهد شد!'
        },
        {
            title: 'کـد دعـوت دارید ؟',
            description: `واسه وارد شدن به یونیمون ، لازمه که از طرف یکی دعوت شده باشید و کد دعوتش رو در کادر زیر وارد کنید!`
        },
        {
            title: 'کد تایید را وارد کنید',
            description: `برای ${phoneNumber} یک کد ارسال شده که خیلی محرمانه هست! بدون این که کسی ببینه واردش کنید :)`
        },
        {
            title: 'میشه اسمتونو بدونیم ؟',
            description: 'اسم شما برای نمایش داده شدن به کاربر های دیگر استفاده میشود'
        },

    ]


    const nextStep = () => {
        setAllowForNextStep(false)
        if (currentStep === steps.length - 1) {

        } else {
            setStep(currentStep + 1)
        }
    }
    useEffect(() => {


        if (sendVCodeResult.data) {
            console.log(sendVCodeResult)
            if (sendVCodeResult.data.sendVCode.data.vCode) {
                setVCodeHint(parseInt(sendVCodeResult.data.sendVCode.data.vCode[0]))
            }
            if (sendVCodeResult.data.sendVCode.data.isSignup) {
                setStep(1)
            }
            if (!sendVCodeResult.data.sendVCode.data.isSignup) {
                setStep(2)
            }
        }
        if (verifyVCodeResult.data) {
            console.log(verifyVCodeResult)
            if (verifyVCodeResult.data.verifyVCode.status === "SUCCESS" && sendVCodeResult.data.sendVCode.data.isSignup) {
                setStep(3)
            }
            if (verifyVCodeResult.data.verifyVCode.status === "SUCCESS" && !sendVCodeResult.data.sendVCode.data.isSignup) {
                IsLoggedIn(true)
                Token(verifyVCodeResult.data.verifyVCode.data.token)
                router.push('/')
            }
        }


        //
        // if (sendVCodeResult.data && currentStep < 1) {
        //     nextStep()
        // }
        // if (sendVCodeResult.data && sendVCodeResult.data.sendVCode.data.isSignup && currentStep < 2)
        //     nextStep()
        // else if (sendVCodeResult.data && !sendVCodeResult.data.sendVCode.data.isSignup)
        //     setStep(2)
        //
        // if (verifyVCodeResult.data && currentStep < 3) {
        //     if (verifyVCodeResult.data.verifyVCode.status === "SUCCESS") {
        //         IsLoggedIn(true)
        //         Token(verifyVCodeResult.data.verifyVCode.data.token)
        //         router.push('/')
        //     }
        //
        // }
        //
        // if (verifyVCodeResult.data) {
        //
        // }

    }, [sendVCodeResult, verifyVCodeResult])

    return (
        <div dir={'rtl'} className={'w-full'}>
            <Header backOnClick={() => {
                if (currentStep === 0)
                    router.push('/')
                if (currentStep === 1) {
                    sendVCodeResult.reset()
                    setStep(0)
                }
                if (currentStep === 2 && sendVCodeResult.data.sendVCode.data.isSignup) {
                    sendVCodeResult.reset()
                    setStep(1)
                }
                if (currentStep === 2 && !sendVCodeResult.data.sendVCode.data.isSignup) {
                    sendVCodeResult.reset()
                    setStep(0)
                }

            }} alignment={'rtl'} title={'ورود به یونیمون'} back={true}/>
            <div className={'w-full px-5 pt-4'}>
                <span id={'login-title'} className={'IranSansMedium text-lg'}>{steps[currentStep]?.title}</span>
                <br/>
                <div className={'px-2 mt-2'}>
                    <span id={'login-description'}
                          className={'IranSansMedium text-sm text-textSecondary'}>{steps[currentStep]?.description}</span>
                </div>

                {
                    currentStep === 0 ?
                        <div>
                            <Input id={'1'}
                                   wrapperClassName={`mt-5 ${currentStep === 0 ? "opacity-100" : 'opacity-0'} transition-all h-14 duration-400`}
                                   numOnly={true}
                                   onChange={(e: any) => {
                                       if (phoneNumberValidation(e.currentTarget.value)) {
                                           setPhoneNumber(e.currentTarget.value)
                                           setAllowForNextStep(true)
                                       } else {
                                           setAllowForNextStep(false)
                                       }
                                   }}
                                   dir={'ltr'} labelText={'مثل 09123456789'} maxLength={11}/>
                        </div>

                        : currentStep === 1 ?
                            <div>
                                <Input key={'ref'} defaultValue={''} id={'ref-code'}
                                       wrapperClassName={`mt-5 transition-all h-14 duration-400`}
                                       numOnly={false}
                                       dir={'ltr'}
                                       inputClassName={'text-center'} labelText={'خب اگه کد دعوت نداشتیم چیکار کنیم ؟'}

                                       onChange={(e: any) => {
                                           e.currentTarget.value = e.currentTarget.value.toUpperCase()
                                           setReferenceCode(e.currentTarget.value.toString)

                                           if (e.currentTarget.value.length > 0) {
                                               setAllowForNextStep(true)
                                           } else {
                                               setAllowForNextStep(false)
                                           }
                                       }}

                                />
                                <div className={'mt-6 IranSans text-sm px-3 text-textDark'}>
                                    اصلا نگران نباشید پایین صفحه رو نگا کنید
                                    <br/>
                                    همین الان میتونین یه تک پا به پیجمون برید و یه کد دعوت برا خودتون پیدا کنید

                                </div>

                                <div dir={'ltr'} className={'max-w-sm   w-full pb-20 IranSans '}>
                                    <PostSVG/>
                                </div>
                            </div>


                            : currentStep === 2 ?
                                <VCodeInput hint={vCodeHint} stepBack={stepBack} success={codeValidation(vCode)} err={vCodeError}
                                            onChange={(code: string) => {
                                                setVCodeError(false)
                                                if (codeValidation(code)) {
                                                    setVCode(code)

                                                    setAllowForNextStep(true)

                                                } else {
                                                    setAllowForNextStep(false)
                                                }
                                            }} length={4}/>
                                :
                                currentStep === 3 ?
                                    <Input id={'1'}
                                           wrapperClassName={`mt-5 transition-all h-14 duration-400`}
                                           numOnly={false}
                                           dir={'rtl'} labelText={'نام و نام خانوادگی یا هر چیزی که صلاح میدونین'}
                                           onChange={(e: any) => {
                                               if (e.currentTarget.value.length > 0) {
                                                   setAllowForNextStep(true)
                                               } else {
                                                   setAllowForNextStep(false)
                                               }
                                           }}
                                    />
                                    :
                                    null
                }

            </div>
            <div className={'w-full px-3 flex flex-row h-10 items-center fixed bottom-2'}>
                <div
                    className={`${currentStep === 0 ? 'w-2/4 opacity-100 px-3' : ' opacity-0 w-0p h-0p  '} h-14 overflow-hidden  text-center transition-all float-right duration-500 `}>
                    <span className={'IranSansMedium text-tiny'}>با ورود به <span
                        className={'text-primary'}>یـونـیـمـون</span> ، <span
                        className={'text-primary'}>شـرایـط</span> و <span
                        className={'text-primary'}>قوانین حریم ‌خصوصی</span> را می‌ پذیرم</span>
                </div>
                <Button loading={sendVCodeResult.loading || verifyVCodeResult.loading} onClick={() => {
                    if (currentStep === 0) {
                        sendVcode()
                    }
                    if (currentStep === 2 && codeValidation(vCode)) {
                        verifyVCode()
                    }
                }} disabled={!allowForNextStep || vCodeError} rippleColor={'rgba(255,255,255,0.62)'}
                        className={`${currentStep === 0 ? 'w-2/4' : 'w-full'} ${allowForNextStep && !vCodeError ? 'bg-primary' : 'bg-textDark'} transition-all duration-500 h-12 rounded-xl`}>
                    <span className={'text-md text-white IranSansMedium'}>تایید</span>
                </Button>
            </div>
        </div>
    );
};

export default Login;
