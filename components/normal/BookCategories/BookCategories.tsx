import React, {useEffect, useRef, useState} from 'react';
import Header from "../../common/Header/Header";
import Back from '../../../assets/svgs/back.svg'
import {gql, useLazyQuery} from "@apollo/client";
import LoadingDialog from "../../view/LoadingDialog/LoadingDialog";
import {useRouter} from "next/router";
import {prop} from "styled-tools";
import {analyze} from "@typescript-eslint/scope-manager";

const BookCategories = (props: { onCatSelected: Function }) => {

    const [tree, setTree] = useState([] as [])
    const data = useRef(null)
    const lastClicked = useRef([])
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
            setTree(tree)
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
        // @ts-ignore
        setTree([...tree])
    }

    useEffect(() => {
        getBookCategories().then(e => {
            createCategoryTree(e.data.bookCategories.data, '')
            data.current = e.data.bookCategories.data
        })
    }, [])


    const router = useRouter();
    return (
        <div className={'w-full h-full fixed top-0 left-0 z-40 bg-background overflow-scroll pb-10 '}>
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

            {
                getBookCategoriesResult.loading ?
                    <LoadingDialog color={'#2aa0ff'} wrapperClassName={' w-20 h-20  mx-auto rounded-xl mt-10'}/>
                    :
                    null
            }
            {
                tree.map((cat: { hasChild: string, title: string, id: never }, index) => {
                    return (
                        <div key={'cat' + index}
                             className={'w-full flex flex-col justify-start items-center pt-3'}
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
                                <div className={`w-5 h-5 ${cat.hasChild ? '' : 'opacity-0'}`}>
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