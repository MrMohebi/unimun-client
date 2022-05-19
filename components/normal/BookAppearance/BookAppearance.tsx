import React, {useEffect, useRef, useState} from 'react';
import Header from "../../common/Header/Header";
import Back from '../../../assets/svgs/back.svg'
import {gql, useLazyQuery} from "@apollo/client";
import LoadingDialog from "../../view/LoadingDialog/LoadingDialog";
import {useRouter} from "next/router";
import {prop} from "styled-tools";

const BookAppearance = (props: { onAppearanceSelected: Function }) => {

    const [appearances, _appearances] = useState([])

    const BookAppearanceQuery = gql`
        query bookAppearance {
            bookAppearances {
                data {
                    title
                    details
                    id
                }
            }
        }
    `
    const [getBookAppearance, getBookAppearanceResult] = useLazyQuery(BookAppearanceQuery);


    useEffect(() => {
        getBookAppearance().then(e => {
            console.log(e.data.bookAppearances.data)
            try {
                _appearances(e.data.bookAppearances.data)
            } catch (e) {
                props.onAppearanceSelected('')
            }
        })
    }, [])


    const router = useRouter();
    return (
        <div className={'w-full h-full fixed top-0 left-0 z-40 bg-background overflow-scroll pb-10 '}>
            <Header title={'وضعیت ظاهری کتاب'} back={true} backOnClick={() => {
                props.onAppearanceSelected('')
            }}/>

            {
                getBookAppearanceResult.loading ?
                    <LoadingDialog color={'#2aa0ff'} wrapperClassName={' w-20 h-20  mx-auto rounded-xl mt-10'}/>
                    :
                    null
            }
            {
                appearances.map((appearance:{title:string,details:string},index) => {
                    return (
                        <div key={'app' + index}
                             className={'w-full flex flex-col justify-start items-center pt-5'}
                             onClick={() => {
                                 console.log(appearance)
                                 props.onAppearanceSelected(appearance)
                             }}
                        >
                            <div
                                className={'w-11/12 rounded-xl h-auto py-4 bg-white  max-w-sm flex flex-col justify-center items-start px-4'}>
                                <span className={'IranSansMedium'}>{appearance.title}</span>
                                <p className={'IranSans mt-2'}>{appearance.details}</p>

                            </div>
                        </div>
                    )
                })
            }


        </div>
    );
};

export default BookAppearance;