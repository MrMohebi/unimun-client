import React, {useState} from 'react';
import Header from "../components/common/Header/Header";
import Tab from "../components/view/Tab/Tab";

const Chat = () => {

    const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
    return (
        <div>

            <Header noShadow={true} title={'چت ها'} backOnClick={() => {

            }} back={true} blurBackground={true}/>

            <div className={'px-10 bg-white shadow IranSansMedium text-md'}>
                <div className={'w-full IranSans h-12 pt-4  bg-white z-50 -mt-2 '}>
                    <Tab indicatorSizeDivider={3} activeIndex={currentActiveIndex} indicatorAtBottom={true}>
                        <div onClick={item => setCurrentActiveIndex(0)}
                             className={`ease-in-out ${currentActiveIndex === 0 ? "text-primary" : ""} transition-all `}>فعال
                        </div>
                        <div onClick={item => setCurrentActiveIndex(1)}
                             className={`ease-in-out ${currentActiveIndex === 1 ? "text-primary" : ""} transition-all `}>غیر
                            فعال
                        </div>
                        <div onClick={item => setCurrentActiveIndex(2)}
                             className={`ease-in-out ${currentActiveIndex === 2 ? "text-primary" : ""} transition-all `}>درخواست
                            ها
                        </div>

                    </Tab>
                </div>
            </div>

            <div className={'w-full h-full overflow-y-scroll flex flex-col justify-start items-center'}>
                <div className={'w-full '}></div>
            </div>


        </div>
    );
};

export default Chat;