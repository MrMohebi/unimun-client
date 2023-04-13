import {useRouter} from "next/router";
import {useEffect} from "react";
import {gql, useMutation} from "@apollo/client";

export const GetParamsChecker = ({children}: { children: React.ReactNode }) => {

    const REFERENCE_PAGE_MUTATION = gql`
        mutation refPage($userAgent:String!, $id:String!) {
            referencePage(userAgent: $userAgent, id: $id)
        }
    `
    const [refPage] = useMutation(REFERENCE_PAGE_MUTATION);
    const router = useRouter();
    let getParams = router.query;

    useEffect(() => {

        if (getParams.r) {
            try {
                let userAgent = navigator.userAgent;
                let id = getParams.r;
                router.replace(router.pathname, undefined, {shallow: true});
                refPage({
                    variables: {
                        id,
                        userAgent: userAgent
                    }
                })
            } catch (e) {

            }

        }
    }, [getParams]);
    return (
        <>
            {children}
        </>
    );
};