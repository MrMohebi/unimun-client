import React, {useEffect, useState} from 'react';
import Link from "next/link";
import {useRouter} from "next/router";
import Tab from "../../view/Tab/Tab";
import {useReactiveVar} from "@apollo/client";
import {currentNavActiveIndex} from "../../../store/navbar";
import SVG from "../SVG/SVG";


const Navbar = (props: { children: any }) => {
    const router = useRouter();
    const globalCurrentNavActiveIndex = useReactiveVar(currentNavActiveIndex)
    const allowedToShowRoutes = ['', 'profile', 'ask', 'library', 'wallet']
    const [svg, _svg] = useState(<h1>Mokafelam</h1>)


    const navbarIcons = [
        {
            name: 'بپرس',
            path: '/ask',
            svg: 'messages'
        },
        {
            name: 'کتابخونه',
            path: '/library',
            svg: 'book'
        },
        {
            name: 'آگهی ها',
            path: '/',
            svg: 'home'
        },
        {
            name: 'یونی جیب',
            path: '/wallet',
            svg: 'wallet'
        },
        {
            name: 'پروفایل',
            path: '/profile',
            svg: 'profile'
        },

    ]


    useEffect(() => {

        allowedToShowRoutes.forEach((navItem, index) => {
            navbarIcons.forEach((item, index) => {
                if (item.path === router.pathname)
                    currentNavActiveIndex(index)

            })
        })


    }, [])


    return (
        <div className={'contents'}>

            <div
                className={`navbar z-[51] ${allowedToShowRoutes.includes(router.pathname.replace('/', '')) ? '' : "hidden"}`}>

                <Tab indicatorSizeDivider={2} activeIndex={globalCurrentNavActiveIndex}>
                    {
                        navbarIcons.map((item, index) => {
                            let active: boolean = false;
                            if (item.path !== '/') {
                                active = router.pathname.includes(item.path) && router.pathname.length > 2
                            }
                            if (router.pathname === '/' && item.path === '/') {
                                active = true;
                            }

                            return (
                                <Link passHref={true} key={item.path} href={item.path}>
                                    <div onClick={() => {
                                        currentNavActiveIndex(index)
                                    }} id={'nav-' + index} key={item.name}
                                         className={'navbar-Button relative w-20 m-0 flex flex-col justify-center items-center ' + (active ? 'nav-active' : '')}>


                                        {
                                            <img
                                                src={`/assets/svgs/navbar/${item.svg}-${active ? "bold" : 'outline'}.svg`}
                                                className={`w-8 pt-1 h-10 ${active ? "nav-active" : ''}`} alt=""/>
                                        }
                                        {/*<SVG*/}
                                        {/*    svgPath={'navbar/' + item.svg + '-' + (active ? 'bold' : 'outline')}*/}
                                        {/*    svgOnLoad={(svg: any) => {*/}
                                        {/*    }} wrapperClassName={''}/>*/}

                                        <span className={'IranSansMedium text-tiny mt-1'}>{item.name}</span>
                                    </div>
                                    </Link>
                                )
                            }
                        )
                    }
                </Tab>
            </div>
            {props.children}
        </div>


    );
};

export default Navbar;