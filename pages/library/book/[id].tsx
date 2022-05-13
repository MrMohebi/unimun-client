import React, {useEffect, useState} from 'react';
import ImageSlider from "../../../components/normal/ImageSlider/ImageSlider";
import Header from "../../../components/common/Header/Header";
import {gql, useLazyQuery} from "@apollo/client";
import Button from "../../../components/view/Button/Button";
import Toman from '../../../assets/svgs/toman.svg'
import Downlad from '../../../assets/svgs/downloadOutline.svg'
import Pdf from '../../../assets/svgs/pdf.svg'
import Dimmer from "../../../components/view/Dimmer/Dimmer";
import LoadingDialog from "../../../components/view/LoadingDialog/LoadingDialog";
import {useRouter} from "next/router";
import {passedTime} from "../../../helpers/passedTime";
import ArrowUp from '../../../assets/svgs/arrowUp.svg';


interface Props {
    id: string
}

const Book = (props: Props) => {
    const router = useRouter()


    const getBookQuery = gql`
        query getBook($id:ID!){
            book(id:$id){
                data{
                    isBook
                    sizeMB
                    details
                    title
                    attachments {
                        url
                        preview
                    }
                    category {
                        title
                    }
                    appearance {
                        title
                    }
                    isDownloadable
                    isPurchasable
                    price
                    pages
                    writer
                    createdAt
                    publisher
                    publishedDate
                    publishedAt
                    language
                }
            }
        }

    `

    const [getBook, getBookResults] = useLazyQuery(getBookQuery)

    const [book, _book] = useState({} as any);
    const [bookDetails, _bookDetails] = useState(false)

    useEffect(() => {
        let bookId = window.location.href.split('/')[window.location.href.split('/').length - 1]
        getBook({variables: {id: bookId}}).then((e) => {
            try {
                _book(e.data.book.data)
                console.log(e.data.book.data)
            } catch (e) {
                console.log(e)
            }
        })
    }, [])


    return (
        <div className={'px-3'}>


            <Dimmer show={getBookResults.loading} onClose={() => {


            }}/>
            <Header backOnClick={() => {
                router.push('/library')

            }} back={true} title={'کتاب'}/>
            {
                book.attachments ?
                    <ImageSlider images={book.attachments}/>
                    : null

            }


            <span className={'text-textDark IranSansMedium mx-auto block text-sm text-center mt-4'}>نویسنده</span>
            <span
                className={'text-black IranSansBold mx-auto block text-center mt-2'}>{book.writer ?? 'مشخص نشده'}</span>


            <div className={'w-full flex flex-row justify-around items-center h-16 nt-3'}>
                <div className={'flex flex-col justify-center items-center basis-0 flex-1'}>

                    <span className={'text-textDark IranSansMedium text-sm'}>دسته بندی</span>
                    <span
                        className={'text-primary IranSansMedium text-md '}>{book.category ? book.category.title : 'مشخص نشده' ?? 'مشخص نشده'}</span>
                </div>

                {/*<div className={'w-0 h-3/5 border border-gray-300'}/>*/}

                <div className={'flex flex-col justify-center items-center basis-0 flex-1'}>
                    <span className={'text-textDark IranSansMedium text-sm'}>تعداد صفحه</span>
                    <span className={'text-black IranSansMedium text-md'}>{book.pages ?? "00"}</span>
                </div>

                {/*<div className={'w-0 h-3/5 border border-gray-300'}/>*/}

                <div className={'flex flex-col justify-center items-center basis-0 flex-1'}>
                    <span className={'text-textDark IranSansMedium text-sm'}>ارائه دهنده</span>
                    <span className={'text-primary IranSansMedium text-md '}>یونیمون</span>
                </div>
            </div>

            <div
                className={`w-full px-4 IranSansMedium pt-3 ${bookDetails ? ' pb-20' : 'pb-1'} transition-all text-sm rounded-2xl bg-white relative  flex flex-col justify-start items-start mt-4`}>
                <div className={'flex flex-row'}>

                </div>

                <div className={'mt-2'}>
                    <span className={'text-textDark IranSansMedium text-sm inline-block'}> وضعیت ظاهری:</span>

                    <span
                        className={'text-black IranSansMedium text-sm inline-block mr-2 '}>{book.appearance ? book.appearance.title : '-'}</span>
                </div>


                <div className={'mt-2'}>
                    <span className={'text-textDark IranSansMedium text-sm inline-block'}> ناشر:</span>

                    <span
                        className={'text-black IranSansMedium text-sm inline-block mr-2 '}>{book.publisher ?? '-'}</span>
                </div>

                <div className={'mt-2'}>
                    <span className={'text-textDark IranSansMedium text-sm inline-block'}> سال انتشار:</span>

                    <span
                        className={'text-black IranSansMedium text-sm inline-block mr-2 '}>{book.publisherDate ?? '-'}</span>
                </div>
                <div className={'mt-2'}>
                    <span className={'text-textDark IranSansMedium text-sm inline-block'}>زبان:</span>

                    <span
                        className={'text-black IranSansMedium text-sm inline-block mr-2 '}>{book.language ?? '-'}</span>
                </div>
                <div className={'mt-2'}>
                    <span className={'text-textDark IranSansMedium text-sm inline-block'}>زمان ثبت آگهی:</span>

                    <span
                        className={'text-black IranSansMedium text-sm inline-block mr-2 '}>{book.createdAt ? passedTime(book.createdAt) : '-'}</span>
                </div>

                <div className={'absolute transition-all bottom-0 h-16 bg-white w-full left-1/2 -translate-x-1/2'}
                     style={{
                         boxShadow: !bookDetails ? 'rgb(255 255 255) 1px -20px 20px 0px' : 'rgb(255 255 255) 0px 0px 0px 0px'
                     }}>
                    <Button id={'book-details'} className={'w-full h-12 bg-background rounded-xl  bottom-0 '}
                            rippleColor={'rgba(0,0,0,0.12)'}
                            onClick={() => {
                                _bookDetails(!bookDetails)
                            }}
                    >


                        <div className={'IranSansMedium flex flex-row justify-center items-center'}>
                            <div className={`${bookDetails ? "" : 'rotate-180'} transition-all duration-500`}><ArrowUp/>
                            </div>
                            <span className={'inline-block mx-3 text-primary'}>بستن جزعیات</span></div>
                    </Button>

                </div>


            </div>


            {getBookResults.loading ?
                // <div className={'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}> </div>
                <LoadingDialog
                    color={'#3498db'}
                    wrapperClassName={'m-auto  w-20 h-20 bg-white rounded-xl fixed  top-1/2  -translate-y-1/2 z-50'}/>
                :
                null
            }


            {book.details ?
                <div
                    className={'w-full px-4 IranSansMedium pt-3 pb-5 text-sm rounded-2xl bg-white flex flex-col justify-start items-center mt-4'}>
                    <div className={'flex flex-row'}>
                        <span className={'text-textDark opacity-30'}>-</span>
                        <span className={'text-textDarker opacity-50'}>-</span>
                        <span className={'text-black'}>-</span>
                        <span className={'w-2 block'}></span>
                        <span className={'text-textDarker'}>توضیحات</span>
                        <span className={'w-2 block'}></span>
                        <span className={'text-black'}>-</span>
                        <span className={'text-textDarker opacity-50'}>-</span>
                        <span className={'text-textDark opacity-30'}>-</span>

                    </div>
                    <p className={'text-justify mt-3 '}>{book.details}</p>


                </div>
                :
                null
            }


            <div className={'h-96'}></div>
            <div
                className={'w-11/12 rounded-2xl IranSansMedium bg-white  fixed bottom-20 h-28 border  p-3 left-1/2 -translate-x-1/2 max-w-sm  shadow-md'}>
                <div className={'w-full text-lg h-full relative'}>
                    <div className={'w-full flex flex-row justify-between items-center px-3 '}>
                        <span>قیمت</span>
                        <div className={'flex flex-row justify-center items-start'}>
                            <span className={'block ml-1'}>{book.price ?? ''}</span>
                            <div className={'h-5 w-5 '}><Toman/></div>
                        </div>

                    </div>
                    <div className={'fixed bottom-2 w-full left-1/2 -translate-x-1/2 px-3'}>
                        <Button id={'buy-buuk'} className={'w-full h-12 bg-primary rounded-xl  bottom-0 '}
                                rippleColor={'rgba(255,255,255,0.4)'}>

                            {
                                book.isDownloadable ?
                                    <div className={'w-full h-full flex flex-row justify-between items-center'}>
                                        <div className={'flex flex-row justify-center items-center px-4'}>

                                            <div className={'h-7 w-7'}>
                                                <Downlad/>
                                            </div>
                                            <span
                                                className={'text-white block mr-3 text-md'}>{book.isBook ? 'دانلود کتاب' : 'دانلود جزوه'}</span>
                                        </div>
                                        <div className={'flex px-4 flex-row justify-center items-center'}>

                                            <div dir={'ltr'}
                                                 className={'h-9 w-9 pb-1 flex flex-col justify-center items-center'}>
                                                <Pdf/>
                                            </div>

                                        </div>
                                    </div>
                                    :
                                    null
                            }

                        </Button>
                    </div>

                </div>


            </div>

        </div>
    );
};

export default Book;