import React, {useCallback, useEffect} from 'react';
import Icon from "../../view/Icon/Icon";
import Link from "next/link";
import {useRouter} from "next/router";
import Tab from "../../view/Tab/Tab";
import {useReactiveVar} from "@apollo/client";
import {currentNavActiveIndex} from "../../../store/navbar";


const Navbar = (props: { children: any }) => {
    const router = useRouter();
    const [currentActive, setCurrentActive] = React.useState(0)
    const globalCurrentNavActiveIndex = useReactiveVar(currentNavActiveIndex)
    const allowedToShowRoutes = ['', 'profile', 'ask', 'library', 'wallet']
    const hideInThisRoutes = ['login', 'newBook']

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
            name: 'کیف پول',
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
        // console.log(globalCurrentNavActiveIndex)
        // console.log('internal Update')
        //
        allowedToShowRoutes.forEach((navItem, index) => {
            navbarIcons.forEach((item, index) => {
                if (item.path === router.pathname)
                    currentNavActiveIndex(index)

            })
            // console.log(router.pathname.replace('/', ''))
            // console.log(index)


            // if (navItem.path !== '/' && router.pathname.includes(navItem.path)) {
            //     setCurrentActive(index)
            //     // console.log('first called')
            // }
            // if (navItem.path === '/' && router.pathname === '/') {
            //     setCurrentActive(index)
            //     // console.log('second called')
            //
            // }
        })


    }, [])


    return (
        <div className={'contents'}>

            <div
                className={`navbar z-40 ${allowedToShowRoutes.includes(router.pathname.replace('/', '')) ? '' : "hidden"}`}>
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
                                // if (index === currentActive){
                                //     console.log(index)
                                //     // setCurrentActive(index)
                                // }
                                return (
                                    <Link passHref={true} key={item.path} href={item.path}>
                                        <div onClick={() => {
                                            // console.log(index)
                                            // setCurrentActive(index)
                                            currentNavActiveIndex(index)
                                        }} id={'nav-' + index} key={item.name}
                                             className={'navbar-Button relative w-20 m-0 flex flex-col justify-center items-center ' + (active ? 'nav-active' : '')}>
                                            <Icon w={1.7} h={1.7} unit={'rem'} fill={active}
                                                  svg={'/assets/svgs/navbar/' + item.svg + '-' + (active ? 'bold' : 'outline') + '.svg'}/>
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