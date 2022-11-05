import React, {useEffect, useRef, useState} from 'react';
import ImageSlider from "../../../components/normal/ImageSlider/ImageSlider";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import Button from "../../../components/view/Button/Button";
import Toman from '../../../assets/svgs/toman.svg'
import Pdf from '../../../assets/svgs/pdf.svg'
import {useRouter} from "next/router";
import {passedTime} from "../../../helpers/passedTime";
import ArrowUp from '../../../assets/svgs/arrowUp.svg';
import Unimun from "../../../assets/svgs/unimun.svg";
import DownloadBold from "../../../assets/svgs/download-bold.svg";
import BackButton from "../../../assets/svgCodes/BackButton";
import {ToastContainer} from "react-toastify";
import {UserToken} from "../../../store/user";
import {getUserQuery} from "../../../Requests/normal/user";
import {fixPrice} from "../../../helpers/fixPrice";
import NoPic from "../../../components/normal/NoPic/NoPic";
import Free from "../../../assets/svgs/free.svg";
import {DOWNLOAD_HOST, UNIMUN_PROVIDERS, UnimunID} from "../../../store/GLOBAL_VARIABLES";
import {clientChat} from "../../../apollo-client";
import {TailSpin} from "react-loader-spinner";
import {CurrentChatUserData} from "../../../store/chat";
import {GET_SUPPORT_CHAT_QUERY, NEW_MESSAGE_MUTATION} from "../../../Requests/GlobalRequests/GlobalRequests";
import LoginBottomSheet from "../../../components/normal/LoginBottomSheet/LoginBottomSheet";
import FullScreenLoading from "../../../components/normal/FullScreenLoading/FullScreenLoading";


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
                    teacher
                    university
                    publishedAt
                    term
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
    const [fullScreenLoading, setFullScreenLoading] = useState(false);

    const [isBook, setIsBook] = useState(true);
    const [contactAppealShow, setContactAppealShow] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [book, _book] = useState({} as any);
    const [bookDetails, _bookDetails] = useState(false)
    const phoneInputRef = useRef<HTMLInputElement>(null)
    const [bookId, setBookId] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    useEffect(() => {

        let bookId = window.location.href.split('/')[window.location.href.split('/').length - 1]
        setBookId(bookId)
        getBook({variables: {id: bookId}}).then((e) => {
            try {
                _book(e.data.book.data)
                setIsBook(e.data.book.data.isBook)
            } catch (e) {
                console.log(e)
            }
        })


    }, [])


    const [newMessage, newMessageResult] = useMutation(NEW_MESSAGE_MUTATION, {client: clientChat})


    const [getSupportChat, supportChatResult] = useLazyQuery(GET_SUPPORT_CHAT_QUERY, {client: clientChat});


    const downloadBook = () => {
        if (UserToken()) {
            window.open(DOWNLOAD_HOST() + book.bookFiles[0].url, '_blank')
        } else {
            setLoginOpen(true)
        }
    }

    const requestBookFromChat = () => {

        setBtnLoading(true)
        getSupportChat().then((e) => {
            setBtnLoading(false)
            if (e.data && e.data.supportChat.id) {

                // console.log(router.route)
                newMessage({
                    variables: {
                        chatID: e.data.supportChat.id,
                        text: `                   این کتاب رو میخوام
                    
                    ${window.location.origin}/library/book/${bookId}
                    `
                    }
                }).then((value) => {

                    CurrentChatUserData(e.data.supportChat)
                    router.push('/chat/' + e.data.supportChat.id)
                })
            }
        })
    }
    const buyBookFromUnimun = () => {

        if (UserToken()) {
            if (book.bookFiles && book.bookFiles.length) {
                downloadBook()
                return 0
            }

            requestBookFromChat()


        } else {
            setLoginOpen(true)
        }


    }

    return (
        <div className={'overflow-scroll h-full'}>

            <LoginBottomSheet open={loginOpen} onClose={() => {
                setLoginOpen(false)
            }} onLoginComplete={() => {
                window.location.reload();
                setLoginOpen(false)

            }}
            />


            {/*<ContactToast*/}
            {/*    onClose={(command: string) => {*/}
            {/*        if (command === 'copyPhone') {*/}
            {/*            setTimeout(() => {*/}
            {/*                Toast("شماره تلفن کپی شد", '', 1000, <div className={'w-5 h-5 '}><Copy/></div>, 70)*/}

            {/*            }, 300)*/}
            {/*        }*/}

            {/*        if (command === 'copyTel') {*/}
            {/*            setTimeout(() => {*/}
            {/*                Toast("آیدی تلگرام کپی شد", '', 1000, <div className={'w-5 h-5 '}><Copy/></div>, 70)*/}

            {/*            }, 300)*/}
            {/*        }*/}
            {/*        setContactAppealShow(false)*/}

            {/*    }}*/}
            {/*    buttonOnClick={() => {*/}

            {/*        console.log(book)*/}
            {/*    }}*/}
            {/*    show={contactAppealShow}*/}
            {/*    type={/[^0-9]/.test(book.connectWay) ? 'telegram' : 'phone'}*/}
            {/*    value={book.connectWay}*/}
            {/*/>book*/}

            <ToastContainer/>
            <FullScreenLoading dim={true} show={fullScreenLoading || getBookResults.loading}/>
            {/*    <Dimmer show={getBookResults.loading} onClose={() => {*/}


            {/*}}/>*/}

            {/*{getBookResults.loading ?*/}
            {/*    // <div className={'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}> </div>*/}
            {/*    <LoadingDialog*/}
            {/*        color={'#3498db'}*/}
            {/*        wrapperClassName={'m-auto  w-20 h-20 bg-white rounded-xl fixed  top-1/2  -translate-y-1/2 z-50'}/>*/}
            {/*    :*/}
            {/*    null*/}
            {/*}*/}


            <div
                className={'absolute z-40 -top-1 w-full h-14 backdrop-blur  flex flex-row justify-between items-center'}
                style={{background: 'rgba(245,248,250,0.83)'}}>
                <div className={'px-1 mr-4'} onClick={() => {
                    router.push
                    (
                        '/library')

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
                book.attachments && book.attachments.length ?
                    <ImageSlider images={book.attachments}/>
                    :
                    <div className={'w-full   flex flex-row mt-10 justify-center items-center'}>
                        <div className={'relative h-40 w-28 border-2 rounded-xl mt-10 py-2'}>

                            <NoPic/>
                            {/*<img src={"/assets/image/noImageBook.png"}*/}
                            {/*     className={`h-44 w-32 ${true ? 'h-44 w-32' : 'h-40 w-28'} overflow-hidden  rounded-xl mx-2  snap-center`}*/}

                            {/*     style={{flex: '0 0 auto'}}/>*/}

                            {/*<span>{index}</span>*/}
                        </div>
                    </div>


            }
            <div className={'px-3 pt-3 '}>



                <span
                    className={'text-textDark IranSansMedium mx-auto block text-sm text-center mt-4'}>{book.writer ?? "نویسنده مشخص نشده"}</span>
                <span
                    className={'text-black IranSansBold mx-auto block text-center mt-3'}>{book.title ?? '-'}</span>


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
                                UNIMUN_PROVIDERS().includes(book.creator.id) ?
                                    <div className={'mt-1 w-16'}>
                                        <Unimun/>

                                    </div>
                                    :
                                    <span
                                        className={'text-textBlack IranSansMedium text-sm mt-1 '}>{book.creator ? book.creator.name : ''}</span>
                                :
                                null


                        }
                    </div>
                </div>

                <div
                    className={`w-full px-4 IranSansMedium pt-3 ${bookDetails ? ' pb-20' : 'pb-1'} transition-all text-sm rounded-2xl overflow-hidden bg-white relative  flex flex-col justify-start items-start mt-4`}>
                    <div className={'flex flex-row'}>

                    </div>

                    {
                        isBook ?
                            <div className={'mt-2'}>
                                <span
                                    className={'text-textDark IranSansMedium text-sm inline-block'}> وضعیت ظاهری:</span>

                                <span
                                    className={'text-black IranSansMedium text-sm inline-block mr-2 '}>{book.appearance ? book.appearance.title : '-'}</span>
                            </div>
                            :
                            <div className={'mt-2'}>
                                <span
                                    className={'text-textDark IranSansMedium text-sm inline-block'}>نام استاد:</span>

                                <span
                                    className={'text-black IranSansMedium text-sm inline-block mr-2 '}>{book.teacher ? book.teacher : '-'}</span>
                            </div>

                    }


                    {
                        isBook ?
                            <div className={'mt-2'}>
                                <span className={'text-textDark IranSansMedium text-sm inline-block'}> ناشر:</span>

                                <span
                                    className={'text-black IranSansMedium text-sm inline-block mr-2 '}>{book.publisher ?? '-'}</span>
                            </div>
                            :
                            <div className={'mt-2'}>
                                <span className={'text-textDark IranSansMedium text-sm inline-block'}>  دانشگاه ارائه درس:</span>

                                <span
                                    className={'text-black IranSansMedium text-sm inline-block mr-2 '}>{book.university ?? '-'}</span>
                            </div>
                    }


                    {
                        isBook ?
                            <div className={'mt-2'}>
                                <span
                                    className={'text-textDark IranSansMedium text-sm inline-block'}> سال انتشار:</span>

                                <span
                                    className={'text-black IranSansMedium text-sm inline-block mr-2 '}>{book.publishedDate ?? '-'}</span>
                            </div>
                            :
                            <div className={'mt-2'}>
                                <span className={'text-textDark IranSansMedium text-sm inline-block'}> ترم - سال ارائه درس:</span>

                                <span
                                    className={'text-black IranSansMedium text-sm inline-block mr-2 '}>{book.term ?? '-'}</span>
                            </div>
                    }


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
                                        <span className={'block ml-1'}>{fixPrice(parseInt(book.price))}</span>
                                        <div className={'h-5 w-5 '}><Toman/></div>
                                    </div>
                                    :
                                    <div className={'flex flex-row justify-center items-start'}>
                                        <div className={'w-9'}>
                                            <Free/>

                                        </div>
                                    </div>
                            }


                        </div>
                        <div
                            className={'fixed bottom-2 flex flex-col justify-center items-center w-full left-1/2 -translate-x-1/2 px-2'}>


                            <Button id={'buy-book'} className={'w-full h-12 bg-primary rounded-xl  bottom-0 '}
                                    rippleColor={'rgba(255,255,255,0.4)'}
                                    onClick={() => {
                                        if (!btnLoading)
                                            buyBookFromUnimun()

                                    }}

                            >

                                {
                                    btnLoading ?
                                        <div
                                            className={'w-full h-full flex flex-row justify-center items-center'}>
                                            <TailSpin width={30} color={'white'}/>

                                        </div>

                                        :
                                        book.isDownloadable ?
                                            <div
                                                className={'w-full h-full flex flex-row justify-between items-center'}>
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
                                            <div
                                                className={'w-full h-full flex flex-row justify-center items-center'}>
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
    )
        ;
};

export default Book;