import React, {useEffect, useState} from 'react';
import CircularProgressBar from "../../view/CircularProgressBar/CircularProgressBar";
import GallerySVG from "../../../assets/svgs/gallery.svg";
import {uploadBookImages} from "../../../Requests/uploadRequests";
import Toast from "../Toast/Toast";
import NewPhotoSVG from "../../../assets/svgs/newPhoto.svg";
// @ts-ignore

const BookImageUpload = (props: {
    setUploading: Function,
    bookID: string,
    onUploadComplete: Function,
    onError: Function,
    id: string,
    isFirst: boolean,
    defaultImage: string,
    onImageClick: Function,
    index?: number
    type?: string
}) => {

    const [uploadingProgress, setUploadingProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadedImageURL, setUploadedImageURL] = useState("");


    useEffect(() => {
        props.setUploading(uploading)
    }, [uploading]);

    useEffect(() => {

        if (props.defaultImage) {
            setUploadedImageURL(props.defaultImage)
        }
    }, [props.defaultImage]);


    return (
        <div
            className={`relative ${props.type === "appeal" ? "h-24 w-24" : "h-36 w-24"}  pointer-events-none overflow-hidden mt-4`}>


            {!uploadedImageURL ?

                <input type={'file'}
                       className={'opacity-0 absolute top-0 left-0 w-full h-full pointer-events-auto'}
                       accept={'.png,.jpeg,.jpg'} onInput={(e) => {

                    if (e.currentTarget && e.currentTarget.files && e.currentTarget.files.length) {
                        setUploading(true)

                        uploadBookImages(e.currentTarget.files[0], props.bookID, (response: any) => {
                                setUploading(false)
                                props.onUploadComplete(response)
                                if (typeof response.data !== "number") {
                                    setUploadingProgress(100)
                                    // setUploadedImageURL(DOWNLOAD_HOST() + (response.data.preview ?? response.data.thumbnail))
                                } else {
                                    Toast("خطا در هنگام آپلود")
                                    setUploading(false)
                                }
                            }, (error: any) => {
                                setUploading(false)
                                setUploadingProgress(0)

                                props.onError(error)
                            },
                            (progressEvent: any) => {
                                setUploading(false)
                                let percentCompleted = Math.round(
                                    (progressEvent.loaded * 100) / progressEvent.total
                                );
                                setUploadingProgress(percentCompleted)

                            }
                        )

                    }

                }}/>

                :
                <div className={'w-full h-full absolute opacity-0 pointer-events-auto'} onClick={() => {
                    props.onImageClick(props.index)
                    console.log('clicked')
                }}></div>
            }


            <div onClick={() => {
                props.onImageClick()
            }}
                 className={`new-photo relative overflow-hidden ${props.type === "appeal" ? "h-24 w-24" : "h-36 w-24"} flex flex-col justify-center items-center rounded-2xl ${props.isFirst ? "border" : "border-dashed"} border-2  relative `}>
                {
                    uploadedImageURL ?
                        <img className={'w-full h-full scale-[1.1] object-cover'} src={uploadedImageURL}
                             alt="Unimun Book Image"/>
                        :

                        uploadingProgress > 0 ?
                            <div
                                className={'relative '}>
                                <CircularProgressBar sqSize={40} strokeWidth={1.5}
                                                     percentage={uploadingProgress}
                                                     color={'#0080ff'}/>
                                <div
                                    className={'absolute left-1/2 top-1/2 -translate-y-1/2 IranSans text-primary -translate-x-1/2'}>
                                    {`${uploadingProgress}%`}
                                </div>
                            </div>

                            :
                            props.isFirst ?

                                <div className={'flex flex-col items-center justify-center'}>
                                    <div className={'h-7 w-7'}><NewPhotoSVG/></div>
                                    <span className={'text-sm IranSansMedium'}>افزودن عکس</span>
                                </div>
                                :
                                <div
                                    className={'flex flex-col items-center justify-center opacity-60'}>
                                    <div className={'h-7 w-7'}><GallerySVG/></div>
                                    <span className={'text-sm IranSansMedium'}>عکس</span>
                                </div>
                }
            </div>

        </div>
    );
};

export default BookImageUpload;