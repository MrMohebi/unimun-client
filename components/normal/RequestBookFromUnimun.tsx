import Button from "../view/Button/Button";
import {useRef, useState} from "react";
import {gql, useMutation} from "@apollo/client";

export const RequestBookFromUnimun = () => {

    const [state, setState] = useState(0);
    const [bookTitle, setBookTitle] = useState("");
    const nameInputRef = useRef<HTMLInputElement | null>(null);


    const WANT_BOOK_MUTATION = gql`
        mutation wantBook ($title:String!) {
            wantBook(title: $title) {
                data
                errors
                message
                status
            }
        }
    `
    const [wantBook, wantBookProperties] = useMutation(WANT_BOOK_MUTATION, {
        variables: {
            title: bookTitle
        }
    })
    return (

        !wantBookProperties.data ?
            <>
                <div className={'w-full grid place-items-center mt-4 px-4 '}>
                    <label htmlFor=""
                           className={`w-full text-sm IranSans mb-1 text-textDark ${state === 1 ? "" : "hidden"}`}> نام
                        کامل
                        کتاب</label>

                    <input onLoad={() => {
                    }} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setBookTitle(e.currentTarget.value)
                    }}
                           className={`w-full border-2 border-primary h-12 px-2 rounded-lg bg-transparent IranSansMedium ${state === 1 ? "" : "hidden"} `}
                           placeholder={''} type={"text"} ref={nameInputRef}/>


                    <Button loading={wantBookProperties.loading} onClick={() => {
                        if (state === 0) {
                            setState(1)
                            try {
                                nameInputRef.current!.value = (document.getElementById('search-input') as HTMLInputElement).value
                            } catch (e) {

                            }

                        } else if (state === 1) {
                            wantBook({variables: {title: bookTitle}})
                        }

                    }}
                            className={'bg-primary rounded-xl pt-2 py-3 min-h-[3rem] px-3 mt-2 min-w-[5rem] transition-all '}>
                    <span
                        className={'IranSansMedium text-white text-sm '}>{state === 0 ? '+ درخواست کتاب از یونیمون' : 'تایید و درخواست'}</span>
                    </Button>
                </div>
            </>
            :
            <>
                <img src="/assets/svgs/check-circle.svg"
                     className={'w-20 mx-auto mt-5 animate__animated animate__zoomIn animate__faster'}
                     alt="Unimun Book Requested SuccessFully"/>

                <span className={'mx-auto text-center w-full block mt-3  text-sm IranSansMedium px-4 text-center'}>
                درخواست کتاب شما با موفقیت برای یونیمون فرستاده شد
                به محض موجود شدن کتاب از طریق چت به شما اعلام میکنیم
            </span>
            </>


    )
        ;
};