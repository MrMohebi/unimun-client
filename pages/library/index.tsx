import React, {useEffect, useRef, useState} from 'react';
import Search from "../../components/normal/Search/Search";
import Add from '../../assets/svgs/add.svg'
import Button from "../../components/view/Button/Button";
import {useRouter} from "next/router";
import {
    BookDataStore,
    BooksEndCursor,
    EditBookData,
    EmptyBook,
    LastBooksScrollPosition,
    lastBookSubmitSuccess, lastBrochureSubmitSuccess
} from "../../store/books";
import Toast from "../../components/normal/Toast/Toast";
import {gql, useLazyQuery, useQuery, useReactiveVar} from "@apollo/client";
import ThousandTomans from "../../assets/svgs/thousandTomans.svg";
import SVGModifier from "../../components/common/SVGModifier/SVGModifier";
import GalleryImageSVG from "../../assets/svgs/galleryImageW.svg";
import DownloadOutline from "../../assets/svgs/downloadOutline.svg";
import SkeletonElement from "../../components/view/Skeleton/Skeleton";
import {BooksStore} from "../../store/books";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingDialog from "../../components/view/LoadingDialog/LoadingDialog";
import Unimun from '../../assets/svgs/unimun.svg'
import {UserToken} from "../../store/user";
import NoPic from "../../components/normal/NoPic/NoPic";
import Free from '../../assets/svgs/free.svg'
import {UNIMUN_PROVIDERS} from "../../store/GLOBAL_VARIABLES";
import {currentNavActiveIndex} from "../../store/navbar";
import {EndCursor} from "../../store/appeals";
import {useDebouncedCallback} from "use-debounce";
import {ToastContainer} from "react-toastify";

