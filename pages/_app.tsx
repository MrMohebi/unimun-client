import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {useRouter} from "next/router";
import Navbar from "../components/common/Navbar/Navbar";

const Layouts = [
    {
        routes: ['', 'profile'],
        except:['login'],
        component: <Navbar/>
    },

]

function MyApp({Component, pageProps}: AppProps) {
    const router = useRouter()
    return (
        <>
            <Component {...pageProps} />
            {
                Layouts.map((ui,index) => {
                    if (ui.routes.includes(router.pathname.split('/')[1]) && !router.pathname.includes(ui.except[0])) {
                        return (
                            <div key={index}>
                                {ui.component}
                            </div>
                        )
                    }
                })
            }
        </>
    )
}

export default MyApp
