import React, {useEffect, useRef, useState} from 'react';
import Header from "../../components/common/Header/Header";
import Input from "../../components/view/Input/Input";
import Button from "../../components/view/Button/Button";
import VCodeInput from "../../components/normal/profile/VCodeInput/VCodeInput";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {useRouter} from "next/router";
import {UserToken} from "../../store/user";
import {isReferenceCodeValid, SendVCodeQuery, VerifyVCode} from "../../queries/normal/login";
import {setToken} from "../../helpers/TokenHelper";
import internal from "stream";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('00000000000')
    const [currentStep, setStep] = useState(0)
    const [allowForNextStep, setAllowForNextStep] = useState(false)
    const [vCodeHint, setVCodeHint] = useState(0)
    const [vCodeError, setVCodeError] = useState(false)
    const [vCodeSuccess, setVcodeSuccess] = useState(false)
    const [vCode, setVCode] = useState("")
    const [referenceCode, setReferenceCode] = useState("")
    const [refCodeStatus, setRefCodeStatus] = useState("")
    const [allowToSendVCode, setAllowToSendVCode] = useState(false);
    const deadLine = useRef(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const resendCodeTimer = useRef(null);

    const router = useRouter()


    const [sendVcode, sendVCodeResult] = useMutation(gql`${SendVCodeQuery(phoneNumber).query}`, {variables: SendVCodeQuery(phoneNumber).variables})
    const [verifyVCode, verifyVCodeResult] = useMutation(gql`${VerifyVCode(phoneNumber,vCode,referenceCode).query}`, {variables: VerifyVCode(phoneNumber, vCode, referenceCode).variables})
    const [verifyReferral, verifyReferralResult] = useLazyQuery(gql`${isReferenceCodeValid().query}`, {variables: isReferenceCodeValid().variables})
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
    const resendCode = () => {
        let now = new Date().getTime()
        //
        // if (!deadLine) {
        //     deadLine = now + (60 * 2)
        // } else {
        //     console.log(deadLine - now)
        // }
        // setAllowToSendVCode(true)
        // let now = new Date()
        // let remains = now.setDate(now.getMinutes()+2)
        // console.log(remains)

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
        // deadLine.current = (Math.floor(Date.now() / 1000))
        setInterval(() => {
            if (deadLine.current !== 0)
                setElapsedTime(Math.floor(Date.now() / 1000) - deadLine.current)
        }, 1000)
    }, [])

    //handel query data
    useEffect(() => {
        if (sendVCodeResult.data) {
            if (sendVCodeResult.data.sendVCode.data.vCode) {
                setVCodeHint(parseInt(sendVCodeResult.data.sendVCode.data.vCode[0]))
            }
            if (sendVCodeResult.data.sendVCode.data.isSignup && !referenceCode) {
                setStep(1)
                setAllowForNextStep(false)
            }
            if (!sendVCodeResult.data.sendVCode.data.isSignup) {
                setStep(2)
                if (deadLine.current === 0)
                    deadLine.current = Math.floor(Date.now() / 1000)

            }
        }
        if (verifyVCodeResult.data) {
            console.log(verifyVCodeResult)
            if (verifyVCodeResult.data.verifyVCode.status === "SUCCESS" && sendVCodeResult.data.sendVCode.data.isSignup) {
                setStep(3)
            }
            if (verifyVCodeResult.data.verifyVCode.status === "SUCCESS" && !sendVCodeResult.data.sendVCode.data.isSignup) {
                setVcodeSuccess(true)
                setTimeout(() => {
                    UserToken(verifyVCodeResult.data.verifyVCode.data.token)
                    setToken(verifyVCodeResult.data.verifyVCode.data.token)
                    router.push('/')
                }, 1000)

            } else {
                setVCodeError(true)
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

                setVCodeError(false)
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
                <span id={'login-title'} className={'IranSansMedium text-l'}>{steps[currentStep]?.title}</span>
                <br/>
                <div className={'px-2 mt-2'}>
                    <span id={'login-description'}
                          className={'IranSans text-textBlack text-sm text-textSecondary'}>{steps[currentStep]?.description}</span>
                </div>

                {
                    currentStep === 0 ?
                        <div>
                            <Input id={'1'}
                                   wrapperClassName={`mt-5 ${currentStep === 0 ? "opacity-100" : 'opacity-0'} transition-all h-14 duration-400 text`}
                                   inputClassName={'text-center text-lg'}
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
                                <Input maxLength={6} key={'ref'} defaultValue={''} id={'ref-code'}
                                       wrapperClassName={`mt-5 transition-all h-14 duration-400`}
                                       numOnly={false}
                                       dir={'ltr'}
                                       inputClassName={`text-center ${refCodeStatus === 'SUCCESS' ? 'text-primary' : refCodeStatus === 'ERROR' ? 'text-errorRed' : ''}`}
                                       onChange={(e: any) => {

                                           setRefCodeStatus('')
                                           e.currentTarget.value = e.currentTarget.value.toUpperCase()
                                           setReferenceCode(e.currentTarget.value)
                                           if (e.currentTarget.value.length === 6) {

                                               verifyReferral({variables: {referenceCode: referenceCode}}).then(e => {
                                                   console.log(e.data.isReferenceCodeValid.status)
                                                   if (e.data.isReferenceCodeValid.status === 'SUCCESS') {
                                                       setRefCodeStatus('SUCCESS')
                                                       setAllowForNextStep(true)

                                                   } else {
                                                       setRefCodeStatus('ERROR')
                                                   }
                                               })

                                               // setAllowForNextStep(true)
                                           }

                                       }}

                                />
                                <div className={'mt-6 IranSans text-sm px-3 text-textDark'}>
                                    خب اگه کد دعوت نداشتیم چیکار کنیم ؟
                                    <br/>
                                    <br/>

                                    اصلا نگران نباشید پایین صفحه رو نگا کنید :)
                                    <br/>

                                </div>


                                <img src="/assets/image/postbox.png" alt="Unimun referral"
                                     className={'w-full absolute bottom-14 left-1/2 -translate-x-1/2 '}/>

                                {/*<div dir={'ltr'} className={'max-w-sm   w-full pb-20 IranSans '}>*/}
                                {/*    <PostSVG/>*/}
                                {/*</div>*/}
                            </div>


                            : currentStep === 2 ?
                                <div>
                                    <VCodeInput hint={vCodeHint} stepBack={stepBack} success={vCodeSuccess}
                                                err={vCodeError}
                                                onChange={(code: string) => {
                                                    console.log(code)
                                                    setVCodeError(false)
                                                    if (codeValidation(code)) {
                                                        setVCode(code)
                                                        setAllowForNextStep(true)
                                                    } else {
                                                        setAllowForNextStep(false)
                                                    }
                                                }} length={4}/>
                                    <div
                                        className={'h-20 w-full mt-4 flex flex-row justify-between items-center IranSans text-primary text-md'}>
                <span onClick={() => {
                }}>ویرایش شماره</span>
                                        <span onClick={resendCode}
                                              className={`${allowToSendVCode ? 'text-primary' : 'text-gray-500'}`}>{` ارسال دوباره کد (${120 - elapsedTime + ' ثانیه'})`}</span>
                                    </div>
                                    <div className={'IranSansMedium text-textDark text-sm'}>
                                        چرا یکی از عدد ها پیداست ؟
                                        <br/>
                                        <br/>
                                        <div className={'text-justify w-full'}>
                                            رقم اول کد هایی که براتون ارسال میکنیم همیشه در کادر مشخص هستن تا بتونین از
                                            درست
                                            بودن پیامک ارسالی
                                            مطمعن بشید

                                        </div>

                                    </div>


                                </div>

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
            <div className={'w-full px-3 flex flex-row h-10 items-center fixed bottom-4'}>
                <div
                    className={`${currentStep === 0 ? 'w-2/3 opacity-100 px-1' : ' opacity-0 w-0p h-0p'} h-14 overflow-hidden flex flex-row items-center justify-center  text-center transition-all float-right duration-500 `}
                    style={{fontSize: "5vmin"}}>
                    <span className={'IranSansMedium text-tiny'}>با ورود به <span
                        className={'text-black'}>یـونـیـمـون</span> ، <span
                        className={'text-primary'}>شـرایـط</span>  و <br/><span
                        className={'text-primary'}>قوانین حریم ‌خصوصی</span> را می‌ پذیرم</span>
                </div>
                <Button loading={sendVCodeResult.loading || verifyVCodeResult.loading || verifyReferralResult.loading}
                        onClick={() => {
                            if (!vCodeError) {
                                if (currentStep === 0) {
                                    sendVcode().then(e => {
                                        if (e.data.sendVCode.status === 'SUCCESS') {
                                            console.log('hi')
                                        }
                                    })
                                }
                                if (currentStep === 1) {
                                    nextStep()
                                }

                                if (currentStep === 2 && codeValidation(vCode)) {
                                    verifyVCode()
                                }
                            } else {
                                setVCodeError(false)
                            }

                        }} disabled={!allowForNextStep} rippleColor={'rgba(255,255,255,0.62)'}
                        className={`${currentStep === 0 ? 'w-2/4' : 'w-full'}  ${allowForNextStep && !vCodeError ? 'bg-primary' : !vCodeError ? 'bg-textDark' : ''} ${vCodeError && currentStep === 2 ? 'bg-errorRed' : ''} transition-all text-md duration-500 h-14 rounded-xl `}>
                    <span className={'text-md text-white IranSansMedium'}>

                        {
                            vCodeError && currentStep === 2 ? "تلاش مجدد"
                                :
                                "تایید"
                        }

                    </span>
                </Button>
            </div>
        </div>
    );
};

export default Login;
