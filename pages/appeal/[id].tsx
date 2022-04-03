import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {gql, useLazyQuery} from "@apollo/client";
import {getAppealQuery} from "../../queries/normal/appeals";
import Header from "../../components/common/Header/Header";
import Skeleton from "react-loading-skeleton";
import Divider from "../../components/view/Divider/Divider";
import Tab from "../../components/view/Tab/Tab";
import FileSVG from "../../assets/svgs/file.svg";
import DownloadFileSVG from "../../assets/svgs/downloadFile.svg";
import ThousandTomans from '../../assets/svgs/thousandTomans.svg'

import 'moment/locale/fa'
import SVGModifier from "../../components/common/SVGModifier/SVGModifier";
import GalleryImageSVG from "../../assets/svgs/galleryImage.svg";

const moment = require('moment')

interface Appeal {
    title: string
    priceStart: number
    priceEnd: number
    details: string
    createdAt: number
    attachments: []
    hashtags: []
}

interface AttachmentFiles{
    uploadedAsFile:boolean
    url:string
    preview:string
}

const Item = () => {
    const router = useRouter();
    const {id} = router.query;

    moment.locale('en')

    const [currentMediaPart, setCurrentMediaPart] = useState('files')
    const [appeal, setAppeal] = useState({} as Appeal)

    const [getAppeal, {data, loading, error}] = useLazyQuery(gql`${getAppealQuery().query}`)
    useEffect(() => {
        getAppeal({variables: {id: id}}).then(e => {
            if (e.data) {
                let appeal = e.data.appeal
                let a = moment.now()

                console.log(moment(a).format('YYYY/MM/DD').split('/'))
                console.log(moment(moment(a).format('YYYY/MM/DD').split('/')).format('YYYY/MM/DD'))

                let date = moment.unix(appeal.createdAt).add('d', -1).format('YYYY/MM/DD').split('/')
                let dateNumeric = date.map((item: string) => {
                    return parseInt(item);
                })
                moment.locale('fa')
                console.log(appeal)
                setAppeal({
                    ...appeal,
                    title: appeal.title,
                    priceStart: appeal.priceStart,
                    priceEnd: appeal.priceEnd,
                    details: appeal.details,
                    createdAt: moment(dateNumeric).from(),
                    hashtags: appeal.hashtags.length ? (JSON.parse(appeal.hashtags[0])) : [],
                    attachments: appeal.attachments
                })
                // if (e.data)
                //     setAppeal(JSON.stringify(e.data.appeal))

            }

        })

    }, [data])


    return (
        <div className={'w-full h-full'}>

            <Header title={'آگهی'} back={true} backOnClick={() => {
                router.back()
            }}>
            </Header>

            <section className={'w-full bg-white px-5 pt-5'}>

                <h1 className={'IranSansBold text-xl '}>{appeal.title ??
                    <Skeleton width={200} height={30}/>}</h1>
                <div className={'IranSans text-textDark mt-3'}>{appeal.createdAt ? appeal.createdAt :
                    <Skeleton width={200} height={30}/>}</div>
                <div className={'flex flex-wrap items-center justify-start mt-4'}>

                    {
                        appeal.hashtags ?
                            appeal.hashtags.map(item => <div key={item}
                                className={' mx-2 hashtag px-3 h-8 border border-gray-300 rounded-xl  flex flex-col justify-center items-center text-primary IranSansMedium text-sm'}>
                                <span># <span>{item}</span></span>
                            </div>)
                            :
                            <Skeleton/>
                    }

                </div>
                <div className={'mt-4'}/>
                <Divider type={'horizontal'} color={'#E1E8ED'}/>
                <div className={'w-full flex flex-row justify-between items-center IranSansMedium mt-5 text-lg pb-5'}>
                    <div className={'text-textDarker'}>بودجه</div>
                    {
                        appeal.priceStart ?
                            <div
                                className={'IranSansMedium text-textBlack whitespace-nowrap text-xl pt-2  flex flex-row items-end'}>
                                <span className={'mx-0.5  flex flex-row items-end'}>از</span>
                                <span className={'mx-0.5  flex flex-row items-end'}>{appeal.priceStart / 1000}</span>
                                <span className={'mx-0.5  flex flex-row items-end'}>تا</span>
                                <span className={'mx-0.5  flex flex-row items-end'}>{appeal.priceEnd / 1000}</span>
                                <div dir={'ltr'} className={'w-12 h-12 flex flex-row mb-1 items-end'}>
                                    <ThousandTomans/>
                                </div>
                            </div>
                            : <Skeleton/>
                    }

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
                        {
                            appeal.details ?? <Skeleton count={3}/>

                        }
                </span>
                </div>
            </section>
            <div className={'px-5 h-2 my-2'}>

            </div>

            {
                appeal.attachments ?
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
                                currentMediaPart === 'files' ?
                                    <div className={'files w-full flex flex-col items-center justify-center mt-3'}>

                                        {appeal.attachments.map((file: AttachmentFiles) => {
                                            if (file.uploadedAsFile) {
                                                return (
                                                    <div key={file.url} className={'contents'}>
                                                        <div
                                                            className={'file w-full flex flex-row justify-between items-center my-3'}>
                                                            <div
                                                                className={'file-right flex flex-row justify-center items-center'}>
                                                                <div dir={'ltr'}
                                                                     className={'h-10 w-10 m-0 overflow-hidden'}>
                                                                    <FileSVG/></div>
                                                                <div
                                                                    className={'IranSansMedium mr-2'}>{file['url'].split('/').reverse()[0]}</div>
                                                                <div dir={'ltr'}
                                                                     className={'download-holder w-4 h-4 mr-2'}>
                                                                    <DownloadFileSVG/>
                                                                </div>
                                                            </div>
                                                            {/*<div dir={'ltr'} className={'IranSans'}>{"12.5 MB"}</div>*/}
                                                        </div>
                                                        <Divider type={'horizontal'} color={'rgba(0,0,0,0.14)'}/>

                                                    </div>
                                                )
                                            }
                                        })}


                                    </div>
                                    :
                                    <div className={'photos grid grid-cols-4 justify-items-center'}>
                                        {
                                            appeal.attachments.map((file:AttachmentFiles, index) => {
                                                if (!file.uploadedAsFile)
                                                    return (<div key={`${index}photo`}
                                                                 className={'new-photo h-24 w-24 flex flex-col justify-center items-center rounded-2xl border-2 mx-3 relative overflow-hidden mt-4'}>
                                                            <img src={`https://dl.unimun.me/${file.preview}`}
                                                                 alt={'Unimun ' + index}
                                                                 className={' w-full h-full'}/>
                                                            <div dir={'ltr'}
                                                                 className={'w-9 h-9  rounded-xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col justify-center items-center'}
                                                                 style={{background: 'rgba(255,255,255,0.85)'}}>
                                                                <SVGModifier SVGName={'galleryImage'}
                                                                             elementClass={'number'}
                                                                             value={(index + 1).toString()}>
                                                                    <GalleryImageSVG/>
                                                                </SVGModifier>
                                                            </div>
                                                        </div>
                                                    )
                                            })
                                        }
                                    </div>

                            }


                        </div>

                    </section>
                    : null
            }


        </div>
    );
};

export default Item;