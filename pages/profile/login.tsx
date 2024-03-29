import React, {useEffect, useRef, useState} from 'react';
import Header from "../../components/common/Header/Header";
import Input from "../../components/view/Input/Input";
import Button from "../../components/view/Button/Button";
import VCodeInput from "../../components/normal/VCodeInput/VCodeInput";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {useRouter} from "next/router";
import {UserData, UserToken} from "../../store/user";
import {isReferenceCodeValid, SendVCodeQuery, VerifyVCode} from "../../Requests/normal/login";
import {setId, setToken} from "../../helpers/TokenHelper";
import Promoter from "../../assets/svgs/postbox.svg";
import {updateUser} from "../../Requests/withAuthentication/user";
import {currentNavActiveIndex} from "../../store/navbar";
import {phoneNumberValidation} from "../../helpers/phoneNumberValidation";

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
    const [showPromoter, setShowPromoter] = useState(true);
    const [resendCounter, setResendCounter] = useState(45);
    const deadLine = useRef(45);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const refCodeInputRef = useRef<HTMLInputElement>(null)
    const clearCodeFunc = useRef<Function>(null)
    const router = useRouter()
    const [shouldSignUp, setShouldSignUp] = useState(false);


    const [sendVcode, sendVCodeResult] = useMutation(gql`${SendVCodeQuery(phoneNumber).query}`, {variables: SendVCodeQuery(phoneNumber).variables})
    const [verifyVCode, verifyVCodeResult] = useMutation(gql`${VerifyVCode(phoneNumber,vCode,referenceCode).query}`, {variables: VerifyVCode(phoneNumber, vCode, referenceCode).variables})
    const [verifyReferral, verifyReferralResult] = useLazyQuery(gql`${isReferenceCodeValid().query}`, {variables: isReferenceCodeValid().variables})
    const [setName, setNameResult] = useMutation(gql`${updateUser({name:''}).query}`, {variables: updateUser({name: ''}).variables})



    let codeValidation = (code: string) => {
        return code.length === 4;
    }
    let stepBack = () => {
        sendVCodeResult.reset()
        setStep(0)
    }
    const resendCode = () => {
        if (resendCounter < 1) {
            deadLine.current = Math.floor(Date.now() / 1000)
            setResendCounter(45)
            sendVcode()
        }
    }


    const steps = [
        {
            title: 'شماره تلفن خود را وارد کنید',
            description: 'یک کد برای این شماره ارسال خواهد شد!'
        },
        // {
        //     title: 'کـد دعـوت دارید ؟',
        //     description: `واسه وارد شدن به یونیمون ، لازمه که از طرف یکی دعوت شده باشید و کد دعوتش رو در کادر زیر وارد کنید!`
        // },
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
        if (sendVCodeResult.data && sendVCodeResult.data.sendVCode.status === 'SUCCESS') {
            setResendCounter(45)
            setAllowForNextStep(false)

            setInterval(() => {
                if (deadLine.current !== 0)
                    setElapsedTime(Math.floor(Date.now() / 1000) - deadLine.current)
            }, 1000)
        }


    }, [sendVCodeResult.data])


    const submitButtonClick = () => {

        if (vCodeError) {
            verifyVCodeResult.reset()
            setVCodeError(false)
            if (clearCodeFunc.current)
                clearCodeFunc.current()
            setAllowForNextStep(false)
            return 0
        }

        if (currentStep === 0) {
            sendVcode().then(e => {
                if (e.data.sendVCode.data.isSignup) {
                    setShouldSignUp(true)
                }

                if (e.data.sendVCode.status === 'SUCCESS') {
                    setStep(1)
                    setReferenceCode('MRM755')
                }
            })
        }

        if (currentStep === 1 && codeValidation(vCode)) {
            verifyVCode()
        }


        if (vCodeError) {
            setVCodeError(false)
            verifyVCodeResult.reset()
            if (clearCodeFunc.current)
                clearCodeFunc.current()
        }

        if (currentStep === 2) {
            if (nameInputRef.current)
                setName({variables: {name: nameInputRef.current.value}}).then(e => {
                    if (e.data) {
                        if (e.data.updateUser.status === 'SUCCESS') {
                            router.push('/').then(() => {
                                currentNavActiveIndex(0)
                            })
                        }
                    }
                })
        }
    }


    useEffect(() => {


        setInterval(() => {
            setResendCounter((num) => {
                return num - 1
            })
        }, 1000)
    }, [])
    //handel query data
    useEffect(() => {
        if (sendVCodeResult.data) {
            if (sendVCodeResult.data.sendVCode.data.vCode) {
                setVCodeHint(parseInt(sendVCodeResult.data.sendVCode.data.vCode[0]))
                if (sendVCodeResult.data.sendVCode.data.isSignup) {
                    setShouldSignUp(true)
                }
            }

            if (!sendVCodeResult.data) {
                if (deadLine.current === 0)
                    deadLine.current = Math.floor(Date.now() / 1000)

            }
        }
        if (verifyVCodeResult.data) {

            try {
                console.log(verifyVCodeResult.data.verifyVCode.data.id)
                let userData = UserData()
                // userData.id = verifyVCodeResult.data.verifyVCode.data.id
                UserData(verifyVCodeResult.data.verifyVCode.data)
                console.log(UserData())

            } catch (e) {

            }

            if (verifyVCodeResult.data.verifyVCode.status === "SUCCESS") {
                setVcodeSuccess(true)
                if (shouldSignUp) {
                    UserToken(verifyVCodeResult.data.verifyVCode.data.token)
                    setToken(verifyVCodeResult.data.verifyVCode.data.token)
                    setId(verifyVCodeResult.data.verifyVCode.data.id)
                    setStep(2)
                } else
                    setTimeout(() => {
                        UserToken(verifyVCodeResult.data.verifyVCode.data.token)
                        setToken(verifyVCodeResult.data.verifyVCode.data.token)
                        setId(verifyVCodeResult.data.verifyVCode.data.id)
                        router.push('/').then(() => {
                            currentNavActiveIndex(0)
                        })
                    }, 300)

            } else {
                verifyVCodeResult.reset()
                setVCodeError(true)
            }
        }

        if (verifyVCodeResult.data && verifyVCodeResult.data.status === "ERROR") {
            console.log('errored')
        }
    }, [sendVCodeResult, verifyVCodeResult])

    return (
        <div dir={'rtl'} className={'w-full h-full'}>
            <Header backOnClick={() => {
                setVCodeError(false)

                if (currentStep === 0)
                    router.push('/').then(() => {
                        currentNavActiveIndex(0)
                    })

                if (currentStep === 1) {
                    sendVCodeResult.reset()
                    verifyVCodeResult.reset()
                    setStep(0)
                }


            }} alignment={'rtl'} title={'ورود به یونیمون'} back={true}/>
            <div className={'w-full px-5 pt-4 h-full'}>
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


                        //todo this step is skipped by number five
                        : currentStep === 5 ?
                            <div className={'h-full'}>
                                {/*<Input inputRef={refCodeInputRef} onFocus={() => {*/}
                                {/*    setShowPromoter(false)*/}
                                {/*}} onBlur={() => {*/}
                                {/*    setShowPromoter(true)*/}
                                {/*}} maxLength={6} key={'ref'} defaultValue={''} id={'ref-code'}*/}
                                {/*       wrapperClassName={`mt-5 transition-all h-14 duration-400`}*/}
                                {/*       numOnly={false}*/}
                                {/*       dir={'ltr'}*/}
                                {/*       inputClassName={`text-center english text-md ${refCodeStatus === 'SUCCESS' ? 'text-primary' : refCodeStatus === 'ERROR' ? 'text-errorRed' : ''}`}*/}
                                {/*       onChange={(e: any) => {*/}

                                {/*           setRefCodeStatus('')*/}
                                {/*           e.currentTarget.value = e.currentTarget.value.toUpperCase()*/}
                                {/*           setReferenceCode(e.currentTarget.value)*/}
                                {/*           if (e.currentTarget.value.length === 6) {*/}
                                {/*               verifyReferral({variables: {referenceCode: e.target.value.toString()}}).then(e => {*/}
                                {/*                   if (e.data.isReferenceCodeValid.status === 'SUCCESS') {*/}
                                {/*                       setRefCodeStatus('SUCCESS')*/}
                                {/*                       setAllowForNextStep(true)*/}
                                {/*                   } else {*/}
                                {/*                       setRefCodeStatus('ERROR')*/}
                                {/*                   }*/}
                                {/*               })*/}

                                {/*               // setAllowForNextStep(true)*/}
                                {/*           }*/}

                                {/*       }}*/}

                                {/*/>*/}
                                {/*<div className={'mt-3 mr-1'}>*/}
                                {/*        <span className={'IranSansMedium text-primary  text-sm mt-3'} onClick={() => {*/}
                                {/*            if (refCodeInputRef.current) {*/}
                                {/*                if (refCodeInputRef.current.value.toString().length > 3) {*/}
                                {/*                    verifyReferral({variables: {referenceCode: refCodeInputRef.current.value.toString()}}).then((e: any) => {*/}
                                {/*                        verifyReferral({variables: {referenceCode: e.target.value.toString()}}).then(e => {*/}
                                {/*                            if (e.data.isReferenceCodeValid.status === 'SUCCESS') {*/}
                                {/*                                setRefCodeStatus('SUCCESS')*/}
                                {/*                                setAllowForNextStep(true)*/}
                                {/*                            } else {*/}
                                {/*                                setRefCodeStatus('ERROR')*/}
                                {/*                            }*/}
                                {/*                        })*/}
                                {/*                    })*/}
                                {/*                }*/}
                                {/*            }*/}
                                {/*        }}>بررسی کد</span>*/}
                                {/*</div>*/}


                                {/*<div className={'mt-6 IranSans text-sm px-3 text-textDark'}>*/}
                                {/*    خب اگه کد دعوت نداشتیم چیکار کنیم ؟*/}
                                {/*    <br/>*/}
                                {/*    <br/>*/}

                                {/*    اصلا نگران نباشید پایین صفحه رو نگا کنید :)*/}
                                {/*    <br/>*/}

                                {/*</div>*/}
                                {/*<div onClick={() => {*/}
                                {/*    window.open('https://www.instagram.com/unimun.me/', '_blank')*/}
                                {/*}} className={'w-full mt-10 mx-auto flex flex-col justify-center items-center '}*/}
                                {/*     style={{maxWidth: '420px'}}>*/}
                                {/*    <Promoter/>*/}
                                {/*</div>*/}


                            </div>


                            : currentStep === 1 ?
                                <div>
                                    <VCodeInput clearCodeFunction={clearCodeFunc} hint={vCodeHint} stepBack={stepBack}
                                                success={vCodeSuccess}
                                                err={vCodeError}
                                                onChange={(code: string) => {
                                                    if (code.length === 4) {
                                                        verifyVCode({
                                                            variables: {
                                                                vCode: code
                                                            }
                                                        })

                                                    }

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
                    sendVCodeResult.reset()
                    setStep(0)
                }}>ویرایش شماره</span>
                                        <span onClick={resendCode}
                                              className={`${resendCounter < 1 ? 'text-primary' : 'text-gray-500'}`}>{(resendCounter) > 0 ? ` ارسال دوباره کد (${(resendCounter) > 0 ? (resendCounter) + ' ثانیه' : ""} )` : 'ارسال دوباره کد'}</span>
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
                                currentStep === 2 ?
                                    <Input inputRef={nameInputRef} id={'1'}
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
                >
                    <span className={'IranSansMedium text-[0.7rem]'}>با ورود به <span
                        className={'text-black'}>یـونـیـمـون</span> ، <span
                        className={'text-primary'}>شـرایـط</span>  و <br/><span
                        className={'text-primary'}>قوانین حریم ‌خصوصی</span> را می‌ پذیرم</span>
                </div>
                <Button id={'verify-phone-button'}
                        loading={sendVCodeResult.loading || verifyVCodeResult.loading || verifyReferralResult.loading || setNameResult.loading}
                        onClick={() => {
                            submitButtonClick()

                        }} disabled={!allowForNextStep} rippleColor={'rgba(255,255,255,0.62)'}
                        className={` ${vCodeError && currentStep === 1 ? 'bg-errorRed' : ''} ${currentStep === 0 ? 'w-2/4' : 'w-full'} ${currentStep === 3 && allowForNextStep ? ' bg-primary ' : ''} ${allowForNextStep ? 'bg-primary' : 'bg-textDark'} ${allowForNextStep && !vCodeError ? 'bg-primary' : !vCodeError ? 'bg-textDark' : ''}  transition-all text-md duration-500 h-14 rounded-xl `}>
                    <span className={'text-md text-white IranSansMedium'}>

                        {
                            vCodeError && currentStep === 1 ? "تلاش مجدد"
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
