import React, {useEffect, useState} from 'react';
import Header from "../../components/common/Header/Header";
import Tab from "../../components/view/Tab/Tab";
import Edit from '../../assets/svgs/edit.svg'
import Delete from '../../assets/svgs/delete.svg'
import Seen from '../../assets/svgs/eye.svg'
import FreeSVG from '../../assets/svgs/free.svg'
import Toman from '../../assets/svgs/toman.svg'

import {gql, useMutation, useQuery} from "@apollo/client";
import {useRouter} from "next/router";
import {UserToken} from "../../store/user";
import InfiniteScroll from "react-infinite-scroll-component";
import Toast from "../../components/normal/Toast/Toast";
import {ToastContainer} from "react-toastify";
import FullScreenLoading from "../../components/normal/FullScreenLoading/FullScreenLoading";
import DropDown from "../../components/view/DropDown/DropDown";
import {EditBookData} from "../../store/books";
import produce from "immer";


const MyBooks = () => {

    const [currentActivePart, _currentActivePart] = useState(1)
    const [myBooks, _myBooks] = useState([])
    let [booksLength, _booksLength] = useState(0)
    const [myBrochures, _myBrochures] = useState([])
    const [loading, setLoading] = useState(false);
    const myBooksQuery = gql`

        query getMyBooks($first: Int, $after: String) {
            booksUserCreated(
                first:$first,
                after:$after
            )
            {
                edges{
                    node{
                        attachments {
                            url
                        }
                        teacher
                        language
                        status
                        isBook
                        category {
                            title
                        }
                        categoryID
                        price
                        seen
                        title
                        id
                        pages
                        isDownloadable
                        isPurchasable
                        verifiedAt
                        writer
                        term
                        publisher
                        bookFiles {
                            url
                            preview
                        }
                        university
                        appearanceID
                        appearance {
                            title
                        }
                        details
                        publishedDate
                        attachments {
                            mime
                            preview
                            thumbnail
                            type
                            uploadedAsFile
                            url
                        }
                        pages
                        seen
                        price
                        translator
                        connectWay
                        location {
                            lat
                            lon
                            text
                        }
                    }
                }
            }
        }
    `

    const removeBookQuery = gql`
        mutation removeBook($id:ID! $status:String){
            updateBook(id:$id, status:$status){
                data {
                    status
                }
            }
        }
    `


    const getMyBooks = useQuery(myBooksQuery, {
        variables: {
            variables: {
                first: 50,
                after: null
            }
        },
    })
    const [removeBook] = useMutation(removeBookQuery)

    const router = useRouter();
    useEffect(() => {


            if (UserToken()) {
                if (getMyBooks.data) {
                    try {

                        let MyBooks = getMyBooks.data.booksUserCreated.edges.map((item: any) => {
                                if (item.node.isBook) {
                                    return item.node
                                }
                            }
                        ).filter((item: any) => item);
                        let MyBrochures = getMyBooks.data.booksUserCreated.edges.map((item: any) => {
                                if (!item.node.isBook) {
                                    return item.node
                                }
                            }
                        ).filter((item: any) => item)


                        _myBooks(MyBooks);
                        _myBrochures(MyBrochures);
                        (getMyBooks.data.booksUserCreated.edges as []).forEach((item) => {

                            let book = (item as { node: any }).node as {
                                price: string
                                isBook: boolean
                                title: string
                                seen: string
                            }
                            if (book.isBook) {
                                _booksLength(booksLength++)
                            }
                        })


                    } catch
                        (e) {
                        Toast('خطا در هنگام دریافت کتاب ها')
                    }
                }


            } else {
                router.push('/profile/login')
            }
        }


        , [getMyBooks.data])
    return (
        <div className={'h-full pb-20 '}>

            <FullScreenLoading show={getMyBooks.loading || loading}/>
            <ToastContainer/>

            <Header noShadow={true} backOnClick={() => {
                router.push('/library')
            }} title={'کتاب های من'} back={true}>

            </Header>
            <div className={'h-10 w-full bg-white z-50'}>

                <Tab indicatorAtBottom={true} indicatorSizeDivider={2} activeIndex={currentActivePart}>
                    <div className={'w-20 text-center opacity-0'}></div>
                    <div
                        className={`w-20 text-center IranSansMedium ${currentActivePart === 1 ? "text-primary" : ""}`}
                        onClick={() => {
                            _currentActivePart(1)
                        }}>کتاب ها
                    </div>
                    <div
                        className={`w-20 text-center IranSansMedium ${currentActivePart === 2 ? "text-primary" : ""}`}
                        onClick={() => {
                            _currentActivePart(2)
                        }}>جزوه ها
                    </div>
                    <div className={'w-20 text-center opacity-0'}></div>
                </Tab>
            </div>

            <div className={'w-full h-full overflow-scroll pb-20 px-3'} id={'my-books-scroller'}>

                <InfiniteScroll pullDownToRefreshContent={<h1 className={'h-10'}></h1>}
                                releaseToRefreshContent={<div
                                    className={'h-10 w-full text-center IranSans text-sm '}>والا اینجا چیزی واسه
                                    رفرش
                                    نیست شما که از خودمونی :)</div>}
                                className={''}
                                pullDownToRefreshThreshold={90} refreshFunction={() => {
                    // console.log('rfreshing')
                }} pullDownToRefresh={true} scrollableTarget={'my-books-scroller'} next={() => {
                    // console.log('gettin new')

                }} hasMore={false} loader={<h1>loading</h1>} dataLength={5}>

                    {
                        currentActivePart === 1 && myBooks.length === 0 ?
                            <div className={'h-10 w-full IranSans text-center text-textDark mt-5 '}>هنوز کتابی اضافه
                                نکردی</div>
                            :
                            null
                    }

                    {
                        currentActivePart === 2 && myBrochures.length === 0 ?
                            <div className={'h-10 w-full IranSans text-center text-textDark mt-5 '}>هنوز جزوه ای
                                اضافه
                                نکردی</div>
                            :
                            null
                    }

                    {
                        (currentActivePart === 1 ? myBooks : myBrochures).map((item, index) => {

                            let book: {
                                id: string
                                price: string
                                isBook: boolean
                                title: string
                                seen: string
                                status: string
                                attachments: any[]
                            } = item;

                            return (
                                <div dir={'ltr'} key={'my-book' + index}
                                     className={'w-full h-36 rounded-2xl shadow-sm bg-white mt-3 grid grid-cols-4 grid-rows-3 px-3'}>
                                    <div
                                        className={'row-span-3 h-full col-span-1 h-full self-end flex flex-col items-center justify-center overflow-hidden'}>
                                        <img
                                            src={book.attachments && book.attachments.length ? `https://dl.unimun.me/${(book.attachments[0] as { url: string, preview: string }).url}` : '/assets/image/noImageBook.png'}
                                            alt=""/>
                                    </div>

                                    <div
                                        className={'flex flex-row-reverse justify-start items-center col-span-3 IranSansMedium'}>
                                        <span
                                            className={'block whitespace-nowrap w-20 text-right overflow-hidden text-ellipsis'}>{book.title}</span>
                                        <div
                                            className={`IranSansMedium ${book.status === "DELETED" ? "text-errorRed" : "text-primary"}  text-sm p-1 rounded-xl px-2 bg-background mr-3`}>{book.status === "PENDING_REVIEW" ? "در حال بررسی" : book.status === "PUBLISHED" ? "فعال" : book.status === "DELETED" ? "حذف شده" : book.status === "REJECTED" ? "تایید نشده" : ""}</div>
                                    </div>
                                    <span dir={'ltr'}
                                          className={'IranSansMedium text-sm col-span-1 text-textDark self-center flex flex-row justify-start ml-2 items-center '}><div
                                        className={'w-4 h-4 mr-1 '}><Seen/> </div>
                                        {book.seen ?? '0'}
                                        </span>
                                    <span
                                        className={'IranSansMedium  text-sm col-span-2 text-textDark self-center text-right'}> فروخته نشده </span>


                                    <div
                                        className={'IranSansMedium text-sm col-span-3 flex flex-row-reverse justify-start items-center  text-tiny'}>
                                        {/*<div*/}
                                        {/*    className={'h-8 w-8 text-center  bg-background rounded-lg p-1  IranSansMedium text-md tracking-tighter font-black whitespace-nowrap px-2'}>*/}
                                        {/*    . . .*/}

                                        {/*</div>*/}


                                        <DropDown className={'  text-center'}
                                                  dropDownContent={
                                                      <div
                                                          className={'h-8 w-8 text-center   bg-background rounded-lg p-1  IranSansMedium text-md tracking-tighter font-black whitespace-nowrap px-2'}>
                                                          . . .

                                                      </div>
                                                  }
                                                  containerClassName={'backdrop-blur-2xl shadow-lg p-3 rounded-lg overflow-hidden flex flex-col justify-center items-center'}
                                        >

                                            <div

                                                onClick={() => {
                                                    EditBookData(item)
                                                    // console.log(item)

                                                    router.push(book.isBook ? "/library/newBook" : "/library/newBrochure")
                                                }}
                                                style={{fontSize: '0.7rem'}}
                                                className={'h-10  text-center flex flex-row justify-end items-center  bg-background rounded-xl  px-2 mx-1 IranSansMedium '}>
                                                ویرایش
                                                <div className={'w-4 h-4 ml-2'}>
                                                    <Edit/>
                                                </div>
                                            </div>

                                            {
                                                book.status === "DELETED" ?
                                                    null
                                                    :
                                                    <div
                                                        onClick={() => {
                                                            setLoading(true)

                                                            removeBook({
                                                                variables: {
                                                                    id: book.id,
                                                                    status: 'DELETED'
                                                                }

                                                            }).then(() => {
                                                                setLoading(false)
                                                                // console.log(value);
                                                                _myBooks(produce(draft => {

                                                                    draft.forEach((item: { id: string, status: string }) => {
                                                                        if (item.id === book.id) {
                                                                            item.status = "DELETED"
                                                                        }
                                                                    })
                                                                    return draft;
                                                                }))

                                                            })
                                                        }}
                                                        style={{fontSize: '0.7rem'}}
                                                        className={'h-10 w-20 mt-2 text-errorRed text-center flex flex-row justify-end items-center   bg-background rounded-xl  px-2 mx-1 IranSansMedium  '}>
                                                        حذف
                                                        <div className={'w-4 h-4 ml-2'}>
                                                            <Delete/>
                                                        </div>
                                                    </div>

                                            }


                                        </DropDown>


                                        <div dir={'ltr'}
                                             className={'IranSansMedium text-sm text-textBlack text-left col-span-1 w-full  self-center ml-2 flex flex-grow justify-start items-center'}>

                                            {
                                                book.price ?
                                                    <div className={'contents'}>
                                                        <div className={' w-4 h-4 '}><Toman/></div>
                                                        <span
                                                            className={'block ml-1'}>{book.price ? book.price.toString().split('').reverse().join('').replace(/(\d{3}(?!$))/g, '$1,').split('').reverse().join('') : '0'}</span>

                                                    </div>
                                                    :
                                                    <div
                                                        className={'h-8 w-8 flex flex-row justify-center items-center'}>
                                                        <FreeSVG/></div>

                                            }
                                        </div>


                                    </div>
                                </div>
                            )

                        })
                    }

                    <div className={'h-20'}></div>

                </InfiniteScroll>


                <div className={'h-14'}></div>

            </div>

        </div>
    );
};

export default MyBooks;