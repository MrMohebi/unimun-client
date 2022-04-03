import type {NextPage} from 'next'
import Head from 'next/head'
import Appeals from "../components/normal/home/Appeals/Appeals";
import React, {useEffect} from "react";
import {getToken} from "../helpers/TokenHelper";
import {IsLoggedIn, UserToken} from "../store/user";
import ThousandTomans from '../assets/svgs/galleryImage.svg'
import SVGModifier from "../components/common/SVGModifier/SVGModifier";
import Search from "../components/normal/home/Search/Search";
import 'react-loading-skeleton/dist/skeleton.css'


const Home: NextPage = () => {

    useEffect(() => {
        if (getToken().length > 1) {
            UserToken(getToken())
            IsLoggedIn(true)
        }
    }, [])
    return (
        <div className={'bg-background h-full'}>
            <Head>
                <title>Unimun</title>
                <meta name="description" content="Unimun"/>
            </Head>
            <main className={'h-full'}>
                <Appeals/>
            </main>
        </div>
    )
}

export default Home
