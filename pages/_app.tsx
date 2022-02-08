import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {useRouter} from "next/router";
import Navbar from "../components/common/Navbar/Navbar";

const navBarRoutes = [
    '/', '/profile',
];

function MyApp({Component, pageProps}: AppProps) {
    const router = useRouter()

    return (
        <>
            <Component {...pageProps} />
            {
                navBarRoutes.includes(router.pathname) ?
                    <Navbar/>
                    :
                    null
            }

        </>
    )
}

export default MyApp
