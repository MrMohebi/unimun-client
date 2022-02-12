import React from 'react';
import Header from "../../components/common/Header/Header";

const Login = () => {
    return (
        <div dir={'rtl'} className={'w-full'}>
            <Header alignment={'right'} title={'ورود به یونیمون'} back={true}/>
            <div className={'w-full px-5 pt-4'}>
                <span id={'login-title'} className={'IranSansMedium text-lg'}>شماره تلفن خود را وارد کنید</span>
                <br/>
                <div className={'px-2 mt-2'}>
                    <span id={'login-description'} className={'IranSansMedium text-sm text-textSecondary'}>یک کد برای این شماره ارسال خواهد شد ، هواستون باشه کسی ازش با خبر نشه!</span>
                </div>

            </div>

        </div>
    );
};

export default Login;