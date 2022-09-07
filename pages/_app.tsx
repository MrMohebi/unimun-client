import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Navbar from "../components/common/Navbar/Navbar";
import {ApolloProvider} from "@apollo/client";
import {client} from "../apollo-client";
import UserAuthenticationCheck from "../middlewareComponents/UserAuthenticationCheck";
import 'react-toastify/dist/ReactToastify.css'
import 'tippy.js/dist/tippy.css';
import 'animate.css';
import Phone from '../assets/svgs/phone.svg'
import Back from '../assets/svgs/mob_back.svg'
import Expand from '../assets/svgs/mob_expand.svg'
import Icons from '../assets/svgs/mob-status-icons.svg'
import UsePhone from "../components/normal/UsePhone/UsePhone";
import {NewMessageNotification} from "../components/NewMessageNotification";
import React from "react";

function MyApp({Component, pageProps}: AppProps) {
    return (
        <ApolloProvider client={client}>
            <UserAuthenticationCheck>
                <div
                    className={'overflow-hidden hide-scrollbars lg:block md:block md:h-full md:w-full lg:w-full lg:h-full block desktop  flex flex-col items-center justify-center'}>
                    <div className={'hidden md:block lg:block'}>
                        <UsePhone/>
                    </div>

                    <div
                        id={'scaler'}
                        className={'w-full h-full flex flex-col  items-center justify-center fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2  md:h-mob-s-h lg:h-mob-s-h md:w-mob-s-w lg:w-mob-s-w '}
                    >
                        <div
                            dir={'ltr'}
                            className={'w-full  h-full flex flex-col justify-center items-center md:flex lg:flex hidden '}>
                            <Phone/>

                            <div className={'w-full fixed bottom-20'}>
                                <div dir={'ltr'} className={'w-14 h-14 p-5 rounded-2xl bottom-8 absolute -ml-16 '}
                                     style={{background: 'rgba(255,255,255,0.5)'}}>
                                    <Back/>
                                </div>
                                <div dir={'ltr'}
                                     className={'w-14 h-14 p-4 right-0 rounded-2xl bottom-8 absolute -mr-16 '}
                                     style={{background: 'rgba(255,255,255,0.5)'}}>
                                    <Expand/>
                                </div>
                            </div>
                        </div>

                        <NewMessageNotification/>

                        <div dir={'rtl'}

                             className={'h-full w-full -mt-2 overflow-hidden  lg:w-mob-w  lg:h-mob-h  md:w-mob-w md:h-mob-h  lg:fixed md:fixed lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2  md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-mob-border  lg:rounded-mob-border '}>
                            <Navbar>
                                <div
                                    className={'h-6 w-full bg-white flex px-5 pt-1 flex-row justify-between items-center hidden lg:flex md:flex desktop-container'}
                                    style={{background: 'rgba(245,248,250,0.83)'}}>
                                    <div className={'w-10 h-2'}>
                                        <Icons/>
                                    </div>
                                    <span className={'IranSansMedium pl-1'} style={{
                                        fontSize: '0.75rem'
                                    }}>{(new Date().getHours().toString().length === 1 ? "0" + new Date().getHours() : new Date().getHours()) + ":" + (new Date().getMinutes().toString().length === 1 ? "0" + new Date().getMinutes() : new Date().getMinutes())}</span>
                                </div>
                                <div className={'relative bg-background overflow-hidden h-full '}>
                                    {/*@ts-ignore*/}
                                    <Component {...pageProps} />


                                </div>
                            </Navbar>
                        </div>
                    </div>
                </div>
            </UserAuthenticationCheck>
        </ApolloProvider>
    )
}

export default MyApp
