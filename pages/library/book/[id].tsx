import React, {useEffect, useRef, useState} from 'react';
import ImageSlider from "../../../components/normal/ImageSlider/ImageSlider";
import Header from "../../../components/common/Header/Header";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import Button from "../../../components/view/Button/Button";
import Toman from '../../../assets/svgs/toman.svg'
import Downlad from '../../../assets/svgs/downloadOutline.svg'
import Pdf from '../../../assets/svgs/pdf.svg'
import Dimmer from "../../../components/view/Dimmer/Dimmer";
import LoadingDialog from "../../../components/view/LoadingDialog/LoadingDialog";
import {useRouter} from "next/router";
import {passedTime} from "../../../helpers/passedTime";
import ArrowUp from '../../../assets/svgs/arrowUp.svg';
import Unimun from "../../../assets/svgs/unimun.svg";
import DownloadBold from "../../../assets/svgs/download-bold.svg";
import More from "../../../assets/svgs/more.svg";
import BookmarkBook from "../../../assets/svgs/bookmark-book.svg";
import BackButton from "../../../assets/svgCodes/BackButton";
import Toast from "../../../components/normal/Toast/Toast";
import {ToastContainer} from "react-toastify";
import {UserData, UserId} from "../../../store/user";
import {getAndSetUserData} from "../../../helpers/GetAndSetUserData";
import {getUserQuery} from "../../../Requests/normal/user";


interface Props {
    id: string
}

