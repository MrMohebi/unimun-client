import React, {useState} from 'react';
import Header from "../../../common/Header/Header";
import Divider from "../../../view/Divider/Divider";
import Tab from "../../../view/Tab/Tab";
import FileSVG from '../../../../assets/svgs/file.svg'
import DownloadFileSVG from '../../../../assets/svgs/downloadFile.svg'
import Image from "next/image";

interface Props {
    id: string
}

const EachAppeal = (props: Props) => {

    const [currentMediaPart, setCurrentMediaPart] = useState('files')
    return (
        <div className={'w-full h-full'}>
            <Header title={'آگهی'} back={true} backOnClick={() => {
            }}>
            </Header>

            <section className={'w-full bg-white px-5 pt-5'}>
                <h1 className={'IranSansBold text-xl '}>عنوان آگهی</h1>
                <div className={'IranSans text-textDark mt-3'}>دو ساعت پیش</div>
                <div className={'flex flex-wrap items-center justify-start mt-4'}>
                    <div
                        className={'hashtag w-20 h-8 border border-gray-300 rounded-xl  flex flex-col justify-center items-center text-primary IranSansMedium text-sm'}>
                        <span># <span>تسیت</span></span>
                    </div>
                </div>
                <div className={'mt-4'}/>
                <Divider type={'horizontal'} color={'#E1E8ED'}/>
                <div className={'w-full flex flex-row justify-between items-center IranSansMedium mt-5 text-lg pb-5'}>
                    <div className={'text-textDarker'}>بودجه</div>
                    <div>مقدار</div>
                </div>
            </section>
            <div className={'px-5 my-2'}>
                <span
                    className={'IranSansMedium text-textDark text-sm'}>شما باید پیشنهاد خود را در این بازه مطرح کنید</span>
            </div>

            <section className={'w-full bg-white px-5 pt-5 pb-5'}>
                <div className={'w-full flex flex-row justify-between items-center IranSansMedium mt-2 text-lg pb-5'}>
                    <div className={'text-textDarker'}>دانشگاه</div>
                    <div>نام دانشگاه</div>
                </div>

                <div className={'mt-2'}/>
                <Divider type={'horizontal'} color={'#E1E8ED'}/>
                <div className={'text-textDarker IranSansMedium mt-5'}>توضیحات</div>
                <div className={'px-5 mt-2'}>
                    <span className={'IranSansMedium'}>
                    {"لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. { 500 کاراکتر }"}
                </span>
                </div>
            </section>
            <div className={'px-5 h-2 my-2'}>

            </div>
            <section className={'w-full bg-white  pt-4 pb-4 '}>
                <div className={'w-full'}>
                    <div
                        className={'w-full flex flex-row w-52 m-auto  justify-center items-center IranSansMedium  text-lg  relative '}>
                        <Tab activeIndex={currentMediaPart === 'files' ? 0 : 1} indicatorAtBottom={true}>
                            <div onClick={() => {
                                setCurrentMediaPart('files')
                            }}
                                 className={`h-10 ${currentMediaPart === 'files' ? 'text-primary' : 'text-textDarker'} `}>فایل
                                ها
                            </div>
                            <div onClick={() => {
                                setCurrentMediaPart('photos')
                            }}
                                 className={` h-10 ${currentMediaPart === 'photos' ? 'text-primary' : 'text-textDarker'}`}>تصاویر
                            </div>
                        </Tab>
                    </div>
                </div>
                <div className={'w-full border'}/>
                <div className={'px-5'}>
                    {
                        currentMediaPart === 'files'?
                            <div className={'files w-full flex flex-col items-center justify-center mt-3'}>

                                <div className={'file w-full flex flex-row justify-between items-center my-3'}>
                                    <div className={'file-right flex flex-row justify-center items-center'}>
                                        <div dir={'ltr'} className={'h-10 w-10 m-0 overflow-hidden' }><FileSVG/></div>
                                        <div className={'IranSansMedium mr-2'}>نام فایل</div>
                                        <div dir={'ltr'} className={'download-holder w-4 h-4 mr-2'}><DownloadFileSVG/></div>
                                    </div>
                                    <div  dir={'ltr'} className={'IranSans'}>{"12.5 MB"}</div>
                                </div>
                                <Divider type={'horizontal'} color={'rgba(0,0,0,0.14)'}/>


                                <div className={'file w-full flex flex-row justify-between items-center my-3'}>
                                    <div className={'file-right flex flex-row justify-center items-center'}>
                                        <div dir={'ltr'} className={'h-10 w-10 m-0 overflow-hidden' }><FileSVG/></div>
                                        <div className={'IranSansMedium mr-2'}>نام فایل</div>
                                        <div dir={'ltr'} className={'download-holder w-4 h-4 mr-2'}><DownloadFileSVG/></div>
                                    </div>
                                    <div  dir={'ltr'} className={'IranSans'}>{"12.5 MB"}</div>
                                </div>
                                <Divider type={'horizontal'} color={'rgba(0,0,0,0.14)'}/>

                                <div className={'file w-full flex flex-row justify-between items-center my-3'}>
                                    <div className={'file-right flex flex-row justify-center items-center'}>
                                        <div dir={'ltr'} className={'h-10 w-10 m-0 overflow-hidden' }><FileSVG/></div>
                                        <div className={'IranSansMedium mr-2'}>نام فایل</div>
                                        <div dir={'ltr'} className={'download-holder w-4 h-4 mr-2'}><DownloadFileSVG/></div>
                                    </div>
                                    <div  dir={'ltr'} className={'IranSans'}>{"12.5 MB"}</div>
                                </div>
                                <Divider type={'horizontal'} color={'rgba(0,0,0,0.14)'}/>

                                <div className={'file w-full flex flex-row justify-between items-center my-3'}>
                                    <div className={'file-right flex flex-row justify-center items-center'}>
                                        <div dir={'ltr'} className={'h-10 w-10 m-0 overflow-hidden' }><FileSVG/></div>
                                        <div className={'IranSansMedium mr-2'}>نام فایل</div>
                                        <div dir={'ltr'} className={'download-holder w-4 h-4 mr-2'}><DownloadFileSVG/></div>
                                    </div>
                                    <div  dir={'ltr'} className={'IranSans'}>{"12.5 MB"}</div>
                                </div>
                                <Divider type={'horizontal'} color={'rgba(0,0,0,0.14)'}/>
                            </div>
                            :
                            <div className={'photos'}>

                            </div>

                    }


                </div>

            </section>

        </div>
    );
};

export default EachAppeal;