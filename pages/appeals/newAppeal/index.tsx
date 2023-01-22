import React, {useEffect, useRef, useState} from 'react';
import Header from "../../../components/common/Header/Header";
import Input from "../../../components/view/Input/Input";
import Divider from "../../../components/view/Divider/Divider";
import ThousandTomans from '../../../assets/svgs/thousandTomans.svg'
import DoubleSlider from "../../../components/view/DoubleSlider/DoubleSlider";
import StepperFragment from "../../../components/view/StepperFtagment/StepperFragment";
import Step from "../../../components/view/StepperFtagment/Step/Step";
import Button from "../../../components/view/Button/Button";
import {useRouter} from "next/router";
import {useMutation} from "@apollo/client";
import {gql} from "@apollo/client";
import {newAppealQuery} from "../../../Requests/withAuthentication/appeals";
import GallerySVG from '../../../assets/svgs/gallery.svg'
import FileUploadSVG from '../../../assets/svgs/fileUpload.svg'
import TelInputSVG from '../../../assets/svgs/telInput.svg'
import Trash from '../../../assets/svgs/trash.svg'
import BoldMobile from '../../../assets/svgs/boldMobile.svg'
import RightSquareSVG from '../../../assets/svgs/rightSquare.svg'
import axios, {AxiosRequestConfig} from "axios";
import FileSVG from "../../../assets/svgs/file.svg";
import EmptyFileSVG from "../../../assets/svgs/emptyFile.svg";
import {UserToken} from "../../../store/user";
import CircularProgressBar from "../../../components/view/CircularProgressBar/CircularProgressBar";
import {toast, ToastContainer} from "react-toastify";
import CloseSVG from "../../../assets/svgs/close.svg";
import {lastAppealSubmitSuccess} from "../../../store/appeals";
import BottomSheet from "../../../components/view/BottomSheet/BottomSheet";
import BookImageUpload from "../../../components/normal/BookImageUpload/BookImageUpload";
import {DOWNLOAD_HOST} from "../../../store/GLOBAL_VARIABLES";
import produce from "immer";
import UploadingFileLoading from "../../../components/normal/UploadingFileLoading/UploadingFileLoading";


