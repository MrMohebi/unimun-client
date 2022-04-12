import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {gql, useLazyQuery} from "@apollo/client";
import {getAppealQuery} from "../../Requests/normal/appeals";
import Header from "../../components/common/Header/Header";
import Skeleton from "react-loading-skeleton";

import Divider from "../../components/view/Divider/Divider";
import Tab from "../../components/view/Tab/Tab";
import FileSVG from "../../assets/svgs/file.svg";
import DownloadFileSVG from "../../assets/svgs/downloadFile.svg";
import ThousandTomans from '../../assets/svgs/thousandTomans.svg'

import {passedTime} from "../../helpers/passedTime";
import 'moment/locale/fa'
import SVGModifier from "../../components/common/SVGModifier/SVGModifier";
import GalleryImageSVG from "../../assets/svgs/galleryImage.svg";
import SkeletonElement from "../../components/view/Skeleton/Skeleton";
import Head from "next/head";
import {DOWNLOAD_HOST} from "../../LocalVariables/LocalVariables";

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

interface AttachmentFiles {
    uploadedAsFile: boolean
    url: string
    preview: string
}

const Item = () => {
    const router = useRouter();
    // const {id} = router.query;


    const [currentMediaPart, setCurrentMediaPart] = useState('files')
    const [appeal, setAppeal] = useState({} as Appeal)

    const [getAppeal, {data, loading, error}] = useLazyQuery(gql`${getAppealQuery().query}`)
    useEffect(() => {


        let id = window.location.pathname.split('/').reverse()[0]
        getAppeal({variables: {id: id}}).then(e => {
            if (e.data) {
                let appeal = e.data.appeal

                setAppeal({
                    ...appeal,
                    title: appeal.title,
                    priceStart: appeal.priceStart,
                    priceEnd: appeal.priceEnd,
                    details: appeal.details,
                    createdAt: passedTime(appeal.createdAt),
                    hashtags: appeal.hashtags.length ? (JSON.parse(appeal.hashtags[0])) : [],
                    attachments: appeal.attachments
                })
            }

        })

        console.log(appeal)


    }, [data])


    return (
        <div className={'w-full h-full'}>

            <Head>
                <title>Unimun Appeal</title>
                <meta name="description" content="Unimun"/>
            </Head>

            <Header title={'آگهی'} back={true} backOnClick={() => {
                router.back()
            }}>
            </Header>

            <section className={'w-full bg-white px-5 pt-5'}>

                <h1 className={'IranSansBold text-xl '}>{appeal.title ??
                    <SkeletonElement className={'w-40 h-8'}/>}</h1>
                <div className={'IranSans text-textDark mt-2'}>{appeal.createdAt ? appeal.createdAt :
                    <SkeletonElement className={'w-40 h-5'}/>}</div>
                <div className={'flex flex-wrap items-center justify-start mt-2 mb-4'}>

                    {
                        appeal.hashtags ?
                            appeal.hashtags.map(item => <div key={item}
                                                             className={' mx-2 mt-2 hashtag px-3 h-8 border border-gray-300 rounded-xl  flex flex-col justify-center items-center text-primary IranSansMedium text-sm'}>
                                <span># <span>{item}</span></span>
                            </div>)
                            :
                            <div className={'flex w-full flex-row justify-start items-center  '}>
                                <SkeletonElement className={'w-20 h-5 rounded-md'}/>
                                <SkeletonElement className={'w-20 mr-3 h-5 rounded-md'}/>
                            </div>
                    }

                </div>
                <div className={'mt-1'}/>
                <Divider type={'horizontal'} color={'#E1E8ED'}/>
                <div
                    className={'w-full flex flex-row mt-3 justify-between items-baseline  IranSansMedium  text-lg pb-5'}>
                    {
                        appeal.priceStart ?
                            <div className={'text-textDarker'}>بودجه</div>
                            :
                            <SkeletonElement className={'w-20 mt-2 h-5'}/>
                    }
                    {
                        appeal.priceStart ?
                            <div
                                className={'IranSansMedium text-textBlack whitespace-nowrap text-md pt-2  flex flex-row items-end'}>
                                <span className={'mx-0.5  flex flex-row items-end'}>از</span>
                                <span className={'mx-0.5  flex flex-row items-end'}>{appeal.priceStart / 1000}</span>
                                <span className={'mx-0.5  flex flex-row items-end'}>تا</span>
                                <span className={'mx-0.5  flex flex-row items-end'}>{appeal.priceEnd / 1000}</span>
                                <div className={'w-12 mb-1 mr-0.5 '}>
                                    <ThousandTomans/>
                                </div>
                            </div>
                            : <SkeletonElement className={'w-20 mt-2 h-5'}/>
                    }

                </div>
            </section>
            {

                appeal.title ?
                    <div className={'px-5 my-2'}>
                <span
                    className={'IranSans text-textDark text-sm'}>شما باید پیشنهاد خود را در این بازه مطرح کنید</span>
                    </div> :
                    null}

            {
                appeal.details ?
                    <div>
                        <section className={'w-full bg-white px-5 pt-2 pb-5'}>
                            <div className={'text-textDarker IranSansMedium mt-2'}>توضیحات</div>
                            <div className={'px-5 mt-2'}>
                    <span className={'IranSansMedium'}>
                        {
                            appeal.details ?? <div className={'w-full flex flex-col justify-center items-start'}>
                                <SkeletonElement className={'w-full mt-2 h-5'}/>
                                <SkeletonElement className={'w-full mt-2 h-5'}/>
                                <SkeletonElement className={'w-full mt-2 h-5'}/>
                            </div>

                        }
                </span>
                            </div>

                        </section>
                        <div className={'px-5 h-2 my-2'}/>

                    </div>

                    :
                    null
            }


            {
                appeal.attachments && appeal.attachments.length ?
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
                        <div className={''}>
                            {
                                currentMediaPart === 'files' ?
                                    <div className={'files w-full flex flex-col items-center justify-center mt-3 px-5'}>

                                        {appeal.attachments.map((file: AttachmentFiles) => {
                                            if (file.uploadedAsFile) {
                                                return (
                                                    <a href={DOWNLOAD_HOST + '/' + file.url} rel={'noreferrer'}
                                                       target={'_blank'} key={file.url} className={'contents'}>
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

                                                    </a>
                                                )
                                            }
                                        })}


                                    </div>
                                    :
                                    <div className={'photos grid grid-cols-3 items-center justify-items-center'}>
                                        {
                                            appeal.attachments.map((file: AttachmentFiles, index) => {
                                                if (!file.uploadedAsFile)
                                                    return (<a href={DOWNLOAD_HOST + '/' + file.url} target={'_blank'}
                                                               rel={'noreferrer'} key={`${index}photo`}
                                                               className={'aspect-square new-photo  cover-fill w-full flex flex-col justify-center items-center border-2  relative overflow-hidden '}>
                                                            <img src={`${DOWNLOAD_HOST}/${file.preview}`}
                                                                 alt={'Unimun ' + index}
                                                                 className={' w-full h-full'}/>
                                                            {/*<div dir={'ltr'}*/}
                                                            {/*     className={'w-9 h-9  rounded-xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col justify-center items-center'}*/}
                                                            {/*     style={{background: 'rgba(255,255,255,0.85)'}}>*/}
                                                            {/*    /!*<SVGModifier SVGName={'galleryImage'}*!/*/}
                                                            {/*    /!*             elementClass={'number'}*!/*/}
                                                            {/*    /!*             value={(index + 1).toString()}>*!/*/}
                                                            {/*    /!*    <GalleryImageSVG/>*!/*/}
                                                            {/*    /!*</SVGModifier>*!/*/}
                                                            {/*</div>*/}
                                                        </a>
                                                    )
                                            })
                                        }
                                    </div>

                            }


                        </div>

                    </section>
                    :
                    // <div className={'w-full bg-white h-3/5'}/>
                    null
            }


        </div>
    );
};

export default Item;