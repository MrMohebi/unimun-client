import React from 'react';
import EachAppeal from "../../components/normal/home/EachAppeal/EachAppeal";
import {useRouter} from "next/router";

const Item = () => {
    const router = useRouter();
    const {id} = router.query;
    return (
        <EachAppeal id={id?.toString()??''}/>
    );
};

export default Item;