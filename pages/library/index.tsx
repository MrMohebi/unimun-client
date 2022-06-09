import React, {useEffect, useRef, useState} from 'react';
import Search from "../../components/normal/Search/Search";
import Add from '../../assets/svgs/add.svg'
import Button from "../../components/view/Button/Button";
import {useRouter} from "next/router";
import {lastBookSubmitSuccess} from "../../store/books";
import Toast from "../../components/normal/Toast/Toast";
import {gql, useLazyQuery} from "@apollo/client";
import ThousandTomans from "../../assets/svgs/thousandTomans.svg";
import SVGModifier from "../../components/common/SVGModifier/SVGModifier";
import GalleryImageSVG from "../../assets/svgs/galleryImage.svg";
import DownloadOutline from "../../assets/svgs/downloadOutline.svg";
import SkeletonElement from "../../components/view/Skeleton/Skeleton";
import {lastGottenBooks} from "../../store/books";
import InfiniteScroll from "react-infinite-scroll-component";
import _ from 'lodash';
import LoadingDialog from "../../components/view/LoadingDialog/LoadingDialog";
import {UserToken} from "../../store/user";

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


    const getBooksQuery = gql`
        query getBooks($first:Int $searchText:String $after:String){
            books(first: $first,searchText: $searchText,after: $after){
                edges {
                    cursor
                    node {
                        title
                        writer
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

        if (lastGottenBooks().length) {
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

    const searchDeb = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {

        getBooks({
            variables: {
                searchText: e.target.value,
                first: 20,
                after: ''
            }
        }).then((result) => {
            console.log(result)

            try {

                let Books = [] as object[]
                result.data.books.edges.forEach((book: { node: any }) => {
                    Books.push(book.node)
                })
                _books(Books as never[])


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

    }, 1000)


    const getNewBooks = () => {
        if (hasMore)
            getBooks({
                variables: {
                    searchText: '',
                    first: 10,
                    after: books.length ? books[books.length - 1]['cursor'] : ''
                }
            }).then((result) => {
                    console.log(result)

                    try {
                        let Books = [] as object[]
                        result.data.books.edges.forEach((book: { node: any }) => {
                            Books.push(book.node)
                        })
                        //get last element of books
                        let lastBook = books[books.length - 1]
                        if ((lastBook as {
                            cursor: string
                        }).cursor === (Books[Books.length - 1] as {
                            cursor: string
                        })['cursor']) {
                            _hasMore(false)
                        } else
                            _books(books.concat(Books as never[]))
                    } catch (e) {
                        Toast('خطا هنگام دریافت کتاب ها')
                    }
                }
            )
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
            <Search lib={true} onInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.replace(/ /g, '') === '') {
                    _searchLoading(false)
                    _books(lastGottenBooks())
                    _nothingFound(true)
                } else {
                    _searchLoading(true)

                }
                searchDeb(e)

            }} collapse={scrollingToBottom} searchLoading={searchLoading}/>


            {/*<div className={'h-32'}/>*/}


            <div className={'h-full overflow-scroll pb-32 pt-32'} onScroll={onAdSectionScroll}
                 id={'scroller-library'}>
                {
                    nothingFound ?
                        <div className={'w-full flex flex-col items-center justify-center mt-44'}>
                            <span className={'IranSansMedium opacity-50'}>نتیجه ای یافت نشد</span>
                        </div> :

                        <InfiniteScroll
                            pullDownToRefresh={!refreshLoading && !getBooksResult.loading}
                            releaseToRefreshContent={<div
                                className={'h-12 pb-4  w-full text-center IranSansMedium text-sm flex flex-col items-center justify-center'}>
                                رها کنید
                            </div>}
                            pullDownToRefreshContent={<div
                                className={'h-12 pb-4  w-full text-center IranSansMedium text-sm flex flex-col items-center justify-center'}>
                                بکشید
                            </div>}
                            pullDownToRefreshThreshold={70}
                            refreshFunction={() => {
                                if (!getBooksResult.loading)
                                    _refreshLoading(true)
                                getBooksResult.refetch().then(() => {
                                    _refreshLoading(false)
                                })
                            }}
                            next={() => {
                                console.log('getting new')
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
                                    className={`${(refreshLoading || getBooksResult.loading) ? 'pt-3' : 'h-0 overflow-hidden '}  duration-100 eas-in-out w-full text-center IranSansMedium text-sm h-8 flex flex-row items-center justify-center `}>
                                    دریافت کتاب ها
                                    <LoadingDialog wrapperClassName={'w-4 h-4 mr-2'} strokeWidth={4}/>
                                </div>
                            }

                            {
                                books.map((book: {
                                    title: string
                                    category: { title: string }
                                    appearance: {
                                        title: string
                                        writer: string
                                    }
                                    publisher: string
                                    isDownloadable: boolean
                                    attachments: [{ preview: string }]
                                    price: number
                                    id: string
                                }, index) => {

                                    return (
                                        <div key={'book' + index}
                                             onClick={() => {
                                                 // console.log(book.id)
                                                 router.push('/library/book/' + book.id)
                                             }}
                                             className={'bg-white h-44 mt-4 grid grid-cols-2 w-full max-w-xl  rounded-2xl relative'}>

                                            <div
                                                className={'col-span-1 flex flex-col justify-start h-full items-start p-3'}>
                                                <span className={'IranSansBold '}
                                                      style={{fontSize: '0.95rem'}}>{book.title}</span>

                                                <div
                                                    className={'flex flex-col justify-between mt-2 h-full items-start'}>

                                                    <div
                                                        className={'IranSansMedium text-sm  whitespace-nowrap'}><span
                                                        className={'text-textDark'}>نویسنده:</span> {book.appearance.writer ?? '-'}
                                                    </div>

                                                    <div
                                                        className={'IranSansMedium text-sm  whitespace-nowrap'}><span
                                                        className={'text-textDark'}>دسته بندی: </span> {book.category ? book.category.title : '-'}
                                                    </div>
                                                    <div
                                                        className={'IranSansMedium text-sm  whitespace-nowrap'}><span
                                                        className={'text-textDark'}>وضعیت ظاهری:</span> {book.appearance.title}
                                                    </div>
                                                    <div
                                                        className={'IranSansMedium text-sm  whitespace-nowrap'}><span
                                                        className={'text-textDark'}>اراعه دهنده:</span> {book.publisher ?? '-'}
                                                    </div>


                                                </div>


                                            </div>
                                            <div
                                                className={'col-span-1 p-3 flex flex-row-reverse justify-between items-center'}>


                                                <div className={' w-28 relative '}
                                                     style={{
                                                         minWidth: '7rem',
                                                         height: '9.5rem'
                                                     }}>

                                                    {book.isDownloadable ?
                                                        <div
                                                            className={'  w-11/12   flex flex-row h-7 justify-between items-center absolute  left-1/2 -translate-x-1/2 py-1 rounded-lg px-2 '}
                                                            style={{
                                                                bottom: '0.4rem',
                                                                background: 'rgba(83,82,85,0.61)'
                                                            }}>

                                                            <div dir={'ltr'} className={'IranSans w-3 h-3 '}>
                                                                <DownloadOutline/>
                                                            </div>
                                                            <span
                                                                className={'text-white whitespace-nowrap text-tiny IranSans'}>قـابـل دانـلـود</span>
                                                            <div dir={'ltr'}
                                                                 className={'IranSans w-1 h-3 opacity-0 '}>
                                                                <DownloadOutline/>
                                                            </div>
                                                        </div>
                                                        :
                                                        null
                                                    }


                                                    <img
                                                        src={book.attachments ? book.attachments[0].preview : '/assets/image/noBookImage.png'}
                                                        alt={book.title} className={'h-full w-32 rounded-xl'}/>


                                                    <div dir={'ltr'}
                                                         className={'absolute left-2 top-2 p-2  rounded-xl p-1 '}
                                                         style={{
                                                             background: 'rgba(83,82,85,0.61)'
                                                         }}>
                                                        {
                                                            book.attachments ?
                                                                <div className={'invert'}>
                                                                    <SVGModifier SVGName={'galleryImage'}
                                                                                 elementClass={'number'}
                                                                                 value={book.attachments.length.toString()}>
                                                                        <GalleryImageSVG/>
                                                                    </SVGModifier>
                                                                </div>

                                                                : null
                                                        }
                                                    </div>
                                                </div>

                                                <div
                                                    className={'flex flex-col ml-3 translate-y-2.5 h-full justify-end  IranSansMedium'}>
                                                    <div className={'flex-row flex'}>
                                                          <span className={'mx-1 pb-2 '}>
                                        {book.price ? book.price / 1000 : ""}
                                        </span>
                                                        <ThousandTomans/>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    )
                                })
                            }

                            {
                                getBooksResult.loading ?
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
                className={`fixed right-7 bottom-40 flex flex-col items-start justify-center transition-all z-50 ${newBookButtonOpened ? "opacity-100 scale-100 -translate-y-0" : "translate-y-full opacity-0 scale-50 pointer-events-none"}`}>
                <Button onClick={() => {
                    if (UserToken())
                        router.push('library/newBook')
                    else
                        router.push('profile/login')

                }} id={'new-book-option'} rippleColor={'rgba(0,0,0,0.24)'}
                        className={`h-14 bg-white rounded-2xl flex flex-col justify-center items-center px-5 IranSansMedium delay-75 transition-all ease-in-out duration-200 ${newBookButtonOpened ? "opacity-100 scale-100 -translate-y-0" : "translate-y-full opacity-0 scale-50 pointer-events-none"}`}>
                    افزودن کتاب
                </Button>
                <Button id={'new-note-option'} rippleColor={'rgba(0,0,0,0.24)'} onClick={() => {
                    // isBrochure(true)
                    if (UserToken())
                        router.push('library/newBrochure')
                    else
                        router.push('profile/login')

                }}
                        className={`h-14 mt-4 bg-white rounded-2xl flex flex-col justify-center items-center px-5 IranSansMedium transition-all  ease-in-out duration-200 ${newBookButtonOpened ? "opacity-100 scale-100 -translate-y-0" : "translate-y-full opacity-0 scale-50 pointer-events-none"}`}>
                    افزودن جزوه
                </Button>

            </div>


        </div>
    );
};

export default Index;