const Index = () => {

    //states


    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [lowerPrice, setLower] = useState(10)
    const [connectWay, setConnectWay] = useState('')
    const [upperPrice, setUpper] = useState(300)
    const [hashtags, setHashtags] = useState([] as string[])
    const [uploadedImages, setUploadedImages] = useState([] as any[])
    const [uploadedFiles, setUpladedFiles] = useState([] as any[])
    const [currentStep, setCurrentStep] = useState(0)
    const [uploadingProgress, setUploadingProgress] = useState([] as number[])
    const [imageBottomSheetOpened, setImageBottomSheetOpened] = useState(false)
    const [contactType, setContactType] = useState('')
    const [contactAddress, setContactAddress] = useState('')
    const router = useRouter()
    const currentSelectedImage = useRef('')
    const newAppealMainSection = useRef<HTMLDivElement>(null)
    const [titleLimit, setTitleLimit] = useState(0)
    const currentAppealTempId = useRef((Math.random() + 1).toString(36).substring(7))

    const showError = (text: string) => {
        toast.error(text, {
            position: "bottom-center",
            autoClose: 3000,

            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            rtl: true,
        });
    }

    useEffect(() => {
        setImageBottomSheetOpened(false)
    }, [])

    const removeEmptyProgresses = () => {
        let updateUploadingProgress = [...uploadingProgress];
        updateUploadingProgress.filter(item => {
            return item !== 100 && item !== 0;
        })
        setUploadingProgress(updateUploadingProgress)
    }
    const removeEmptyHashtags = () => {
        let _hashtags = [...hashtags]
        _hashtags = _hashtags.filter((tag) => {
            return tag.length;
        })
        setHashtags(_hashtags)
    }
    const createFiles = () => {

        let files = [] as any;
        uploadedImages.forEach(image => {
            files.push((image))
        })
        uploadedFiles.forEach(file => {
            files.push((file))
        })
        return files
    }

    let query = newAppealQuery(title, lowerPrice, upperPrice, description, hashtags, createFiles(), connectWay)
    const [createAppeal, {
        data,
        loading,
        error
    }] = useMutation(gql`${query.query}`, {variables: query.variables})

    const [uploadingFile, setUploadingFile] = useState(false);

    const uploadFile = (file: any) => {
        let fileName = file.name as string;
        let fileSize = file.size as string;

        setUploadingFile(true)

        let data = new FormData();
        // data.append('token', UserToken());
        data.append('file', file);
        data.append('id', currentAppealTempId.current.toString());
        data.append('uploadedAsFile', '1');

        let config: AxiosRequestConfig = {
            method: 'post',
            url: 'https://dl.unimun.me/public/appeal/',
            headers: {
                token: UserToken()
            },
            data: data,
            onUploadProgress: (progressEvent: any) => {
                let percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadFilePercentage(percentCompleted)
            }
        };

        axios(config)
            .then(function (response) {
                setUploadingFile(false)

                if (response.data.hasOwnProperty('url')) {
                    setUpladedFiles([...uploadedFiles, response.data])
                }
            })

            .catch(function (error) {

            });

    }


    useEffect(() => {

        if (data && data.createAppeal.status === 'SUCCESS') {
            router.push('/')
        }
    }, [data, loading, error])


    const [uploadFilePercentage, setUploadFilePercentage] = useState(0);
    return (
        <div className={'h-full  overflow-scroll'} ref={newAppealMainSection}>

            <UploadingFileLoading dim={true} show={uploadingFile} uploadPercentage={uploadFilePercentage}/>
            <BottomSheet onClose={() => {
                setImageBottomSheetOpened(false)
            }} open={imageBottomSheetOpened}>
                <div className={'w-full px-4 pt-5 IranSansMedium text-md text-textDark'}>تنظیمات عکس</div>
                <Button id={'removeImage'} onClick={() => {
                    if (currentSelectedImage.current.length) {
                        let uploadedImagesArray = [...uploadedImages]
                        uploadedImagesArray.filter((image, index) => {
                            return image !== currentSelectedImage.current;
                        })
                    }
                    setImageBottomSheetOpened(false)
                }} rippleColor={'#969696'}
                        className={'w-full px-4  IranSansMedium text-sm text-textBlack h-10 mb-2 mt-2 text-right'}>حذف
                    عکس</Button>
            </BottomSheet>
            <ToastContainer/>

            <Header backOnClick={() => {
                if (currentStep > 0)
                    setCurrentStep(currentStep - 1)
                else
                    router.push('/')

            }} back={true} alignment={'rtl'} title={'ثبت آگهی'}>
                <div className={'absolute left-2'}>
                </div>
            </Header>
            <StepperFragment step={currentStep}>
                <Step step={0}>
                    <section className={'pb-20'}>
                        <div className={'w-full h-40 bg-white mt-1 px-4 pt-3 new-section'}>
                            <div className={'absolute  left-4 top-4  h-6 w-6'}>
                                <div
                                    className={`h-full text-primary text-sm IranSans absolute w-full flex flex-col justify-center items-center ${30 - title.length > 21 ? 'scale-0' : 'scale-100'} transition-all duration-300 ease-in-out`}
                                    style={{
                                        color: title.length < 21 ? '#4eb3f1' : title.length < 5 ? '#FF8800' : '#ff3333'
                                    }}>
                                    {40 - title.length}
                                </div>

                                <CircularProgressBar emptyColor={'#f6f8fa'} sqSize={25}
                                                     strokeWidth={40 - title.length > 21 ? 4 : 3}
                                                     percentage={titleLimit}
                                                     color={40 - title.length > 21 ? '#4eb3f1' : 40 - title.length > 5 ? '#FF8800' : '#ff3333'}/>
                            </div>
                            <span className={'text-textDark text-md IranSansMedium  '}>عنوان آگهی</span>
                            <div className={'w-full flex items-center justify-center relative mt-4'}>
                                <Input placeHolder={'عنوان'} maxLength={40} id={'title'} numOnly={false}
                                       wrapperClassName={'w-11/12 h-14'}
                                       onChange={(e: any) => {
                                           e.currentTarget.value = e.currentTarget.value.slice(0, 40)
                                           setTitle(e.currentTarget.value)
                                           setTitleLimit(Math.floor((e.currentTarget.value.length * 100) / 40))
                                       }}
                                       labelText={'در عنوان اگهی به موارد مهم اشاره کنید'}/>
                            </div>
                            <Divider type={'horizontal'} color={'#d7d7d7'} className={'mt-10'}/>
                        </div>
                        <div className={'w-full bg-white px-4 new-section'}>
                            <div className={'w-full flex flex-row justify-between'}>
                                <span className={'text-textDark text-md IranSansMedium  '}>بودجه</span>
                                <div className={'IranSansMedium flex flex-row items-center justify-center'}>
                                    <span className={'mx-0.5'}>از</span>
                                    <span className={'mx-0.5'}>{lowerPrice}</span>
                                    <span className={'mx-0.5'}>تا</span>
                                    <span className={'mx-0.5'}>{upperPrice}</span>
                                    <div dir={'ltr'} className={'w-10 mb-1.5'}>
                                        <ThousandTomans/>
                                    </div>
                                </div>
                            </div>
                            <div className={'w-full flex items-center justify-center'}>
                                <div dir={'rtl'} className={'w-10/12 pt-5'}>
                                    <DoubleSlider sliderColor={'#E1E8ED'} sliderSize={'5px'} defaultLower={lowerPrice}
                                                  defaultUpper={upperPrice} max={500} min={10}
                                                  steps={10} onChange={(lower: number, upper: number) => {
                                        setLower(lower)
                                        setUpper(upper)
                                    }}/>
                                </div>
                            </div>

                        </div>
                        <div className={'IranSans text-textDark text-sm mx-4 my-2'}>
                            <span>کاربران مجاز خواهند بود در این بازه قیمت به شما پیشنهاد بدهند</span>
                        </div>

                        <div className={'w-full bg-white px-4 pt-3 new-section pb-5'}>
                            <div className={'w-full flex flex-row justify-between'}>
                        <span className={'text-textDark text-md IranSansMedium  '}>هَشـ<span
                            className={'text-primary'}>#</span>تگ ها</span>
                                <div className={'IranSansMedium flex flex-row items-center justify-center'}>
                                    <span className={'mx-0.5 text-primary text-sm'}>{hashtags.length}/{5}</span>
                                </div>
                            </div>


                            <div className={'flex flex-wrap justify-start items-center mt-4'}>
                                {
                                    Array(hashtags.length).fill('').map((hashtag: string, index) => (
                                        <div key={index + 'div'}
                                             className={`IranSansMedium text-primary text-sm w-auto h-9 border border-gray-300 rounded-xl flex flex-row justify-center items-center mx-1 cursor-pointer mt-2 px-2 transition-all`}>
                                            <span id={'hashtag-tag-' + index}>#</span>
                                            <input autoFocus={true} onFocus={(e) => {
                                                setTimeout(() => {
                                                    window.scrollBy(0, 200)
                                                    document.body.scrollBy(0, 200)
                                                    if (newAppealMainSection.current)
                                                        newAppealMainSection.current.scrollBy(0, 200)
                                                }, 200)

                                            }} maxLength={20} style={{
                                                width: '20px'
                                            }}
                                                   onChange={(e) => {
                                                       let updatedHashtags = hashtags
                                                       e.currentTarget.value = e.currentTarget.value.replaceAll(/[ ]/g, '_')
                                                       e.currentTarget.value = e.currentTarget.value.replaceAll(/[@;!.# ]/g, '')
                                                       e.currentTarget.value = e.currentTarget.value.slice(0, 20)
                                                       updatedHashtags[index] = e.currentTarget.value
                                                       setHashtags([...updatedHashtags])
                                                       e.currentTarget.style.width = "0ch"
                                                       e.currentTarget.style.width = e.currentTarget.value.length + 4 + "ch"
                                                   }} value={hashtags[index]}
                                                   className={'mr-1 outline-0 focus:outline-0 transition-all focus:outline-0'}/>
                                            <div onClick={() => {
                                                let filterHashtag = [...hashtags]
                                                filterHashtag = filterHashtag.filter((fhashtag, filterIndex) => {
                                                    if (fhashtag === hashtags[index])
                                                        return false
                                                    else
                                                        return true
                                                })
                                                setHashtags(filterHashtag)
                                            }} className={'h-2 w-2'}>
                                                <CloseSVG/>
                                            </div>
                                        </div>
                                    ))
                                }
                                {
                                    hashtags.length < 5 ?
                                        <div onClick={() => {
                                            let updateHashtags;
                                            if (!hashtags.length || hashtags[hashtags.length - 1] && hashtags[hashtags.length - 1].length) {
                                                updateHashtags = [...hashtags, '']
                                                setHashtags(updateHashtags)
                                            } else {
                                                let lastHashtag = document.getElementById('hashtag-' + (hashtags.length - 1)) ?? document.createElement('div');
                                                lastHashtag!.style.borderColor = 'red';
                                                lastHashtag!.style.transform = 'scale(1.1)';
                                                setTimeout(() => {
                                                    lastHashtag!.style.borderColor = '';
                                                    lastHashtag!.style.transform = 'scale(1)';
                                                }, 100)
                                            }

                                        }}
                                             className={'IranSansMedium mt-2 text-white bg-primary text-sm w-20 h-9 border border-primary rounded-xl flex flex-row justify-center items-center mx-1 cursor-pointer'}>
                                            <span>+</span>
                                            <span className={'mr-1'}>افزودن</span>
                                        </div>
                                        :
                                        null
                                }


                            </div>
                        </div>
                        <div className={'IranSans text-textDark text-sm mx-4 my-2'}>
                            <span>با اضافه کردن حداقل 1 تا 5 هشتگ به آگهی خود به فرآیند انجام شدن آگهی سرعت ببخشید.</span>
                        </div>

                        <div className={'w-full h-40 bg-white mt-1 px-4 pt-3 new-section'}>

                            <span className={'text-textDark text-md IranSansMedium  '}>اطلاعات تماس</span>
                            <div className={'w-full flex items-center justify-center relative mt-4'}>
                                <div
                                    className={`absolute  left-6 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-8 h-8`}>

                                    <div
                                        className={`w-full relative  h-full bg-background rounded-md p-2 flex flex-col justify-center items-center `}>
                                        <div
                                            className={`w-5 absolute flex flex-col justify-center items-center h-5 ${contactType === 'telegram' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} transition-all duration-300`}>
                                            <TelInputSVG/>
                                        </div>
                                        <div
                                            className={`w-5 absolute flex flex-col justify-center items-center h-5 ${contactType === 'phone' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} transition-all duration-300`}>
                                            <BoldMobile/>
                                        </div>
                                        <div
                                            className={`w-5 absolute flex flex-col justify-center items-center h-5 ${contactType === '' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} transition-all duration-300`}>
                                            <RightSquareSVG/>
                                        </div>
                                    </div>


                                </div>
                                <Input dir={'ltr'} placeHolder={''} inputClassName={'text-left pl-12'} maxLength={30}
                                       id={'title'} numOnly={false}
                                       wrapperClassName={'w-11/12 h-14 '}
                                       onChange={(e: any) => {
                                           if (e.currentTarget.value.length > 0) {
                                               if (contactType === 'phone') {
                                                   e.currentTarget.value = e.currentTarget.value.replaceAll(/[^0-9]/g, '')
                                               }
                                               if (/[^0-9]/.test(e.currentTarget.value)) {
                                                   setContactType('telegram')
                                                   e.currentTarget.value = '@' + e.currentTarget.value.replaceAll(/[^a-zA-z0-9]/g, '')
                                                   // e.currentTarget.value =  e.currentTarget.value.replaceAll(/[^0-9]/g, '')

                                               } else {
                                                   setContactType('phone')
                                               }
                                           } else
                                               setContactType('')
                                           setContactAddress(e.currentTarget.value)

                                           setConnectWay(e.currentTarget.value)
                                       }}

                                       labelText={'شماره تلفن یا آیدی تلگرام'}/>
                            </div>

                        </div>

                    </section>

                </Step>


                <Step step={1}>
                    <div className={'w-full bg-white mt-1 px-4 pb-10 pt-3 new-section '}>
                        <span className={'text-textDark text-md IranSansMedium  '}>توضیحات اضافه</span>
                        <div className={'w-full flex items-center justify-center mt-4 h-40'}>
                            <Input onChange={(e: any) => {
                                setDescription(e.currentTarget.value)
                            }} multiLine={true} id={'title'} numOnly={false}
                                   inputClassName={'bg-transparent h-full w-full IranSans border-2 border-primary rounded-lg bg-pri h-26  outline-0 px-3 py-4 '}
                                   wrapperClassName={'w-11/12 h-full'}
                                   labelText={'توضیحات تکمیلی اگهی خود را بنویسید'}/>
                        </div>
                    </div>


                    <div className={'w-full bg-white px-5 pt-3 new-section pb-5 mt-4'}>
                        <div className={'w-full flex flex-row justify-between'}>
                            <span className={' text-lg IranSansMedium text-primary '}>آپلود</span>
                        </div>
                        <div className={'flex flex-row justify-between items-center'}>
                            <div className={'flex flex-row items-center justify-start mt-3'}>
                                <div className={'h-6 w-6'}>
                                    <GallerySVG/>
                                </div>
                                <span className={'IranSans mr-2'}>عکس</span>
                            </div>

                            <span
                                className={'text-primary IranSansMedium text-sm'}>{`${uploadedImages.length}/5`}</span>
                        </div>

                        <div
                            className={'new-photos grid grid-cols-3 grid-rows-2 justify-items-center mt-3 max-w-sm mx-auto'}>
                            {
                                Array(6).fill('').map((photos, index) => {

                                    return <div key={index + 'imageUpload'} className={'contents'}>
                                        <BookImageUpload type={'appeal'} index={index}
                                                         onImageClick={(indexOfSelectedImage: number) => {
                                                             // setCurrentSelectedImage(indexOfSelectedImage)
                                                             console.log(indexOfSelectedImage)

                                                             // setImageOptionsOpen(true)
                                                         }}
                                                         defaultImage={uploadedImages[index] ? DOWNLOAD_HOST() + uploadedImages[index].preview ?? "" : ''}
                                                         isFirst={index === 0}
                                                         id={index.toString()}
                                                         onUploadComplete={(e: any) => {
                                                             if (typeof e.data !== 'number') {
                                                                 let backBook = produce(uploadedImages, (draft: any) => {
                                                                     draft.push(e.data)
                                                                 })
                                                                 setUploadedImages(backBook)

                                                                 console.log(e)

                                                             }

                                                         }} onError={(e: any) => {
                                            console.log(e)
                                        }} bookID={currentAppealTempId.current} setUploading={() => {

                                        }}/>
                                    </div>

                                })
                            }


                        </div>


                        <div className={'flex flex-row justify-between items-center'}>
                            <div className={'flex flex-row items-center justify-start mt-3'}>
                                <div className={'h-6 w-6'}>
                                    <FileUploadSVG/>
                                </div>
                                <span className={'IranSans mr-2'}>فایل</span>
                            </div>
                            <span
                                className={'text-primary IranSansMedium text-sm'}>{`${uploadedFiles.length}/5`}</span>
                        </div>
                        <div
                            className={'new-file flex flex-col justify-center items-center mt-3 max-w-sm border-2 border-dashed  rounded-2xl mx-auto px-4 relative'}>
                            <input type={"file"} className={'absolute w-full h-full top-0 left-0 opacity-0 z-10'}
                                   onInput={(e) => {
                                       if (e && e.currentTarget && e.currentTarget.files)
                                           uploadFile(e.currentTarget.files[0])
                                   }}/>
                            <div className={'file w-full flex flex-row justify-between items-center my-3'}>
                                <div className={'file-right flex flex-row justify-center items-center'}>
                                    <div dir={'ltr'} className={'h-10 w-10 m-0 overflow-hidden'}><EmptyFileSVG/></div>
                                    <div className={'IranSansMedium mr-4 opacity-60'}>افزودن فایل</div>
                                </div>
                                <div dir={'ltr'} className={'IranSans w-7 h-7 '}><FileUploadSVG/></div>
                            </div>
                        </div>


                        {uploadedFiles.map((file, index) => {
                            return (<div key={index + 'file'}
                                         className={'new-file flex flex-col justify-center items-center mt-3 max-w-sm border-2 border-dashed  rounded-2xl mx-auto px-4 relative'}>
                                <div className={'file w-full flex flex-row justify-between items-center my-3'}>
                                    <div className={'file-right flex flex-row justify-start items-center'}>
                                        <div dir={'ltr'} className={'h-10 w-10 m-0 overflow-hidden'}><FileSVG/></div>
                                        <div className={'flex flex-col justify-start items-start'}>
                                            <div
                                                className={'IranSansMedium mr-4 opacity-60 whitespace-nowrap max-w-[10rem] overflow-hidden overflow-ellipsis'}>{((file).url).split('/').reverse()[0]}
                                            </div>
                                            <div
                                                className={'IranSansMedium mr-4 opacity-60 whitespace-nowrap max-w-[10rem] overflow-hidden overflow-ellipsis text-textDark text-sm'}>{file.sizeMB + "MB"}
                                            </div>
                                        </div>

                                    </div>
                                    <div dir={'ltr'} className={'IranSans w-7 h-7 '}><Trash/></div>
                                </div>
                            </div>)
                        })}

                        <div className={'h-32'}/>

                    </div>
                </Step>
            </StepperFragment>


            <div className={'w-full bottom-2 fixed flex flex-row items-center justify-center po'}>
                <Button
                    disabled={title.length < 3 || contactType === '' || (contactType === 'phone' && contactAddress.length < 11)}
                    id={'new-appeal-submit'}
                    loading={loading}
                    className={`w-11/12 h-14 ${title.length < 3 || contactType === '' || (contactType === 'phone' && contactAddress.length < 11) ? "bg-gray-400" : 'bg-primary'} transition-all duration-300  rounded-xl flex flex-row justify-between items-center px-4`}
                    rippleColor={'rgba(255,255,255,0.49)'}
                    onClick={() => {
                        removeEmptyHashtags()
                        if (currentStep !== 1)
                            setCurrentStep(currentStep + 1)
                        else {

                            createAppeal().then(e => {
                                try {
                                    if (e.data.createAppeal.status === "SUCCESS") {
                                        lastAppealSubmitSuccess(e.data.createAppeal.data.id)

                                        router.push('/')
                                    } else {
                                        showError('خطا در ساخت آگهی، لطفا دوباره تلاش کنید')
                                    }
                                } catch (e) {
                                    showError('خطا در ساخت آگهی، لطفا دوباره تلاش کنید')
                                }

                            })
                        }
                    }}>
                    <div className={'text-white IranSans w-8 '}/>
                    <div className={'text-white IranSans  '}>{`${currentStep == 1 ? 'ثبت' : 'بعدی'}`}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"
                         opacity={currentStep == 1 ? 0 : 1}>
                        <g id="arrow-left" transform="translate(-363.5 -251.5)">
                            <g id="Vector" transform="translate(371.155 255.333)" fill="#fff">
                                <path
                                    d="M 7.84499979019165 17.58749961853027 C 7.578320026397705 17.58749961853027 7.327309608459473 17.48336029052734 7.138219833374023 17.29427909851074 L 0.618219792842865 10.77427959442139 C -0.5434601902961731 9.61259937286377 -0.5434601902961731 7.722399711608887 0.618219792842865 6.56071949005127 L 7.138219833374023 0.04071969538927078 C 7.325699806213379 -0.1467503011226654 7.576699733734131 -0.2500002980232239 7.84499979019165 -0.2500002980232239 C 8.113299369812012 -0.2500002980232239 8.364299774169922 -0.1467503011226654 8.551779747009277 0.04071969538927078 C 8.941490173339844 0.430439680814743 8.941490173339844 1.064559698104858 8.551779747009277 1.454279661178589 L 2.031779766082764 7.974279880523682 C 1.649529814720154 8.35651969909668 1.649529814720154 8.978479385375977 2.031779766082764 9.360719680786133 L 8.551779747009277 15.8807201385498 C 8.941490173339844 16.27043914794922 8.941490173339844 16.90456008911133 8.551779747009277 17.29427909851074 L 8.54872989654541 17.29731941223145 L 8.54557991027832 17.30026054382324 C 8.34712028503418 17.48548889160156 8.098320007324219 17.58749961853027 7.84499979019165 17.58749961853027 Z"
                                    stroke="none"/>
                                <path
                                    d="M 7.84499979019165 17.33749961853027 C 8.034999847412109 17.33749961853027 8.22499942779541 17.25749969482422 8.375 17.11750030517578 C 8.664999961853027 16.82749938964844 8.664999961853027 16.34749984741211 8.375 16.05749893188477 L 1.854999780654907 9.53749942779541 C 1.374999761581421 9.057499885559082 1.374999761581421 8.277500152587891 1.854999780654907 7.797499656677246 L 8.375 1.277499675750732 C 8.664999961853027 0.9874997138977051 8.664999961853027 0.5074996948242188 8.375 0.2174996882677078 C 8.08499813079834 -0.07250067591667175 7.604999542236328 -0.07249993830919266 7.314999580383301 0.2174996882677078 L 0.7949998378753662 6.737499713897705 C -0.265000194311142 7.797499656677246 -0.265000194311142 9.53749942779541 0.7949998378753662 10.59749984741211 L 7.314999580383301 17.11750030517578 C 7.464999675750732 17.26749992370605 7.654999732971191 17.33749961853027 7.84499979019165 17.33749961853027 M 7.84499979019165 17.83749961853027 C 7.511539936065674 17.83749961853027 7.197749614715576 17.70735931396484 6.96144962310791 17.47105026245117 L 0.4414498209953308 10.9510498046875 C -0.8177101612091064 9.691899299621582 -0.8177101612091064 7.643099784851074 0.4414498209953308 6.383949756622314 L 6.96144962310791 -0.1360502988100052 C 7.196139812469482 -0.3707503080368042 7.509929656982422 -0.5000002980232239 7.84499979019165 -0.5000002980232239 C 8.180069923400879 -0.5000002980232239 8.493860244750977 -0.3707503080368042 8.728549957275391 -0.1360502988100052 C 9.215749740600586 0.3511396944522858 9.215749740600586 1.14385974407196 8.728549957275391 1.631049752235413 L 2.208549737930298 8.151049613952637 C 1.923779845237732 8.435819625854492 1.923779845237732 8.899179458618164 2.208549737930298 9.18394947052002 L 8.728549957275391 15.70394992828369 C 9.215749740600586 16.19113922119141 9.215749740600586 16.98386001586914 8.728549957275391 17.47105026245117 L 8.716159820556641 17.48303031921387 C 8.471249580383301 17.71160888671875 8.161859512329102 17.83749961853027 7.84499979019165 17.83749961853027 Z"
                                    stroke="none" fill="#fff"/>
                            </g>
                            <g id="Vector-2" data-name="Vector" transform="translate(364 252)" fill="none" opacity="0">
                                <path d="M0,0H24V24H0Z" stroke="none"/>
                                <path
                                    d="M 0 0 L 0 24 L 24 24 L 24 0 L 0 0 M -0.5 -0.5 L 24.5 -0.5 L 24.5 24.5 L -0.5 24.5 L -0.5 -0.5 Z"
                                    stroke="none" fill="#fff"/>
                            </g>
                        </g>
                    </svg>
                </Button>
            </div>

        </div>
    )
        ;
};

export default Index;