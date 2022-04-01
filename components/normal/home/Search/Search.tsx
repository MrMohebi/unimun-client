import React from 'react';
import ChatSVG from '../../../../assets/svgs/chat.svg'
import NotifSVG from '../../../../assets/svgs/notif.svg'
import SearchSVG from '../../../../assets/svgs/search.svg'
import CitySVG from '../../../../assets/svgs/city.svg'

interface Props {
    onInputChange?:any
}
const Search = (props:Props) => {
    return (
        <div className={'sticky top-0 left-0 px-5 w-full bg-white pt-3 pb-5 rounded-br-xl rounded-bl-xl shadow-md'}>
            <div className={'search-upper flex flex-row justify-between items-center'}>
                <div className={'IranSansBlack'}><span dir={'ltr'} className={'text-primary'}><span className={'text-textBlack'}>یونیـ</span>مـون</span></div>
                <div className={'chat rounded-lg bg-background p-1.5 w-10 h-10'}>
                    <NotifSVG/>
                </div>
            </div>
            <div className={'bg-background px-3 w-full flex flex-row items-center h-14 rounded-xl mt-3'}>
                <div className={'w-8 h-full flex flex-col justify-center items-center p-0.5'}><SearchSVG/></div>
                <input className={'w-full h-full bg-transparent outline-0 px-2 IranSansMedium'} placeholder={'جست و جو'} type="text" onInput={(e)=>{
                props.onInputChange(e)
                }}/>
                <div className={'flex flex-row items-center justify-center grayscale opacity-0'}>
                    <div className={'w-8 h-full flex flex-col justify-center items-center p-1'}><CitySVG/></div>
                    <span className={'IranSansMedium ml-2'}>همه</span>
                </div>
            </div>
        </div>
    );
};

export default Search;