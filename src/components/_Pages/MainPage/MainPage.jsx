import React, {Component} from 'react';
import directIcon from './icons/directIcon.svg';
import searchIcon from './icons/searchNormal.svg';
import noteBook from './icons/noteBookIcon.svg';
import views from './icons/eye.svg';
import plusSign from './icons/add.svg';
import homePage from './icons/home-actived.svg';
import chat from './icons/ask-deactivated.svg';
import profile from './icons/profile-deactivated.svg';
import wallet from './icons/wallet-deactivated.svg';
import book from './icons/book-deactivated.svg';
import blueBar from './icons/blue-Rectangle.svg';
import IranSANS from '../../../assets/fonts/IRANSansMobile.ttf';

const MainPage = () => {

        return (
            <div>
                <div>
                    <div className={"d-flex flex-row-reverse justify-content-between mb-3"}
                          style={{fontFamily: 'IranSANS'}}
                    >

                        <img
                            src={directIcon} alt='directIcon' className={"start order-3 me-auto"}
                            style={{
                                margin:15,
                                height:30,
                                width:30
                            }}
                        />
                        <div className={"d-flex flex-row-reverse"}>
                            <h6
                                className={"order-1"}
                                style={{
                                    color: '#000',
                                    marginRight: 20,
                                    marginTop: 17
                                }}
                            >
                                یونیـــ
                            </h6>

                            <h6
                                className={"flex-sm-fill order-2"}
                                style={{
                                    color: '#1da1f2',
                                    margin: 0,
                                    marginTop: 17,
                                    alignItem: 'end'
                                }}
                            >
                                مون
                            </h6>
                        </div>



                </div>

                    <span
                        className={"searchBar d-flex"}
                        style={{
                            paddingLeft: 15,
                            fontFamily: IranSANS,
                            marginBottom: 15
                        }}
                    >
                        <form className={"d-flex form-control"}
                              style={{
                                  background: '#F6F8FA',
                                  width: '95%',
                                  alignItems: 'center'
                              }}
                        >
                            <p
                                style={{
                                    paddingTop: 0,
                                    margin: 0
                                }}
                            >
                                همه
                            </p>

                            <input placeholder={"جستجو"}
                                   className={"text-end p-2 align-self-center"}
                                   color={"#c1c1c1"}
                                   style={{
                                       fontSize: 14,
                                       width: '100%',
                                       paddingRight: 40,
                                       border: 0,
                                       background: '#F6F8FA'
                                   }}
                            />

                            <img
                                src={searchIcon} alt='searchButton'
                            />

                    </form>

                </span>

                </div>
                {/*add functional button*/}


                <div
                    style={{background: '#F6F8FA',
                            height: 625}}
                >

                    <span
                        className={"popularSubjects"}
                    >

                        <p
                        className={"text-end"}
                        style={{color: '#1DA1F2', fontSize: 12, padding: 10, margin: 0, fontFamily: IranSANS}}
                        >
                        موضوعات پر طرفدار
                        </p>

                        <div className={"d-flex flex-row-reverse"}
                             style={{overflow: 'auto'}}
                        >

                        <button
                                className={"btn align-item-right m-2 border"}
                                style={{background: '#fff', border: '#E1E8ED', borderRadius: 10, fontFamily: IranSANS}}
                            >
                                Test
                            </button>

                            <button
                                className={"btn align-item-right m-2 border"}
                                style={{background: '#fff', border: '#E1E8ED', borderRadius: 10, fontFamily: IranSANS}}
                            >
                                Test
                            </button>

                            <button
                                className={"btn align-item-right m-2 border"}
                                style={{background: '#fff', border: '#E1E8ED', borderRadius: 10, fontFamily: IranSANS}}
                            >
                                Test
                            </button>

                            <button
                                className={"btn align-item-right m-2 border"}
                                style={{background: '#fff', border: '#E1E8ED', borderRadius: 10, fontFamily: IranSANS}}
                            >
                                Test
                            </button>

                            <button
                                className={"btn align-item-right m-2 border"}
                                style={{background: '#fff', border: '#E1E8ED', borderRadius: 10, fontFamily: IranSANS}}
                            >
                                Test
                            </button>

                            <button
                                className={"btn align-item-right m-2 border"}
                                style={{background: '#fff', border: '#E1E8ED', borderRadius: 10, fontFamily: IranSANS}}
                            >
                                Test
                            </button>

                            <button
                                className={"btn align-item-right m-2 border"}
                                style={{background: '#fff', border: '#E1E8ED', borderRadius: 10, fontFamily: IranSANS}}
                            >
                                Test
                            </button>

                            <button
                                className={"btn align-item-right m-2 border"}
                                style={{background: '#fff', border: '#E1E8ED', borderRadius: 10, fontFamily: IranSANS}}
                            >
                                Test
                            </button>

                            <button
                                className={"btn align-item-right m-2 border"}
                                style={{background: '#fff', border: '#E1E8ED', borderRadius: 10, fontFamily: IranSANS}}
                            >
                                Test
                            </button>

                        </div>
                </span>

                    <div className={"adsCards"}
                          style={{background: '#fff', borderRadius: 15, width: '91%', margin: 15, fontFamily: IranSANS}}
                    >
                        <img src={noteBook} alt={'note book icon'}
                             style={{paddingTop: 16, paddingLeft: 16}}
                        />

                        <h6 className={"text-end"}
                            style={{fontSize: 16,
                                    paddingRight: 16,
                                    marginBottom: 15,
                                    fontFamily: IranSANS
                            }}
                        >
                            عنوان آگهی
                        </h6>

                        <p className={"text-end"}
                            style={{fontSize: 10,
                                    paddingRight: 16,
                                    marginBottom: 0,
                                    fontFamily: IranSANS
                            }}
                        >
                            موضوع آگهی
                        </p>

                        <p
                            className={"text-end"}
                            style={{
                                fontSize: 14,
                                paddingRight: 16,
                                fontFamily: IranSANS,
                                marginTop: 15,
                                paddingBottom: 17
                            }}
                        >
                            بدون محدودیت
                        </p>
                        <span className={"d-flex flex-row"}>
                            <img src={views} alt={"Shows the number of views"}
                                 className={"order-3"}
                                 style={{
                                     marginBottom: 16,
                                     marginLeft: 4,
                                     marginTop: 3
                                 }}
                            />
                        <p
                            className={"order-4"}
                            style={{
                                marginLeft: 4,
                                marginTop: 2
                            }}
                        >
                            23
                        </p>
                        <p
                            className={"order-2"}
                            style={{
                                color: '#1DA1F2',
                                marginLeft: 4
                            }}
                        >
                            |
                        </p>
                        <p
                            className={"order-1"}
                            style={{
                                alignText: 'right',
                                direction: 'rtl',
                                marginLeft: 15
                            }}
                        >
                            4 ساعت پیش
                        </p>
                        </span>

                    </div>
                    <div className={"Add ads button d-flex justify-content-end fixed-bottom"}
                         style={{
                             marginBottom: '26%',
                             paddingRight: 15,
                         }}
                    >
                        <button
                            className={"btn"}
                            style={{
                                background: '#fff',
                                borderRadius: 15,
                                color: '#000',
                                width: 149,
                                height: 60
                            }}
                        >
                            افزودن آگهی
                            <img src={plusSign} alt={"Add sign for adding ads"}
                                 style={{
                                     marginLeft: 10
                                 }}
                            />
                        </button>
                    </div>
                    <div className={"Bottom nav-bar d-flex fixed-bottom justify-content-around"}
                         style={{
                             marginBottom: 35,
                             marginTop:7
                         }}
                    >

                        <img src={homePage} alt="Home page activated button"
                             className={"order-3"}
                             style={{
                                 height: 30,
                                 width: 30
                             }}
                        />
                        <img src={chat} alt="ask page deactivated button"
                             className={"order-5"}
                             style={{
                                 height: 30,
                                 width: 30
                             }}
                        />
                        <img src={profile} alt="profile page deactivated button"
                             className={"order-1"}
                             style={{
                                 height: 30,
                                 width: 30
                             }}
                        />
                        <img src={wallet} alt="wallet page deactivated button"
                             className={"order-2"}
                             style={{
                                 height: 30,
                                 width: 30
                             }}
                        />
                        <img src={book} alt="book page deactivated button"
                             className={"order-4"}
                             style={{
                                 height: 30,
                                 width: 30
                             }}
                        />
                    </div>
                    <div className={"fixed-bottom d-flex flex-row justify-content-around"}
                         style={{
                             margin: 0
                         }}
                    >
                        <p className={"order-3"}
                           style={{
                               paddingRight: 5,
                               color: '#1DA1F2'
                           }}
                        >
                            آگهی ها
                        </p>
                        <p className={"order-2"}>
                            کیف پول
                        </p>
                        <p className={"order-1"}>
                            پروفایل
                        </p>
                        <p className={"order-4"}
                           style={{
                               paddingRight: 13
                           }}
                        >
                            کتابخونه
                        </p>
                        <p className={"order-5"}
                           style={{
                               paddingRight: 12
                           }}>
                            بپرس
                        </p>
                    </div>
                    <span className={"d-flex justify-content-center fixed-bottom"}
                          style={{
                              marginBottom:75
                          }}
                    >
                        <img src={blueBar} alt="The blue bar on top of the activated page"/>
                    </span>
                </div>
            </div>
        );
}

export default MainPage;
