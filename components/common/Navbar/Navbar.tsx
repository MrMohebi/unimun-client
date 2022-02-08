import React, {useEffect} from 'react';
import Icon from "../../view/Icon/Icon";
import Link from "next/link";
import {useRouter} from "next/router";

const Navbar = () => {
    const router = useRouter();

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

    const moveIndicator = ()=>{
        navbarIcons.forEach((item,index)=>{
            if (item.path === router.pathname){
                let clicked = document.getElementById('nav-' + index)!.getBoundingClientRect()
                console.log(clicked.left)
                document.getElementById('nav-indicator')!.style.left = ((clicked.left + (clicked.width/2)) - 20) + 'px'
            }
        })
    }

    useEffect(()=>{
        moveIndicator()
        window.addEventListener('resize',()=>{
            moveIndicator()
        })
    })


    return (
        <div className="navbar">
            <div id={'nav-indicator'} className={'nav-indicator transition-all'}/>
            {
                navbarIcons.map((item, index) => {
                        let active: boolean;
                        active = router.pathname === item.path;
                        return (
                            <Link key={item.path} href={item.path}>
                                <div onClick={() => {

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
        </div>
    );
};

export default Navbar;