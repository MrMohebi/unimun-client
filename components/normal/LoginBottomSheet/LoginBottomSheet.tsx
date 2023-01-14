import React, {useEffect, useRef, useState} from 'react';
import StepperFragment from "../../view/StepperFtagment/StepperFragment";
import Step from "../../view/StepperFtagment/Step/Step";
import BottomSheet from "../../view/BottomSheet/BottomSheet";
import Input from "../../view/Input/Input";
import {phoneNumberValidation} from "../../../helpers/phoneNumberValidation";
import Button from "../../view/Button/Button";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {isReferenceCodeValid, SendVCodeQuery, VerifyVCode} from "../../../Requests/normal/login";
import {updateUser} from "../../../Requests/withAuthentication/user";
import {useRouter} from "next/router";
import {currentNavActiveIndex} from "../../../store/navbar";
import VCodeInput from "../VCodeInput/VCodeInput";
import {UserData, UserToken} from "../../../store/user";
import {setId, setToken} from "../../../helpers/TokenHelper";

const LoginBottomSheet = (props: {
    open: boolean,
    onClose: Function,
    onLoginComplete: Function
}) => {

    const [phoneNumber, setPhoneNumber] = useState('00000000000')
    const [currentStep, setStep] = useState(0)
    const [allowForNextStep, setAllowForNextStep] = useState(false)
    const [vCodeHint, setVCodeHint] = useState(0)
    const [vCodeError, setVCodeError] = useState(false)
    const [vCodeSuccess, setVcodeSuccess] = useState(false)
    const [vCode, setVCode] = useState("")
    const [referenceCode, setReferenceCode] = useState("")
    const [resendCounter, setResendCounter] = useState(45);
    const deadLine = useRef(45);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const clearCodeFunc = useRef<Function>(null)
    const router = useRouter()
    const [shouldSignUp, setShouldSignUp] = useState(false);


    const [sendVcode, sendVCodeResult] = useMutation(gql`${SendVCodeQuery(phoneNumber).query}`, {variables: SendVCodeQuery(phoneNumber).variables})
    const [verifyVCode, verifyVCodeResult] = useMutation(gql`${VerifyVCode(phoneNumber,vCode,referenceCode).query}`, {variables: VerifyVCode(phoneNumber, vCode, referenceCode).variables})
    const [setName, setNameResult] = useMutation(gql`${updateUser({name:''}).query}`, {variables: updateUser({name: ''}).variables})


    let codeValidation = (code: string) => {
        return code.length === 4;
    }

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

    const resendCode = () => {
        if (resendCounter < 1) {
            deadLine.current = Math.floor(Date.now() / 1000)
            setResendCounter(45)
            sendVcode()
        }
    }

    let stepBack = () => {
        sendVCodeResult.reset()
        setStep(0)
    }

    const TitleAndDescriptions = [
        {
            title: 'شماره تلفن خود را وارد کنید',
            description: 'یک کد برای این شماره ارسال خواهد شد ، حواستون باشه کسی ازش با خبر نشه'
        },
        {
            title: 'کد تایید را وارد کنید',
            description: `برای ${phoneNumber} یک کد ارسال شده که خیلی محرمانه هست ! بدون این که کسی ببینه واردش کنید`
        },

    ]


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

    useEffect(() => {


        setInterval(() => {
            setResendCounter((num) => {
                return num - 1
            })
        }, 1000)
    }, [])


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
                setTimeout(() => {
                    UserToken(verifyVCodeResult.data.verifyVCode.data.token)
                    setToken(verifyVCodeResult.data.verifyVCode.data.token)
                    setId(verifyVCodeResult.data.verifyVCode.data.id)

                    props.onLoginComplete()
                }, 300)

            } else {
                verifyVCodeResult.reset()
                setVCodeError(true)

                console.log('here we change it')
            }
        }

        if (verifyVCodeResult.data && verifyVCodeResult.data.status === "ERROR") {
            console.log('errored')
        }
    }, [sendVCodeResult, verifyVCodeResult])

    return (
        <div className={'fixed top-0 left-0 h-full w-full z-50 pointer-events-none'}>

            <BottomSheet open={props.open} onClose={() => {
                props.onClose()
            }}>
                <StepperFragment step={currentStep}>
                    <Step step={0}>
                        <div className={'px-4'}>
                            <div className={'w-full pt-3'}>
                                <span
                                    className={'IranSansMedium text-sm'}>{TitleAndDescriptions[currentStep].title}</span>
                            </div>
                            <div className={'w-full mt-2'}>
                                <span
                                    className={'IranSansMedium leading-[0.2rem] text-[0.7rem] '}>{TitleAndDescriptions[currentStep].description}</span>
                            </div>
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
                        <div className={'w-full h-8 mt-8 bg-background'}>
                                <span className={'IranSansMedium text-tiny px-4'}> با ورود به یـونـیـمـون ، <span
                                    className={'text-primary'}> شـرایـط</span> و <span className={'text-primary'}>قوانین حریم ‌خصوصی</span> را می‌ پذیرید</span>
                        </div>
                    </Step>


                    <Step step={1}>
                        <div className={'px-4'}>
                            <div className={'w-full pt-3 flex flex-row items-center justify-between'}>
                                <span
                                    className={'IranSansMedium text-sm'}>{TitleAndDescriptions[currentStep].title}</span>
                                <span className={'text-primary text-sm IranSansMedium'} onClick={() => {
                                    sendVCodeResult.reset()
                                    setStep(0)
                                }}>ویرایش شماره</span>
                            </div>
                            <div className={'w-full mt-2'}>
                                <span
                                    className={'IranSansMedium leading-[0.2rem] text-[0.7rem] '}>{TitleAndDescriptions[currentStep].description}</span>
                            </div>

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


                        </div>
                    </Step>


                </StepperFragment>

                <div className={'w-full flex flex-col justify-center items-center mt-5 pb-2'}>
                    <Button id={'verify-phone-button'}
                            loading={sendVCodeResult.loading || verifyVCodeResult.loading}
                            onClick={() => {
                                submitButtonClick()

                            }} disabled={!allowForNextStep} rippleColor={'rgba(255,255,255,0.62)'}
                            className={` ${vCodeError && currentStep === 1 ? 'bg-errorRed' : ''} ${'w-11/12 mx-auto'} ${currentStep === 3 && allowForNextStep ? ' bg-primary ' : ''} ${allowForNextStep ? 'bg-primary' : 'bg-textDark'} ${allowForNextStep && !vCodeError ? 'bg-primary' : !vCodeError ? 'bg-textDark' : ''}  transition-all text-md duration-500 h-14 rounded-xl `}>
                    <span className={'text-md text-white IranSansMedium'}>

                        {
                            vCodeError && currentStep === 1 ? "تلاش مجدد"
                                :
                                "ورود به یونیمون"
                        }

                    </span>
                    </Button>
                </div>

            </BottomSheet>


        </div>
    );
};

export default LoginBottomSheet;