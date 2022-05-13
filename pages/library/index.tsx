import React, {useEffect, useRef, useState} from 'react';
import lottie from "lottie-web";
import Search from "../../components/normal/Search/Search";
import Add from '../../assets/svgs/add.svg'
import Button from "../../components/view/Button/Button";
import {useRouter} from "next/router";
import {isBrochure, lastBookSubmitSuccess} from "../../store/books";
import Toast from "../../components/normal/Toast/Toast";
import {gql, useLazyQuery} from "@apollo/client";
import {ToastContainer} from "react-toastify";
import ThousandTomans from "../../assets/svgs/thousandTomans.svg";
import SVGModifier from "../../components/common/SVGModifier/SVGModifier";
import GalleryImageSVG from "../../assets/svgs/galleryImage.svg";
import DownloadOutline from "../../assets/svgs/downloadOutline.svg";
import Unimun from "../../assets/svgs/unimun.svg";

const Index = () => {

    const router = useRouter();
    const lottieRef = useRef<HTMLDivElement>(null);
    const [newBookButtonOpened, SnewBookButtonOpened] = useState(false);
    const [books, _books] = useState([]);


    const getBooksQuery = gql`
        query getBooks($first:Int $searchText:String $after:String){
            books(first: $first,searchText: $searchText,after: $after){
                edges {
                    cursor
                    node {
                        title
                        id
                        details
                        price
                        category {
                            title
                        }
                        appearance {
                            title
                        }
                        writer
                        isDownloadable
                        attachments {
                            url
                        }
                        bookFiles {
                            url
                        }

                    }
                }
            }
        }
    `;


    const [getBooks, getBooksResult] = useLazyQuery(getBooksQuery);

    useEffect(() => {

        getBooks({
            variables: {
                after: books.length ? books[books.length - 1]['cursor'] : ''
            }
        }).then(e => {

            try {
                if (e.data.books.edges) {

                    let Books = [] as object[]
                    e.data.books.edges.forEach((book: { node: any }) => {
                        Books.push(book.node)

                    })
                    _books(Books as never[])
                }
            } catch (e) {
                console.log(e)
            }
        })


        if (lottieRef.current)
            lottie.loadAnimation({
                container: lottieRef.current,
                renderer: "svg",
                animationData: books,
                loop: true,
                autoplay: true
            })

        if (lastBookSubmitSuccess().length) {
            Toast('کتاب شما ثبت شد و  در انتظار بررسی است')
            lastBookSubmitSuccess('')
        }

    }, [])

    return (
        <div className={'w-full h-full '}>
            <ToastContainer/>
            <div id={'dimmer'}
                 onClick={(e) => {
                     let el = e.target as HTMLDialogElement
                     if (el.id === 'dimmer') {
                         SnewBookButtonOpened(false)
                     }
                 }}
                 className={`dimmer transition-all fixed w-full h-full bg-black ${newBookButtonOpened ? ' opacity-30' : 'opacity-0 pointer-events-none'} z-50`}></div>
            <Search lib={true} onInputChange={() => {

            }} collapse={false} searchLoading={false}/>

            <div className={'h-36'}/>
            <div className={'w-full flex flex-col items-center  px-3'}>
                {
                    books.map((book: {
                        title: string
                        category: { title: string }
                        appearance: { title: string }
                        isDownloadable: boolean
                        attachments: []
                        price: string
                        id: string
                    }, index) => {
                        console.log(book.id)


                        return (
                            <div key={'book' + index}
                                 onClick={() => {
                                     // console.log(book.id)
                                     router.push('/library/book/' + book.id)
                                 }}
                                 className={'bg-white h-44 mt-4 grid grid-cols-2 w-full max-w-xl shadow-sm rounded-2xl relative'}>
                                <div className={'absolute right-3 bottom-3  w-16'}>
                                    <Unimun/>
                                </div>
                                <div className={'col-span-1 flex flex-col justify-start items-start p-3'}>
                                    <span className={'IranSansMedium'}>{book.title}</span>
                                    <div className={'IranSansMedium text-sm mt-2 whitespace-nowrap'}><span
                                        className={'text-textDark'}>دسته بندی: </span> {book.category.title}</div>
                                    <div className={'IranSansMedium text-sm mt-2 whitespace-nowrap'}><span
                                        className={'text-textDark'}>وضعیت ظاهری:</span> {book.appearance.title}</div>
                                </div>
                                <div className={'col-span-1 p-3 flex flex-row-reverse justify-between items-end'}>


                                    <div className={'h-full w-28 relative '}
                                         style={{
                                             minWidth: '7rem'
                                         }}>

                                        {book.isDownloadable ?
                                            <div
                                                className={'  w-11/12 flex flex-row justify-between items-center absolute bottom-2  left-1/2 -translate-x-1/2 py-1 rounded-xl px-2 '}
                                                style={{
                                                    background: 'rgba(83,82,85,0.61)'
                                                }}>
                                                <div dir={'ltr'} className={'IranSans w-3 h-3 '}>
                                                    <DownloadOutline/>
                                                </div>
                                                <span
                                                    className={'text-white whitespace-nowrap text-tiny IranSans'}>قابل دانلود</span>
                                                <div dir={'ltr'} className={'IranSans w-3 h-3 opacity-0 '}>
                                                    <DownloadOutline/>
                                                </div>
                                            </div>
                                            :
                                            null
                                        }


                                        {/*@ts-ignore*/}
                                        <img src={book.attachments ? book.attachments[0].preview : '/assets/image/noBookImage.png'}
                                            alt={book.title} className={'h-full w-32 rounded-xl'}/>

                                        <div dir={'ltr'} className={'absolute left-2 top-2 p-2  rounded-xl p-1 '}
                                             style={{
                                                 background: 'rgba(83,82,85,0.61)'
                                             }}>
                                            {
                                                book.attachments ?
                                                    <div className={'invert'}>
                                                        <SVGModifier SVGName={'galleryImage'} elementClass={'number'}
                                                                     value={book.attachments.length.toString()}>
                                                            <GalleryImageSVG/>
                                                        </SVGModifier>
                                                    </div>

                                                    : null
                                            }
                                        </div>
                                    </div>

                                    <div className={'flex flex-row ml-3 IranSans '}>
                                        <span className={'mx-1'}>
                                        {book.price}
                                        </span>
                                        <ThousandTomans/>
                                    </div>

                                </div>
                            </div>
                        )
                    })
                }
                <div className={'h-32'}></div>

            </div>

            <div className={'fixed flex flex-col justify-center items-center right-7 bottom-20 z-50'}>
                <Button rippleColor={'rgba(0,0,0,0.24)'} id={'new-book-btn'}
                        className={'w-14 h-14 bg-white shadow-sm  rounded-2xl z-50'}
                        onClick={() => {
                            SnewBookButtonOpened(!newBookButtonOpened)
                        }}
                >
                    <div className={`p-4 ${newBookButtonOpened ? 'rotate-45' : 'rotate-0'} transition-all`}>
                        <Add/>
                    </div>
                </Button>
            </div>


            <div
                className={`fixed right-7 bottom-40 flex flex-col items-start justify-center transition-all z-50 ${newBookButtonOpened ? "opacity-100 scale-100 -translate-y-0" : "translate-y-full opacity-0 scale-50 pointer-events-none"}`}>
                <Button onClick={() => {
                    router.push('library/newBook')
                }} id={'new-book-option'} rippleColor={'rgba(0,0,0,0.24)'}
                        className={'h-14 bg-white rounded-2xl flex flex-col justify-center items-center px-3 IranSansMedium'}>
                    افزودن کتاب
                </Button>
                <Button id={'new-note-option'} rippleColor={'rgba(0,0,0,0.24)'} onClick={() => {
                    // isBrochure(true)
                    // router.push('library/newBook')

                }}
                        className={'h-14 mt-3 bg-white rounded-2xl flex flex-col justify-center items-center px-3 IranSansMedium'}>
                    افزودن جزوه
                </Button>


            </div>


        </div>
    );
};

export default Index;