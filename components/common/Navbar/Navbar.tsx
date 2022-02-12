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
            if (navItem.path === router.pathname) {
                setActive(index)
            }
        })
    }, [])


    return (
        <Tab indicatorSizeDivider={2} activeIndex={active}>
            {
                navbarIcons.map((item, index) => {
                        let active: boolean;
                        active = router.pathname === item.path;
                        return (
                            <Link passHref={true} key={item.path} href={item.path}>
                                <div onClick={() => {
                                    setActive(index)
                                }} id={'nav-' + index} key={item.name}
                                     className={'navbar-button relative ' + (active ? 'nav-active' : '')}>
                                    <Icon w={1.7} h={1.7} unit={'rem'} fill={active}
                                          svg={'assets/svgs/navbar/' + item.svg + '-' + (active ? 'bold' : 'outline') + '.svg'}/>
                                    <span className={'IranSansMedium text-sm mt-1'}>{item.name}</span>
                                </div>
                            </Link>
                        )
                    }
                )
            }
        </Tab>
    );
};

export default Navbar;