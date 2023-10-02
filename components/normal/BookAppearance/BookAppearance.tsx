import React, {useEffect, useRef, useState} from 'react';
import Header from "../../common/Header/Header";
import {gql, useQuery} from "@apollo/client";
import LoadingDialog from "../../view/LoadingDialog/LoadingDialog";
import {useRouter} from "next/router";

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
    const getBookAppearance = useQuery(BookAppearanceQuery, {
        fetchPolicy: 'cache-first'
    });

    const emojies = [
        'star',
        'blink',
        'poker',
        'think',
        'melting',
    ]
    useEffect(() => {
        if (getBookAppearance.data)
            _appearances(getBookAppearance.data.bookAppearances.data)

        // getBookAppearance().then(e => {
        //     try {
        //         _appearances(e.data.bookAppearances.data)
        //     } catch (e) {
        //         props.onAppearanceSelected('')
        //     }
        // })
    }, [getBookAppearance.data])


    const router = useRouter();
    return (
        <div className={'w-full h-full fixed top-0 left-0 z-40 bg-background overflow-scroll pb-10 '}>
            <Header title={'وضعیت ظاهری کتاب'} back={true} backOnClick={() => {
                props.onAppearanceSelected('')
            }}/>


            {
                getBookAppearance.loading ?
                    <div className={'fixed top-0 left-0 w-full h-full z-50 '} style={{background: 'rgba(0,0,0,0.4)'}}>
                        <div
                            className={'top-1/2 left-1/2 fixed bg-white rounded-3xl shadow p-4 -translate-x-1/2 -translate-y-1/2'}>
                            <LoadingDialog wrapperClassName={' w-16 h-16 '} color={'#009dff'}/>

                        </div>
                    </div> :
                    null
            }


            {
                appearances.map((appearance: { title: string, details: string }, index) => {
                    return (
                        <div key={'app' + index} style={{animationDelay: index * 100 + 'ms', animationDuration: '.25s'}}
                             className={'w-full flex flex-col justify-start items-center pt-3 animate__animated animate__fadeInUp'}
                             onClick={() => {
                                 props.onAppearanceSelected(appearance)
                             }}
                        >
                            <div
                                className={'w-11/12 rounded-xl h-auto py-4 bg-white  max-w-sm flex flex-row justify-start items-center px-4'}>
                                <img src={`/assets/image/emojies/${emojies[index]}.png`} onLoad={(e) => {
                                    e.currentTarget.style.setProperty('width', '2rem')
                                    e.currentTarget.style.setProperty('margin-right', '0.5rem')
                                    e.currentTarget.style.setProperty('margin-left', '1rem')
                                    // e.currentTarget.style.width = '2rem'

                                }} className={' h-8   transition-all'} style={{width: '0rem', marginRight: '0rem'}}
                                     alt=""/>

                                <div className={'flex flex-col justify-center items-start'}>
                                    <span className={'IranSansMedium'}>{appearance.title}</span>
                                    <p className={'IranSansMedium text-sm text-textDark mt-2'}>{appearance.details}</p>

                                </div>

                            </div>
                        </div>
                    )
                })
            }


        </div>
    );
};

export default BookAppearance;