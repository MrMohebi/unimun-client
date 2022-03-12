import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {useRouter} from "next/router";
import Navbar from "../components/common/Navbar/Navbar";
import {ApolloProvider} from "@apollo/client";
import client from "../apollo-client";

const Layouts = [
    {
        routes: ['', 'profile'],
        except: ['login'],
        component: <Navbar/>
    },

]

function MyApp({Component, pageProps}: AppProps) {
    const router = useRouter()
    return (
        <ApolloProvider client={client}>
            <div className={'hidden lg:block md:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'}>
<h3 className={'IranSansMedium'}>برای استفاده از وبسات با موبایل وارد شوید</h3>
            </div>
            <div className={'contents lg:hidden md:hidden'}>
                <Component {...pageProps} />
                {
                    Layouts.map((ui, index) => {
                        if (ui.routes.includes(router.pathname.split('/')[1]) && !router.pathname.includes(ui.except[0])) {
                            return (
                                <div key={index}>
                                    {ui.component}
                                </div>
                            )
                        }
                    })
                }
            </div>
        </ApolloProvider>
    )
}

export default MyApp
