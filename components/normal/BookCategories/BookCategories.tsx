import React, {useEffect, useRef, useState} from 'react';
import Header from "../../common/Header/Header";
import Back from '../../../assets/svgs/back.svg'
import {gql, useLazyQuery} from "@apollo/client";
import LoadingDialog from "../../view/LoadingDialog/LoadingDialog";
import {useRouter} from "next/router";
import SearchSVG from "../../../assets/svgs/search.svg";
import CloseSVG from "../../../assets/svgs/close.svg";

const BookCategories = (props: { onCatSelected: Function }) => {

    const [tree, _tree] = useState([] as [])
    const data = useRef(null)
    const lastClicked = useRef([])
    const [searchText, _searchText] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const BookCategoriesQuery = gql`
        query bookCategories {
            bookCategories {
                data {
                    id
                    parentID
                    phrase
                    hasChild
                    order
                    title
                }
            }
        }
    `
    const [getBookCategories, getBookCategoriesResult] = useLazyQuery(BookCategoriesQuery);


    const createCategoryTree = (dataArray: [], clickedId: string) => {

        let tree = [] as any
        if (!clickedId) {
            dataArray.forEach((item: { parentID: string, title: string, id: string }, index) => {
                if (!item.parentID) {
                    tree.push({title: item.title, hasChild: false, id: item.id})
                    dataArray.forEach((itm: { parentID: string, title: string, id: string }, indx) => {
                        if (itm.parentID === item.id) {
                            tree[tree.length - 1].hasChild = true;
                        }
                    })
                }
            })

            _tree(tree)

            return;
        }

        dataArray.forEach((item: { parentID: string, title: string, id: string }, index) => {
            if (item.parentID === clickedId) {
                tree.push({title: item.title, hasChild: false, id: item.id})
                dataArray.forEach((itm: { parentID: string, title: string, id: string }, indx) => {
                    if (itm.parentID === item.id) {
                        tree[tree.length - 1].hasChild = true;
                    }
                })
            }

        })
        _tree([])

        setTimeout(() => {
            // @ts-ignore
            _tree([...tree])
        }, 50)

    }

    useEffect(() => {
        getBookCategories().then(e => {
            console.log(e)
            createCategoryTree(e.data.bookCategories.data, '')
            data.current = e.data.bookCategories.data
        })
    }, [])


    const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value !== '') {
            if (data.current) {
                let searchedData = (data.current as []).map((item: { hasChild: boolean, title: string }) => {
                    if (!item.hasChild && (item.title as string).includes(e.currentTarget.value)) {
                        return item
                    }
                    return null
                }).filter(item => item)
                _tree(searchedData as [])
            }
        } else {
            if (lastClicked.current)
                lastClicked.current = [];

            if (data.current)
                createCategoryTree(data.current, '')
        }
        _searchText(e.currentTarget.value)


    }


    const router = useRouter();

    return (
        <div className={'w-full pt-20 h-full absolute  top-0 left-0 z-40 bg-background overflow-scroll pb-10 '}
             id={'test-categories'}>
            <Header title={'انتخاب دسته بندی'} back={true} backOnClick={() => {

                if (getBookCategoriesResult.loading || lastClicked.current.length < 1) {
                    props.onCatSelected('')
                } else {
                    if (lastClicked.current.length) {
                        createCategoryTree(data.current as any, lastClicked.current[lastClicked.current.length - 2])
                        lastClicked.current.pop();
                    }

                }
            }}/>

            <div className={'h-20 absolute top-10 rounded-b-xl w-full  bg-white px-4 pt-5 z-50'}>

                <div
                    className={`bg-background px-3 h-10 w-full flex flex-row items-center justify-between  rounded-xl  transition-all overflow-hidden duration-200 origin-top `}>
                    <div className={'w-8 h-full  relative flex flex-col justify-center items-center p-1'}>
                        <div
                            className={`'overflow-hidden origin-center transition-all  duration-300 flex flex-col justify-center items-center w-full h-full '`}>
                            <SearchSVG/>
                        </div>

                    </div>
                    <input ref={inputRef} id={'search-input'}
                           className={'w-full h-full bg-transparent outline-0 px-2 text-sm IranSansMedium'}
                           placeholder={'جستجو'} type="text" onChange={onSearchInputChange}/>
                    <div
                        className={`w-5 h-5 flex flex-col justify-center transition-all duration-100 items-center p-0.5 ${searchText ? "scale-100" : 'scale-0'}`}
                        onClick={() => {
                            if (inputRef.current)
                                inputRef.current.value = ''

                            createCategoryTree(data.current as any, '')
                            _searchText('')
                        }}><CloseSVG/></div>

                    {/*<div className={'flex flex-row items-center justify-center grayscale opacity-0'}>*/}
                    {/*    <div className={'w-8 h-full flex flex-col justify-center items-center p-1'}><CitySVG/></div>*/}
                    {/*    <span className={'IranSansMedium ml-2'}>همه</span>*/}
                    {/*</div>*/}
                </div>


            </div>

            {
                lastClicked.current.length === 0 && searchText === '' ?
                    <div className={'w-full IranSansMedium text-sm px-3 pt-2 text-textDark scale-95 mb-2'}>
                        کتاب ها و جزوه هامونو تو این 3 تا دسته ی اصلی قرار دادیم تا راحت تر بتونی چیزی که میخوای رو پیدا
                        کنی
                    </div> : null
            }


            {
                getBookCategoriesResult.loading ?
                    <div className={'fixed top-0 left-0 w-full h-full z-50 '}
                         style={{background: 'rgba(0,0,0,0.4)'}}>
                        <div
                            className={'top-1/2 left-1/2 fixed bg-white rounded-3xl shadow p-4 -translate-x-1/2 -translate-y-1/2'}>
                            <LoadingDialog wrapperClassName={' w-16 h-16 '} color={'#009dff'}/>

                        </div>
                    </div> :
                    null
            }


            {
                tree.map((cat: { hasChild: string, title: string, id: never }, index) => {
                    return (
                        <div key={'cat' + index}
                             className={'w-full flex flex-col justify-start items-center pt-3 animate__animated animate__fadeInUp '}
                             style={{animationDelay: index * 100 + 'ms', animationDuration: '.25s'}}
                             onClick={() => {
                                 if (!cat.hasChild) {
                                     props.onCatSelected(cat)
                                 }
                                 createCategoryTree(data.current as any, cat.id)
                                 lastClicked.current.push(cat.id)
                             }}
                        >
                            <div
                                className={'w-11/12 rounded-xl h-14 bg-white max-w-sm flex flex-row justify-between items-center px-4'}>

                                <span className={'IranSansMedium'}>{cat.title}</span>
                                <div className={`w-6 h-6 ${cat.hasChild ? '' : 'opacity-0'}`}>
                                    <Back/>
                                </div>
                            </div>
                        </div>
                    )
                })
            }


        </div>
    );
};

export default BookCategories;