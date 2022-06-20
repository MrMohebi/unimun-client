import React, {useEffect, useState} from 'react';
import Header from "../../components/common/Header/Header";
import Tab from "../../components/view/Tab/Tab";
import Edit from '../../assets/svgs/edit.svg'
import Delete from '../../assets/svgs/delete.svg'
import Seen from '../../assets/svgs/eye.svg'
import Toman from '../../assets/svgs/toman.svg'
import {gql, useLazyQuery} from "@apollo/client";
import {useRouter} from "next/router";
import {UserToken} from "../../store/user";
import InfiniteScroll from "react-infinite-scroll-component";
import Toast from "../../components/normal/Toast/Toast";
import {ToastContainer} from "react-toastify";
import FullScreenLoading from "../../components/normal/FullScreenLoading/FullScreenLoading";

const MyBooks = () => {

    const [currentActivePart, _currentActivePart] = useState(1)
    const [myBooks, _myBooks] = useState([])
    const [myBrochures, _myBrochures] = useState([])
    let [booksLength, _booksLength] = useState(0)

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
                        status
                        isBook
                        price
                        seen
                        title
                        id
                        pages
                        verifiedAt
                    }
                }
            }
        }
    `

    const [getMyBooks, getMyBooksData] = useLazyQuery(myBooksQuery)

    const router = useRouter();
    useEffect(() => {

            if (!getMyBooksData.loading) {
                getMyBooksData.loading = true;
            }


            if (UserToken()) {
                getMyBooks({
                    variables: {
                        first: 10,
                        after: null
                    }
                }).then(e => {
                    console.log(e)

                        try {

                            let MyBooks = e.data.booksUserCreated.edges.map((item: any) => {
                                    if (item.node.isBook) {
                                        return item.node
                                    }
                                }
                            ).filter((item: any) => item);
                            let MyBrochures = e.data.booksUserCreated.edges.map((item: any) => {
                                    if (!item.node.isBook) {
                                        return item.node
                                    }
                                }
                            ).filter((item: any) => item)


                            _myBooks(MyBooks);
                            _myBrochures(MyBrochures);
                            (e.data.booksUserCreated.edges as []).forEach((item, index) => {

                                let book = (item as { node: any }).node as {
                                    price: string
                                    isBook: boolean
                                    title: string
                                    seen: string
                                }
                                if (book.isBook) {
                                    _booksLength(booksLength++)
                                } else {
                                    console.log(item)
                                }
                            })


                        } catch
                            (e) {
                            Toast('خطا در هنگام دریافت کتاب ها')
                        }
                    }
                )
            } else {
                router.push('/profile/login')
            }

        }
        ,
        []
    )
    return (
        <div className={'h-full pb-20 '}>

            <FullScreenLoading show={getMyBooksData.loading}/>
            <ToastContainer/>

            <Header noShadow={true} backOnClick={() => {
                router.push('/library')
            }} title={'کتاب های من'} back={true}>

            </Header>
            <div className={'h-10 w-full bg-white  z-50'}>

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

            <div className={'w-full h-full overflow-scroll px-3'} id={'my-books-scroller'}>

                <InfiniteScroll pullDownToRefreshContent={<h1 className={'h-10'}></h1>}
                                releaseToRefreshContent={<div
                                    className={'h-10 w-full text-center IranSans text-sm '}>والا اینجا چیزی واسه رفرش
                                    نیست شما که از خودمونی :)</div>}
                                className={''}
                                pullDownToRefreshThreshold={90} refreshFunction={() => {
                    console.log('rfreshing')
                }} pullDownToRefresh={true} scrollableTarget={'my-books-scroller'} next={() => {
                    console.log('gettin new')

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
                            <div className={'h-10 w-full IranSans text-center text-textDark mt-5 '}>هنوز جزوه ای اضافه
                                نکردی</div>
                            :
                            null
                    }

                    {
                        (currentActivePart === 1 ? myBooks : myBrochures).map((item, index) => {
                            let book: {
                                price: string
                                isBook: boolean
                                title: string
                                seen: string
                                status: string

                            } = item;
                            return (
                                <div dir={'ltr'} key={'my-book' + index}
                                     className={'w-full h-36 rounded-2xl shadow-sm bg-white mt-3 grid grid-cols-4 grid-rows-3 px-3'}>
                                    <div
                                        className={'row-span-3 h-full col-span-1 h-full self-end flex flex-col items-center justify-center'}>
                                        <img src="/assets/image/noBookImage.png" alt=""/>
                                    </div>

                                    <div
                                        className={'flex flex-row-reverse justify-start items-center col-span-3 IranSansMedium'}>
                                        <span>{book.title}</span>
                                        <div
                                            className={'IranSansMedium text-primary p-1 rounded-xl px-2 bg-background mr-3'}>{book.status === "PENDING_REVIEW" ? "در حال بررسی" : ""}</div>
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
                                        <div
                                            className={'h-8 w-8 text-center  bg-background rounded-lg p-1  IranSansMedium text-md tracking-tighter font-black whitespace-nowrap px-2'}>
                                            . . .

                                        </div>
                                        <div
                                            style={{fontSize: '0.7rem'}}
                                            className={'h-8  text-center flex flex-row justify-center items-center  bg-background rounded-xl  px-2 mx-1 IranSansMedium '}>
                                            ویرایش
                                            <div className={'w-4 h-4 ml-2'}>
                                                <Edit/>
                                            </div>
                                        </div>
                                        <div
                                            style={{fontSize: '0.7rem'}}
                                            className={'h-8 text-errorRed text-center flex flex-row justify-center items-center   bg-background rounded-xl  px-2 mx-1 IranSansMedium  '}>
                                            حذف
                                            <div className={'w-4 h-4 ml-2'}>
                                                <Delete/>
                                            </div>
                                        </div>

                                        <div dir={'ltr'}
                                             className={'IranSansMedium text-sm text-textBlack text-left col-span-1 w-full  self-center ml-2 flex flex-grow justify-start items-center'}>
                                            <div className={' w-4 h-4 '}><Toman/></div>
                                            <span
                                                className={'block ml-1'}>{book.price ? book.price.split('').reverse().join('').replace(/(\d{3}(?!$))/g, '$1,').split('').reverse().join('') : '0'}</span>
                                        </div>

                                    </div>
                                </div>
                            )

                        })
                    }

                </InfiniteScroll>


                <div className={'h-14'}></div>

            </div>

        </div>
    );
};

export default MyBooks;