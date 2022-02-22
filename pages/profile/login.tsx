import React, {useEffect, useState} from 'react';
import Header from "../../components/common/Header/Header";
import Input from "../../components/view/Input/Input";
import Button from "../../components/view/button/Button";

const Login = () => {
    const steps = [
        {
            title: 'شماره تلفن خود را وارد کنید',
            description: 'یک کد برای این شماره ارسال خواهد شد ، هواستون باشه کسی ازش با خبر نشه!'
        }
    ]
    const [currentStep, setStep] = useState(0)

    useEffect(()=>{
        setTimeout(()=>{
            setStep(1)
        },1000)
    },[])


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
                <Input id={'1'} width={'full'} borderColor={'primary'} wrapperClassname={'mt-5  '}
                       numOnly={false}
                       dir={'ltr'} labelText={'مثل 09123456789'} maxLength={11}/>


            </div>
            <div  className={'w-full px-3 flex flex-row items-center absolute bottom-2'}>
                <div className={`${currentStep === 0? 'w-2/4 opacity-100 px-3':' opacity-0 w-0p h-0p  '} h-14 overflow-hidden  text-center transition-all float-right duration-500 `}>
                    <span className={'IranSansMedium text-tiny'}>با ورود به <span
                        className={'text-primary'}>یـونـیـمـون</span> ، <span
                        className={'text-primary'}>شـرایـط</span> و <span
                        className={'text-primary'}>قوانین حریم ‌خصوصی</span> را می‌ پذیرم</span>
                </div>
                <Button rippleColor={'rgba(255,255,255,0.62)'} className={`${currentStep === 0? 'w-2/4':'w-full'} bg-primary transition-all duration-500 h-12 rounded-xl`}>
                    <span className={'text-md text-white IranSansMedium'}>تایید</span>
                </Button>
            </div>
        </div>
    );
};

export default Login;