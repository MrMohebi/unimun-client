import React, {useState} from 'react';

const TestEnv = () => {

    const [text, set] = useState();
    return (
        <div dir={'ltr'} className={'w-full flex flex-col justify-center items-center'}>

            <div>
                <span> variable Data:</span>
                <span>{text}</span>

            </div>


            <button className={'bg-white shadow rounded p-4 mt-5'} onClick={() => {
                console.log(process.env.NEXT_PUBLIC_IS_DEV_MOD)
                console.log(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS)
            }}>
                get IS_DEV_MODE
            </button>
        </div>
    );
};

export default TestEnv;