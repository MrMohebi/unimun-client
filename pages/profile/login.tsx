import React, {useEffect, useState} from 'react';
import Header from "../../components/common/Header/Header";
import Input from "../../components/view/Input/Input";
import Button from "../../components/view/button/Button";
import VCodeInput from "../../components/normal/profile/VCodeInput/VCodeInput";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('00000000000')
    const [currentStep, setStep] = useState(0)
    const [allowForNextStep, setAllowForNextStep] = useState(false)
    const [vCodeError, setVCodeError] = useState(false)

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
    let stepBack = ()=>{
        setStep(currentStep-1)
    }

    const steps = [
        {
            title: 'شماره تلفن خود را وارد کنید',
            description: 'یک کد برای این شماره ارسال خواهد شد ، هواستون باشه کسی ازش با خبر نشه!'
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

    useEffect(() => {

    }, [])

    return (
        <div dir={'rtl'} className={'w-full'}>
            <Header alignment={'right'} title={'ورود به یونیمون'} back={true}/>
            <div className={'w-full px-5 pt-4'}>
                <span id={'login-title'} className={'IranSansMedium text-lg'}>{steps[currentStep]?.title}</span>
                <br/>
                <div className={'px-2 mt-2'}>
                    <span id={'login-description'}
                          className={'IranSansMedium text-sm text-textSecondary'}>{steps[currentStep]?.description}</span>
                </div>

                {
                    currentStep === 0 ?
                        <Input id={'1'}
                               wrapperClassname={`mt-5 ${currentStep === 0 ? "opacity-100" : 'opacity-0'} transition-all h-14 duration-400`}
                               numOnly={false}
                               onChange={(e: any) => {
                                   if (phoneNumberValidation(e.currentTarget.value)) {
                                       setAllowForNextStep(true)
                                   }
                               }}
                               dir={'ltr'} labelText={'مثل 09123456789'} maxLength={11}/>
                        : currentStep === 1 ?
                            <VCodeInput stepBack={stepBack} success={allowForNextStep} err={vCodeError} onChange={(code: string) => {
                                setVCodeError(false)
                                if (codeValidation(code)) {
                                    if (code !== '0000') {
                                        setAllowForNextStep(true)
                                        setVCodeError(false)
                                    } else {
                                        setVCodeError(true)
                                    }
                                } else {
                                    setAllowForNextStep(false)
                                }
                            }} length={4}/>
                            :
                            currentStep === 2 ?
                                <Input id={'1'}
                                       wrapperClassname={`mt-5 transition-all h-14 duration-400`}
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
            <div className={'w-full px-3 flex flex-row h-10 items-center absolute bottom-2'}>
                <div
                    className={`${currentStep === 0 ? 'w-2/4 opacity-100 px-3' : ' opacity-0 w-0p h-0p  '} h-14 overflow-hidden  text-center transition-all float-right duration-500 `}>
                    <span className={'IranSansMedium text-tiny'}>با ورود به <span
                        className={'text-primary'}>یـونـیـمـون</span> ، <span
                        className={'text-primary'}>شـرایـط</span> و <span
                        className={'text-primary'}>قوانین حریم ‌خصوصی</span> را می‌ پذیرم</span>
                </div>
                <Button onClick={() => {
                    setAllowForNextStep(false)
                    if (currentStep === steps.length - 1) {
                    } else {
                        setStep(currentStep + 1)
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