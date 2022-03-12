import React, {useEffect} from 'react';
import Icon from "../../view/Icon/Icon";
import Link from "next/link";
import {useRouter} from "next/router";
import Tab from "../../view/Tab/Tab";


const Navbar = () => {
    const router = useRouter();
    let [active, setActive] = React.useState(0)

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
        navbarIcons.forEach((navItem, index) => {

            if (navItem.path !== '/' && router.pathname.includes(navItem.path)) {
                setActive(index)
            }
            if (navItem.path === '/' && router.pathname === '/'){
                setActive(index)
            }
        })
    }, [])


    return (
        <div className={'navbar'}>
            <Tab indicatorSizeDivider={2} activeIndex={active}>
                {
                    navbarIcons.reverse().map((item, index) => {
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
                                        setActive(index)
                                    }} id={'nav-' + index} key={item.name}
                                         className={'navbar-button relative ' + (active ? 'nav-active' : '')}>
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

    );
};

export default Navbar;