const Book = (props: Props) => {
    const router = useRouter()


    const getBookQuery = gql`
        query getBook($id:ID!){
            book(id:$id){
                data{
                    title
                    id
                    connectWay
                    creator {
                        name
                        username
                        id
                    }
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
                    bookFiles {
                        url
                    }
                }
            }
        }

    `

    let bookConnectQuery = gql`
        mutation bookConnect($bookId:ID!,$userId:ID!){
            bookConnectClick(
                bookID:$bookId
                userID:$userId
            )
            {
                status
                message
                data
            }
        }
    `

    const [bookConnectMutation, {loading, data, error}] = useMutation(bookConnectQuery)
    const [getUser, getUserResults] = useLazyQuery(gql`${getUserQuery(['id', 'name', 'created_at', 'phone', 'referenceCode','username','bio','level','xpLevelPercentage']).query}`)

    const [getBook, getBookResults] = useLazyQuery(getBookQuery)

    const [book, _book] = useState({} as any);
    const [bookDetails, _bookDetails] = useState(false)
    const phoneInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {

        let bookId = window.location.href.split('/')[window.location.href.split('/').length - 1]
        getBook({variables: {id: bookId}}).then((e) => {
            try {
                _book(e.data.book.data)
            } catch (e) {
                console.log(e)
            }
        })


    }, [])

    return (
        <div className={'overflow-scroll h-full'}>

            <ToastContainer/>
            <Dimmer show={getBookResults.loading} onClose={() => {


            }}/>

            {getBookResults.loading ?
                // <div className={'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}> </div>
                <LoadingDialog
                    color={'#3498db'}
                    wrapperClassName={'m-auto  w-20 h-20 bg-white rounded-xl fixed  top-1/2  -translate-y-1/2 z-50'}/>
                :
                null
            }


            <div
                className={'absolute z-40 -top-1 w-full h-14 backdrop-blur  flex flex-row justify-between items-center'}
                style={{background: 'rgba(245,248,250,0.83)'}}>
                <div className={'px-1 mr-4'} onClick={() => {
                    router.push('/library')

                }}>
                    {BackButton}
                </div>

                <div className={'flex flex-row justify-center items-center ml-3'}>
                    {/*<div className={'w-6 h-6 ml-2 '}>*/}
                    {/*    <BookmarkBook/>*/}
                    {/*</div>*/}
                    {/*<div className={'w-6 h-6 '}>*/}
                    {/*    <More/>*/}
                    {/*</div>*/}
                </div>


            </div>
            {
                book.attachments ?
                    <ImageSlider images={book.attachments}/>
                    : null

            }
            <div className={'px-3 pt-3'}>

                {/*<Header backOnClick={() => {*/}
                {/*    router.push('/library')*/}

                {/*}} back={true} title={'کتاب'}/>*/}


                <span
                    className={'text-textDark IranSansMedium mx-auto block text-sm text-center mt-4'}>{book.writer ?? "نویسنده مشخص نشده"}</span>
                <span
                    className={'text-black IranSansBold mx-auto block text-center mt-2'}>{book.title ?? '-'}</span>


                <div className={'w-full flex flex-row justify-around items-center h-16 nt-3'}>
                    <div className={'flex flex-col justify-center items-center basis-0 flex-1'}>

                        <span className={'text-textDark IranSansMedium text-sm'}>دسته بندی</span>
                        <span
                            className={'text-textBlack IranSansMedium text-sm mt-1 '}>{book.category ? book.category.title : 'مشخص نشده' ?? 'مشخص نشده'}</span>
                    </div>


                    <div className={'flex flex-col justify-center items-center basis-0 flex-1'}>
                        <span className={'text-textDark IranSansMedium text-sm'}>تعداد صفحه</span>
                        <span className={'text-black IranSansMedium text-md'}>{book.pages ?? "-"}</span>
                    </div>


                    <div className={'flex flex-col justify-center items-center basis-0 flex-1'}>
                        <span className={'text-textDark IranSansMedium text-sm'}>ارائه دهنده</span>
                        {
                            book.creator ?
                                <span className={'text-textBlack IranSansMedium text-sm mt-1 '}>محمد</span>
                                :
                                <div className={'mt-1 w-16'}>
                                    <Unimun/>

                                </div>

                        }
                    </div>
                </div>

                <div
                    className={`w-full px-4 IranSansMedium pt-3 ${bookDetails ? ' pb-20' : 'pb-1'} transition-all text-sm rounded-2xl overflow-hidden bg-white relative  flex flex-col justify-start items-start mt-4`}>
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

                    <div
                        className={'absolute transition-all flex flex-col justify-center pb-2 items-center bottom-0 px-3 h-16 bg-white w-full left-1/2 -translate-x-1/2'}
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
                                <div className={`${bookDetails ? "" : 'rotate-180'} transition-all duration-500`}>
                                    <ArrowUp/>
                                </div>
                                <span
                                    className={'inline-block mx-3 text-primary transition-all w-auto '}>{bookDetails ? 'بستن ' : 'بیشتر'}</span>
                            </div>
                        </Button>
                    </div>


                </div>


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
                        <p className={'text-justify px-2 mt-3 w-full '}>{book.details}</p>


                    </div>
                    :
                    null
                }


                <div className={'h-36'}></div>
                <div
                    className={'w-11/12 rounded-2xl IranSansMedium bg-white  fixed bottom-4 h-28   p-3 left-1/2 -translate-x-1/2 max-w-sm shadow-lg '}>
                    <div className={'w-full text-lg h-full relative'}>
                        <div className={'w-full flex flex-row justify-between items-center px-3 pt-1 '}>
                            <span className={'text-md scale-90'}>قیمت</span>
                            {
                                book.price ?
                                    <div className={'flex flex-row justify-center items-start'}>
                                        <span className={'block ml-1'}>{book.price}</span>
                                        <div className={'h-5 w-5 '}><Toman/></div>
                                    </div>
                                    :
                                    <div className={'flex flex-row justify-center items-start'}>
                                        <span className={'block ml-1'}>{'رایگان'}</span>
                                    </div>
                            }


                        </div>
                        <div className={'fixed bottom-2 w-full left-1/2 -translate-x-1/2 px-2'}>


                            <Button id={'buy-book'} className={'w-full h-12 bg-primary rounded-xl  bottom-0 '}
                                    rippleColor={'rgba(255,255,255,0.4)'}
                                    onClick={() => {

                                        // console.log(book.bookFiles[0].url)
                                        if (book.isDownloadable)
                                            window.open(book.bookFiles[0].url, '_blank')

                                        if (book.isPurchasable) {
                                            let bookId = window.location.href.split('/')[window.location.href.split('/').length - 1]


                                            if (book.connectWay) {
                                                if (book.connectWay[0] === "0") {

                                                    if (!UserId()) {
                                                        router.push('/profile/login')
                                                    }
                                                    bookConnectMutation({
                                                        variables: {
                                                            bookId: bookId,
                                                            userId: UserId()
                                                        }
                                                    }).then((value) => {
                                                        if (value.data.bookConnectClick.status === "SUCCESS") {
                                                            Toast('درخواست شما برای ارائه دهنده ارسال شد ');
                                                        }
                                                    })

                                                    let text = book.connectWay;
                                                    navigator.clipboard.writeText(text).then(function () {
                                                        Toast('شماره تلفن در کلیپبورد شما کپی شد');
                                                    }, function () {
                                                        Toast(book.connectWay);
                                                    });
                                                } else {
                                                    window.open(`https://t.me/${book.connectWay.replace('@', '')}`, '_blank')
                                                }
                                            }

                                        }
                                        // window.open(book.bookFiles[0].url, '_blank')

                                    }}

                            >

                                {
                                    book.isDownloadable ?
                                        <div className={'w-full h-full flex flex-row justify-between items-center'}>
                                            <div className={'flex flex-row justify-center items-center px-4'}>

                                                <div className={'h-6 w-6'}>
                                                    <DownloadBold/>
                                                </div>
                                                <span
                                                    className={'text-white block mr-3 '}
                                                    style={{fontSize: '1rem'}}>{book.isBook ? 'دانـلود کتـاب' : 'دانـلود جـزوه'}</span>
                                            </div>
                                            <div className={'flex px-3 flex-row justify-center items-center'}>

                                                <div dir={'ltr'}
                                                     className={'h-9 w-9 pb-1 flex flex-col justify-center items-center'}>
                                                    <Pdf/>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className={'w-full h-full flex flex-row justify-center items-center'}>
                                            <div className={'flex flex-row justify-center items-center px-4'}>

                                                <span
                                                    className={'text-white block mr-3 '}
                                                    style={{fontSize: '1rem'}}>{book.isBook ? 'کتاب رو میخوام' : 'جزوه رو میخوام'}</span>
                                            </div>

                                        </div>
                                }

                            </Button>
                        </div>

                    </div>


                </div>
            </div>


        </div>
    );
};

export default Book;