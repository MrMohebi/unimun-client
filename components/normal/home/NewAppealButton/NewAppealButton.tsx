import React from 'react';
import AddSvg from "../../../../assets/svgs/add.svg";
import Button from "../../../view/Button/Button";
import {UserToken} from "../../../../store/user";
import {useRouter} from "next/router";

const NewAppealButton = (props: { hidden: boolean }) => {
    const router = useRouter()
    return (
        <div className={`fixed bottom-20 right-5  transition-all duration-300`}
        >
            <div onClick={() => {
                if (UserToken().length) {
                    router.push('/newAppeal')
                } else {
                    router.push('/profile/login')
                }

            }}>
                <Button rippleColor={'rgba(0,0,0,0.26)'}
                        className={` transition-all duration-150 h-14 bg-white rounded-2xl shadow-lg flex flex-row justify-around items-center px-2 IranSansMedium`}>
                    <div className={'w-5 h-5 mx-2'}><AddSvg/></div>
                    <span
                        className={`${props.hidden ? 'w-0' : 'w-24'} overflow-hidden whitespace-nowrap transition-all duration-100 `}>
                    افزودن آگهی
                </span>
                </Button>
            </div>
        </div>

    );
};

export default NewAppealButton;