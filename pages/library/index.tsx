import React, {useEffect, useRef, useState} from 'react';
import Search from "../../components/normal/Search/Search";
import Add from '../../assets/svgs/add.svg'
import Button from "../../components/view/Button/Button";
import {useRouter} from "next/router";
import {lastBookSubmitSuccess} from "../../store/books";
import Toast from "../../components/normal/Toast/Toast";
import {gql, useLazyQuery, useReactiveVar} from "@apollo/client";
import ThousandTomans from "../../assets/svgs/thousandTomans.svg";
import SVGModifier from "../../components/common/SVGModifier/SVGModifier";
import GalleryImageSVG from "../../assets/svgs/galleryImage.svg";
import DownloadOutline from "../../assets/svgs/downloadOutline.svg";
import Unimun from "../../assets/svgs/unimun.svg";
import SkeletonElement from "../../components/view/Skeleton/Skeleton";
import {lastGottenBooks} from "../../store/books";
import InfiniteScroll from "react-infinite-scroll-component";

const Index = () => {

    const router = useRouter();
    const lottieRef = useRef<HTMLDivElement>(null);
    const [newBookButtonOpened, SnewBookButtonOpened] = useState(false);
    const [books, _books] = useState([]);
    const [scrollingToBottom, _scrollingToBottom] = useState(false);
    const lastScrollPosition = useRef(0);
    const [hasMore,_hasMore] = useState(false);
    const lastGottenBooksState = useReactiveVar(lastGottenBooks)


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

        if (lastGottenBooks().length){
            _books(lastGottenBooks() as never[])

        }
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
                    lastGottenBooks(Books as never[])
                }
            } catch (e) {
                console.log(e)
            }
        })



        if (lastBookSubmitSuccess().length) {
            Toast('کتاب شما ثبت شد و  در انتظار بررسی است')
            lastBookSubmitSuccess('')
        }

    }, [])

    const bookSkeleton = (count: number) => {
        return (
            Array(count).fill('').map((skeleton, index) => {
                return (
                    <div key={index + 'appealSkeleton'}
                         className={'item w-full bg-white rounded-2xl h-44 flex flex-row justify-between overflow-hidden px-4 py-3 mt-4'}>

                        <div className={'item-left w-1/2 h-full items-start flex flex-col justify-between'}>
                            <div className={'flex-col flex text-right'}>
                                            <span
                                                className={'IranSansBold text-textBlack text-lg pt-1 whitespace-nowrap'}><SkeletonElement
                                                className={'w-32 mt-2 h-8'}/></span>
                                <span
                                    className={'IranSans text-textDarker mt-2 text-sm'}> <SkeletonElement
                                    className={'w-32 mt-2 h-3'}/> <SkeletonElement
                                    className={'w-32 mt-2 h-3'}/>  </span>
                            </div>
                            <SkeletonElement className={'w-32 mt-2 h-5'}/>
                        </div>

                        <div className={'item-right w-1/2 h-full items-end justify-between flex flex-col'}>
                            <div>
                                <div className={'w-10 h-10'}>
                                    {/*_________Note_________*/}
                                    {/*{Note}*/}
                                </div>
                            </div>
                            <div>
                                <div className={'w-auto h-16'}>
                                    {/*Instantaneous*/}

                                    {/*{Instantaneous}*/}
                                </div>
                            </div>
                            <div
                                className={' flex flex-row-reverse items-center justify-center whitespace-nowrap text-sm '}>
                                <SkeletonElement className={'w-32 mt-2 h-5'}/></div>
                        </div>
                    </div>
                )
            })


        )
    }

    const onAdSectionScroll = (event: any) => {
        try {
            let scroll = event.target.scrollTop

            if (scroll > lastScrollPosition.current) {
                _scrollingToBottom(true)
            }else{
                _scrollingToBottom(false)

            }
            lastScrollPosition.current = scroll;
        }
        catch (e){
            console.log(e)
        }
    }


    return (
        <div className={'h-full relative '}>
            <div id={'dimmer'}
                 onClick={(e) => {
                     let el = e.target as HTMLDialogElement
                     if (el.id === 'dimmer') {
                         SnewBookButtonOpened(false)
                     }
                 }}
                 className={`dimmer transition-all fixed w-full h-full bg-black ${newBookButtonOpened ? ' opacity-30' : 'opacity-0 pointer-events-none'} z-50`}></div>
            <Search lib={true} onInputChange={() => {

            }} collapse={scrollingToBottom} searchLoading={false}/>

            {/*<div className={'h-32'}/>*/}


            <div className={'h-full overflow-scroll pb-32 pt-32'} id={'scroller-library'}>

            <InfiniteScroll
                pullDownToRefresh={true}
                pullDownToRefreshContent={<h1 className={'h-20'}></h1>}
                pullDownToRefreshThreshold={90}
                refreshFunction={() => {
                    console.log('refresh')
                }}
                // onScroll={onAdSectionScroll}
                next={()=>{
                    console.log('getting neq')
                }}
                hasMore={true}
                dataLength={books.length}
                loader={
                    bookSkeleton(1)
                }
                scrollableTarget={'scroller-library'}
                className={'overflow-visible'}>
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
                        return (
                            <div key={'book' + index}
                                 onClick={() => {
                                     // console.log(book.id)
                                     router.push('/library/book/' + book.id)
                                 }}
                                 className={'bg-white h-44 mt-4 grid grid-cols-2 w-full max-w-xl  rounded-2xl relative'}>
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
                                                className={'  w-11/12   flex flex-row h-7 justify-between items-center absolute  left-1/2 -translate-x-1/2 py-1 rounded-lg px-2 '}
                                                style={{
                                                    bottom:'0.4rem',
                                                    background: 'rgba(83,82,85,0.61)'
                                                }}>

                                                <div dir={'ltr'} className={'IranSans w-3 h-3 '}>
                                                    <DownloadOutline/>
                                                </div>
                                                <span
                                                    className={'text-white whitespace-nowrap text-tiny IranSans'}>قـابـل دانـلـود</span>
                                                <div dir={'ltr'} className={'IranSans w-1 h-3 opacity-0 '}>
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

                                    <div className={'flex flex-row ml-3 IranSans'}>
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

                {/*{bookSkeleton(20)}*/}

            </InfiniteScroll>
            </div>


            <div className={'fixed flex flex-col justify-center items-center right-7 bottom-20 z-50'}>
                <Button rippleColor={'rgba(0,0,0,0.24)'} id={'new-book-btn'}
                        className={'w-14 h-14 bg-white shadow-sm  rounded-2xl z-50'}
                        onClick={() => {
                            SnewBookButtonOpened(!newBookButtonOpened)
                        }}
                >
                    <div className={`p-4 ${newBookButtonOpened ? '-rotate-45' : 'rotate-0'} transition-all`}>
                        <Add/>
                    </div>
                </Button>
            </div>


            <div
                className={`fixed right-7 bottom-40 flex flex-col items-start justify-center transition-all z-50 ${newBookButtonOpened ? "opacity-100 scale-100 -translate-y-0" : "translate-y-full opacity-0 scale-50 pointer-events-none"}`}>
                <Button onClick={() => {
                    router.push('library/newBook')
                }} id={'new-book-option'} rippleColor={'rgba(0,0,0,0.24)'}
                        className={`h-14 bg-white rounded-2xl flex flex-col justify-center items-center px-5 IranSansMedium delay-75 transition-all ease-in-out duration-200 ${newBookButtonOpened ? "opacity-100 scale-100 -translate-y-0" : "translate-y-full opacity-0 scale-50 pointer-events-none"}`}>
                    افزودن کتاب
                </Button>
                <Button id={'new-note-option'} rippleColor={'rgba(0,0,0,0.24)'} onClick={() => {
                    // isBrochure(true)
                    // router.push('library/newBook')

                }}
                        className={`h-14 mt-4 bg-white rounded-2xl flex flex-col justify-center items-center px-5 IranSansMedium transition-all  ease-in-out duration-200 ${newBookButtonOpened ? "opacity-100 scale-100 -translate-y-0" : "translate-y-full opacity-0 scale-50 pointer-events-none"}`}>
                    افزودن جزوه
                </Button>

            </div>


        </div>
    );
};

export default Index;