const Index = () => {

    const router = useRouter();
    const [newBookButtonOpened, SnewBookButtonOpened] = useState(false);
    const [books, _books] = useState([]);
    const [scrollingToBottom, _scrollingToBottom] = useState(false);
    const lastScrollPosition = useRef(0);
    const [hasMore, _hasMore] = useState(true);
    const [searchLoading, _searchLoading] = useState(false);
    const [nothingFound, _nothingFound] = useState(false);
    const [refreshLoading, _refreshLoading] = useState(false)
    const reactiveBooks = useReactiveVar(BooksStore)
    const [searchedBooks, setSearchedBooks] = useState([] as any);
    const getBooksQuery = gql`
        query getBooks($first:Int $searchText:String $after:String){
            books(first: $first,searchText: $searchText,after: $after){
                pageInfo {
                    endCursor
                    hasNextPage
                }
                edges {
                    cursor
                    node {
                        title
                        writer
                        status
                        teacher
                        term
                        isLiked
                        likes
                        university
                        creator {
                            name
                            id
                        }
                        id
                        details
                        publisher
                        isBook
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
                            preview
                        }
                        bookFiles {
                            url
                        }
                    }
                }
            }
        }

    `;


    const getBooks = useQuery(getBooksQuery);
    const [searchBooks] = useLazyQuery(getBooksQuery);


    useEffect(() => {
        if (getBooks.data) {
            try {
                if (getBooks.data.books.edges) {

                    let Books = [] as object[]
                    getBooks.data.books.edges.forEach((book: { node: any }) => {
                        Books.push(book.node)
                    })
                    _books(Books as never[])
                    BooksStore(Books as object[])
                    BooksEndCursor(getBooks.data.books.pageInfo.endCursor)
                }
                if (!getBooks.data.books.pageInfo.hasNextPage)
                    _hasMore(false)

            } catch (e) {
                console.log(e)
            }

        }
    }, [getBooks.data]);

    useEffect(() => {


        if (lastBookSubmitSuccess().length) {
            // console.log('thee should be an alert for new book')
            Toast('کتاب شما ثبت شد و  در انتظار بررسی است')
            lastBookSubmitSuccess('')
        }

        if (lastBrochureSubmitSuccess().length) {
            // console.log('thee should be an alert for new book')
            Toast('جزوه شما ثبت شد و  در انتظار بررسی است')
            lastBookSubmitSuccess('')
        }


        currentNavActiveIndex(1)


    }, [])

    const bookSkeleton = (count: number) => {
        return (
            Array(count).fill('').map((skeleton, index) => {
                return (
                    <div key={index + `appealSkeleton`}
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
        LastBooksScrollPosition(event.currentTarget.scrollTop)
        try {
            let scroll = event.target.scrollTop

            if (scroll > lastScrollPosition.current) {
                _scrollingToBottom(true)
            } else {
                _scrollingToBottom(false)

            }
            lastScrollPosition.current = scroll;
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        if (booksDivRef.current)
            booksDivRef.current.scrollTo(0, LastBooksScrollPosition())
    }, []);

    // const searchDeb = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    //
    //     getBooks({
    //         variables: {
    //             searchText: e.target.value,
    //             first: 20,
    //             after: ''
    //         }
    //     }).then((result) => {
    //         console.log(result)
    //
    //         try {
    //
    //             let Books = [] as object[]
    //             result.data.books.edges.forEach((book: { node: any }) => {
    //                 Books.push(book.node)
    //             })
    //             _books(Books as never[])
    //
    //
    //             if (result.data.books.edges.length === 0) {
    //                 _nothingFound(true)
    //             } else {
    //                 _nothingFound(false)
    //             }
    //
    //
    //         } catch (e) {
    //             Toast('خطا هنگام دریافت کتاب ها')
    //         }
    //
    //         _searchLoading(false)
    //     })
    //
    // }, 1000)


    const getNewBooks = () => {
        if (hasMore) {

            getBooks.refetch({
                searchText: '',
                first: 100,
                after: EndCursor()
            })
            // getBooks({
            //     variables: {
            //         searchText: '',
            //         first: 10,
            //         after: books.length ? books[books.length - 1]['cursor'] : ''
            //     }
            // }).then((result) => {
            //         console.log(result)
            //
            //         try {
            //             let Books = [] as object[]
            //             result.data.books.edges.forEach((book: { node: any }) => {
            //                 Books.push(book.node)
            //             })
            //             //get last element of books
            //             let lastBook = books[books.length - 1]
            //             if ((lastBook as {
            //                 cursor: string
            //             }).cursor === (Books[Books.length - 1] as {
            //                 cursor: string
            //             })['cursor']) {
            //                 _hasMore(false)
            //             } else
            //                 _books(books.concat(Books as never[]))
            //         } catch (e) {
            //             Toast('خطا هنگام دریافت کتاب ها')
            //         }
            //     }
            // )
        }

    }

    const searchDeb = useDebouncedCallback((e) => {

        searchBooks({
            variables: {
                searchText: e.target.value,
                first: 20,
                after: ''
            }
        }).then((result: any) => {
            try {

                let Books = [] as object[]
                result.data.books.edges.forEach((book: { node: any }) => {
                    Books.push(book.node)
                })
                setSearchedBooks(Books as never[])

                if (result.data.books.edges.length === 0) {
                    _nothingFound(true)
                } else {
                    _nothingFound(false)
                }


            } catch (e) {
                Toast('خطا هنگام دریافت کتاب ها')
            }

            _searchLoading(false)
        })

    }, 600)
    const booksDivRef = useRef<HTMLDivElement>(null);
    return (
        <div className={'h-full relative '}>
            <ToastContainer/>
            <div id={'dimmer'}
                 onClick={(e) => {
                     let el = e.target as HTMLDialogElement
                     if (el.id === 'dimmer') {
                         SnewBookButtonOpened(false)
                     }
                 }}
                 className={`dimmer transition-all fixed w-full h-full bg-black ${newBookButtonOpened ? ' opacity-30' : 'opacity-0 pointer-events-none'} z-50`}></div>
            <Search lib={true} onInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.replace(/ /g, '') === '') {
                    _searchLoading(false)
                    _nothingFound(false)
                    setSearchedBooks([])
                } else {
                    _searchLoading(true)
                    searchDeb(e)
                }

            }} collapse={scrollingToBottom} searchLoading={searchLoading}/>


            {/*<div className={'h-32'}/>*/}


            <div className={'h-full overflow-scroll pb-32 pt-32'} onScroll={onAdSectionScroll}
                 id={'scroller-library'} ref={booksDivRef}>
                {
                    nothingFound ?
                        <div className={'w-full flex flex-col items-center justify-center mt-44'}>
                            <span className={'IranSansMedium opacity-50'}>نتیجه ای یافت نشد</span>
                        </div> :

                        <InfiniteScroll
                            pullDownToRefresh={!refreshLoading && !getBooks.loading}
                            releaseToRefreshContent={<div
                                className={'h-12 pb-4  w-full text-center IranSansMedium text-sm flex flex-col items-center justify-center'}>
                                رها کنید
                            </div>}
                            pullDownToRefreshContent={
                                <div
                                    className={'h-12 pb-4  w-full text-center IranSansMedium text-sm flex flex-col items-center justify-center'}>
                                    {/*بکشید*/}
                                </div>
                            }
                            pullDownToRefreshThreshold={70}
                            refreshFunction={() => {
                                if (!getBooks.loading)
                                    _refreshLoading(true)
                                getBooks.refetch().then((result) => {

                                    try {
                                        let Books = [] as object[]
                                        result.data.books.edges.forEach((book: { node: any }) => {
                                            Books.push(book.node)
                                        })
                                        _hasMore(true)
                                        _books(Books as never[])
                                    } catch (e) {
                                        Toast('خطا هنگام دریافت کتاب ها')
                                    }


                                    _refreshLoading(false)
                                })
                            }}
                            next={() => {
                                getNewBooks()
                            }}
                            hasMore={hasMore}
                            dataLength={books.length}
                            loader={
                                hasMore ?
                                    bookSkeleton(1)
                                    :
                                    null
                            }
                            scrollableTarget={'scroller-library'}
                            className={' px-3 book-scroller'}>
                            {

                                <div
                                    className={`${(refreshLoading || getBooks.loading) ? 'pt-3 h-8' : 'h-0 overflow-hidden '}  duration-100 eas-in-out w-full text-center IranSansMedium text-sm  flex flex-row items-center justify-center `}>
                                    دریافت کتاب ها
                                    <LoadingDialog wrapperClassName={'w-4 h-4 mr-2'} strokeWidth={4}/>
                                </div>
                            }

                            {
                                (searchedBooks.length ? searchedBooks : reactiveBooks).map((book: {
                                    title: string
                                    category: { title: string }
                                    appearance: {
                                        title: string
                                        writer: string
                                    }
                                    isBook: boolean
                                    status: string
                                    publisher: string
                                    isDownloadable: boolean
                                    attachments: [{ preview: string }]
                                    price: number
                                    writer: string
                                    isLiked: string
                                    likes: number
                                    id: string
                                    term: string
                                    teacher: string
                                    creator: { name: string, id: string }
                                }, index: number) => {

                                    if (book.status === 'DELETED')
                                        return null
                                    else
                                        return (
                                            <div key={'book' + index}
                                                 onClick={() => {
                                                     // console.log(book.id)
                                                     router.push('/library/book/' + book.id)
                                                 }}
                                                 className={'bg-white h-44 mt-4 grid grid-cols-3 w-full max-w-xl mx-auto rounded-2xl relative overflow-hidden'}>

                                                <div
                                                    className={'col-span-2 flex flex-col justify-start h-full items-start p-3'}>
                                                <span className={'IranSansBold '}
                                                      style={{fontSize: '0.95rem'}}>{book.isBook ? " کتاب " : " جزوه "}{book.title}</span>

                                                    <div
                                                        className={'flex flex-col justify-between mt-2 h-full items-start'}>

                                                        {
                                                            book.isBook ?
                                                                <div
                                                                    className={'IranSansMedium text-sm  whitespace-nowrap'}><span
                                                                    className={'text-textDark'}>نویسنده:</span> {book.writer ? book.writer ?? "-" : '-'}
                                                                </div>
                                                                :
                                                                <div
                                                                    className={'IranSansMedium text-sm  whitespace-nowrap'}><span
                                                                    className={'text-textDark'}>استاد:</span> {book.teacher ? book.teacher ?? "-" : '-'}
                                                                </div>
                                                        }


                                                        <div
                                                            className={'IranSansMedium text-sm  whitespace-nowrap'}><span
                                                            className={'text-textDark'}>دسته بندی: </span> {book.category ? book.category.title : '-'}
                                                        </div>

                                                        {
                                                            book.isBook ?
                                                                <div style={{}}
                                                                     className={'IranSansMedium flex flex-row items-center text-sm  whitespace-nowrap'}>
                                                            <span
                                                                className={'text-textDark'}>
                                                                وضعیت ظاهری:</span>
                                                                    <span
                                                                        className={'overflow-hidden text-ellipsis  inline-block mr-1'}>
                                                                                                                            {book.appearance ? book.appearance.title ?? "-" : "-"}

                                                            </span>
                                                                </div>
                                                                :
                                                                <div style={{}}
                                                                     className={'IranSansMedium flex flex-row items-center text-sm  whitespace-nowrap'}>
                                                            <span
                                                                className={'text-textDark'}>
                                                                وضعیت ظاهری:</span>
                                                                    <span
                                                                        className={'overflow-hidden text-ellipsis  inline-block mr-1'}>
                                                                                                                            {book.term ? book.term ?? "-" : "-"}

                                                            </span>
                                                                </div>
                                                        }


                                                        <div
                                                            className={'IranSansMedium text-sm  whitespace-nowrap flex flex-row justify-center items-center'}>
                                                            <span
                                                                className={'text-textDark ml-1'}>ارائه دهنده:</span> {book.creator ? UNIMUN_PROVIDERS().includes(book.creator.id) ?
                                                            <div className={' w-14  inline-block'}>
                                                                <Unimun/>
                                                            </div>
                                                            :
                                                            book.creator.name : '-' ?? '-'}
                                                        </div>


                                                    </div>


                                                </div>
                                                <div
                                                    className={'col-span-1 p-3 flex flex-row-reverse justify-between items-center'}>


                                                    <div className={'w-28 relative z-10 '}
                                                         style={{
                                                             minWidth: '7rem',
                                                             height: '9.5rem',
                                                             boxShadow: "rgb(255 255 255) -8px 15px 9px 20px"

                                                         }}>


                                                        {book.isDownloadable ?

                                                            book.likes ?
                                                                <div
                                                                    className={'absolute h-7 left-1/2 -translate-x-1/2 flex flex-row justify-between items-center bottom-0 px-1 w-full'}>
                                                                    <div
                                                                        className={'w-7 flex flex-row h-7 justify-between items-center    py-1 rounded-lg px-2 '}
                                                                        style={{
                                                                            bottom: '0.4rem',
                                                                            background: 'rgba(83,82,85,0.61)'
                                                                        }}>

                                                                        <div dir={'ltr'}
                                                                             className={'IranSans w-full flex flex-col justify-center items-center h-full  '}>
                                                                            <DownloadOutline/>
                                                                        </div>
                                                                        {/*<span*/}
                                                                        {/*    className={'text-white whitespace-nowrap text-tiny IranSans'}>قـابـل دانـلـود</span>*/}

                                                                    </div>
                                                                    <div
                                                                        className={'w-12 flex flex-row h-7 justify-between items-center  py-1 rounded-lg px-2 '}
                                                                        style={{
                                                                            bottom: '0.4rem',
                                                                            background: 'rgba(83,82,85,0.61)'
                                                                        }}>

                                                                        <span
                                                                            className={'text-white IranSans text-sm'}>{book.likes}</span>
                                                                        <img
                                                                            src={`/assets/svgs/${book.isLiked ? 'filled-heart' : 'heart'}.svg`}
                                                                            className={'h-4 w-4'} alt=""/>
                                                                        {/*<span*/}
                                                                        {/*    className={'text-white whitespace-nowrap text-tiny IranSans'}>قـابـل دانـلـود</span>*/}

                                                                    </div>

                                                                </div>

                                                                :
                                                                <div
                                                                    className={'gap-2 w-11/12 flex flex-row h-7 justify-start items-center absolute  left-1/2 -translate-x-1/2 py-1 rounded-lg px-1 '}
                                                                    style={{
                                                                        bottom: '0.4rem',
                                                                        background: 'rgba(83,82,85,0.61)'
                                                                    }}>

                                                                    <div dir={'ltr'}
                                                                         className={'IranSans w-5 flex flex-col justify-center items-center h-5  '}>
                                                                        <DownloadOutline/>
                                                                    </div>
                                                                    <span
                                                                        className={'text-white whitespace-nowrap text-tiny IranSans'}>قـابـل دانـلـود</span>

                                                                </div>
                                                            :
                                                            book.likes ?

                                                                <div
                                                                    className={'absolute h-7 left-1/2 -translate-x-1/2 flex flex-row justify-between items-center bottom-0 px-1 w-full'}>
                                                                    <div></div>
                                                                    {/*<div*/}
                                                                    {/*    className={'w-7 flex flex-row h-7 justify-between items-center    py-1 rounded-lg px-2 '}*/}
                                                                    {/*    style={{*/}
                                                                    {/*        bottom: '0.4rem',*/}
                                                                    {/*        background: 'rgba(83,82,85,0.61)'*/}
                                                                    {/*    }}>*/}

                                                                    {/*    /!*<div dir={'ltr'}*!/*/}
                                                                    {/*    /!*     className={'IranSans w-full flex flex-col justify-center items-center h-full  '}>*!/*/}
                                                                    {/*    /!*    <DownloadOutline/>*!/*/}
                                                                    {/*    /!*</div>*!/*/}
                                                                    {/*    /!*<span*!/*/}
                                                                    {/*    /!*    className={'text-white whitespace-nowrap text-tiny IranSans'}>قـابـل دانـلـود</span>*!/*/}

                                                                    {/*</div>*/}
                                                                    <div
                                                                        className={'w-12 flex flex-row h-7 justify-between items-center  py-1 rounded-lg px-2 '}
                                                                        style={{
                                                                            bottom: '0.4rem',
                                                                            background: 'rgba(83,82,85,0.61)'
                                                                        }}>

                                                                        <span
                                                                            className={'text-white IranSans text-sm'}>{book.likes}</span>
                                                                        <img
                                                                            src={`/assets/svgs/${book.isLiked ? 'filled-heart' : 'heart'}.svg`}
                                                                            className={'h-4 w-4'} alt=""/>
                                                                        {/*<span*/}
                                                                        {/*    className={'text-white whitespace-nowrap text-tiny IranSans'}>قـابـل دانـلـود</span>*/}

                                                                    </div>

                                                                </div>
                                                                :
                                                                null
                                                        }


                                                        {
                                                            book.attachments && book.attachments.length ?
                                                                <img
                                                                    src={`https://dl.unimun.me/${(book.attachments[0] as { url: string, preview: string }).preview}`}
                                                                    alt={book.title}
                                                                    className={'h-full w-32 rounded-xl'}/>
                                                                :
                                                                <div className={' rounded-xl h-full overflow-hidden'}>
                                                                    <NoPic/>
                                                                </div>
                                                        }
                                                        {/*<img*/}
                                                        {/*    src={book.attachments && book.attachments.length ? `https://dl.unimun.me/${(book.attachments[0] as { url: string, preview: string }).url}` : '/assets/image/noImageBook.png'}*/}
                                                        {/*    alt={book.title} className={'h-full w-32 rounded-xl'}/>*/}

                                                        {
                                                            book.attachments && book.attachments.length ?
                                                                <div dir={'ltr'}
                                                                     className={'absolute flex flex-col justify-center items-center left-2 top-2  w-8 h-8 pb-7 p-0.5 rounded-xl '}
                                                                     style={{
                                                                         background: 'rgba(83,82,85,0.61)'

                                                                     }}>


                                                                    <div className={' w-full  h-full p-0.5 '}>
                                                                        <SVGModifier SVGName={'galleryImageW'}
                                                                                     elementClass={'number'}
                                                                                     value={book.attachments.length.toString()}>
                                                                            <GalleryImageSVG/>
                                                                        </SVGModifier>
                                                                    </div>


                                                                </div>
                                                                :
                                                                null
                                                        }
                                                    </div>


                                                    <div

                                                        className={'flex flex-col z-10  ml-3 translate-y-2.5 h-full justify-end  IranSansMedium'}>
                                                        {
                                                            book.price && book.price.toString() !== 'free' ?
                                                                <div style={{
                                                                    boxShadow: "rgb(255 255 255) 4px 10px 11px 13px"
                                                                }} className={'flex-row flex bg-white'}

                                                                >
                                                          <span className={'mx-1 pb-2 '}>
                                                                {book.price / 1000}
                                                          </span>
                                                                    <ThousandTomans/>
                                                                </div>
                                                                :
                                                                <div
                                                                    style={{
                                                                        boxShadow: "rgb(255 255 255) 4px 10px 11px 13px"
                                                                    }}
                                                                    className={'pb-4 bg-white IranSansMedium text-sm'}>

                                                                    <div className={'w-9'}>
                                                                        <Free/>

                                                                    </div>
                                                                </div>

                                                        }


                                                    </div>

                                                </div>
                                            </div>
                                        )
                                })
                            }

                            {
                                getBooks.loading ?
                                    bookSkeleton(8)
                                    :
                                    null

                            }


                        </InfiniteScroll>
                }


            </div>


            <div className={'fixed flex flex-col justify-center items-center right-7 bottom-20 z-50'}>
                <Button rippleColor={'rgba(0,0,0,0.24)'} id={'new-book-btn'}
                        className={'w-14 h-14 bg-white shadow-sm rounded-2xl z-50'}
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
                className={`fixed right-7 bottom-40 flex flex-col items-start justify-center  transition-all z-50 duration-200 ${newBookButtonOpened ? "opacity-100 scale-100 -translate-y-0" : "translate-y-full opacity-0 scale-50 pointer-events-none"}`}>
                <Button id={'new-note-option'} rippleColor={'rgba(0,0,0,0.24)'} onClick={() => {
                    // isBrochure(true)
                    if (UserToken())
                        router.push('qr/scan')
                    else
                        router.push('profile/login')

                }}
                        className={`h-14 w-32 mb-4 bg-white rounded-2xl flex flex-col justify-center items-center px-5   IranSansMedium transition-all  ease-in-out duration-300 ${newBookButtonOpened ? "opacity-100 scale-100 -translate-y-0" : "translate-y-full opacity-0 scale-50 pointer-events-none"}`}>اسکن
                    بارکد</Button>
                <Button onClick={() => {
                    EditBookData({})
                    BookDataStore(EmptyBook());
                    if (UserToken())
                        router.push('library/newBook')
                    else
                        router.push('profile/login')

                }} id={'new-book-option'} rippleColor={'rgba(0,0,0,0.24)'}
                        className={`h-14 w-32 bg-white rounded-2xl flex flex-col justify-center items-center px-5 IranSansMedium  transition-all ease-in-out duration-200 ${newBookButtonOpened ? "opacity-100 scale-100 -translate-y-0" : "translate-y-full opacity-0 scale-50 pointer-events-none"}`}>
                    افزودن کتاب
                </Button>
                <Button id={'new-note-option'} rippleColor={'rgba(0,0,0,0.24)'} onClick={() => {
                    EditBookData({})
                    BookDataStore(EmptyBook());
                    // isBrochure(true)
                    if (UserToken())
                        router.push('library/newBrochure')
                    else
                        router.push('profile/login')

                }}
                        className={`h-14 w-32 mt-4 bg-white rounded-2xl flex flex-col justify-center items-center px-5 IranSansMedium transition-all  ease-in-out duration-75 ${newBookButtonOpened ? "opacity-100 scale-100 -translate-y-0" : "translate-y-full opacity-0 scale-50 pointer-events-none"}`}>
                    افزودن جزوه
                </Button>


            </div>


        </div>
    );
};

export default Index;