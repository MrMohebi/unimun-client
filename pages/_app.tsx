import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {useRouter} from "next/router";
import Navbar from "../components/common/Navbar/Navbar";
import {ApolloProvider} from "@apollo/client";
import client from "../apollo-client";
import UserAuthenticationCheck from "../middlewareComponents/UserAuthenticationCheck";
import 'react-toastify/dist/ReactToastify.css'
import 'tippy.js/dist/tippy.css';
import 'animate.css';


function MyApp({Component, pageProps}: AppProps) {
    const router = useRouter()

    return (
        <ApolloProvider client={client}>
            <UserAuthenticationCheck>
                <div
                    className={'hidden hide-scrollbars lg:block md:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'}>
                    <h3 className={'IranSansMedium'}>برای استفاده از وبسایت با موبایل وارد شوید</h3>
                </div>
                <div className={'contents lg:hidden md:hidden '}>
                    <Navbar>
                        <Component {...pageProps} />
                    </Navbar>
                </div>
            </UserAuthenticationCheck>
        </ApolloProvider>
    )
}

export default MyApp
