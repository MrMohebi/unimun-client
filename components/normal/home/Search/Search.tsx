import React from 'react';
import ChatSVG from '../../../../assets/svgs/chat.svg'
import SearchSVG from '../../../../assets/svgs/search.svg'
import CitySVG from '../../../../assets/svgs/city.svg'

interface Props {
    onInputChange?:any
}
const Search = (props:Props) => {
    return (
        <div className={'sticky top-0 left-0 px-5 w-full bg-white pt-3 pb-3 rounded-br-xl rounded-bl-xl shadow-md'}>
            <div className={'search-upper flex flex-row justify-between items-center'}>
                <div className={'IranSansBlack'}><span dir={'ltr'} className={'text-primary'}><span className={'text-textBlack'}>یونیـ</span>مون</span></div>
                <div className={'chat rounded-lg bg-background p-1 w-8 h-8'}>
                    <ChatSVG/>
                </div>
            </div>
            <div className={'bg-background px-3 w-full flex flex-row items-center h-10 rounded-lg mt-3'}>
                <div className={'w-8 h-full flex flex-col justify-center items-center p-1'}><SearchSVG/></div>
                <input className={'w-full h-full bg-transparent outline-0 px-2 IranSansMedium'} type="text" onInput={(e)=>{
                props.onInputChange(e)
                }}/>
                <div className={'flex flex-row items-center justify-center'}>
                    <div className={'w-8 h-full flex flex-col justify-center items-center p-1'}><CitySVG/></div>
                    <span className={'IranSansMedium'}>همه</span>
                </div>
            </div>
        </div>
    );
};

export default Search;