import {useEffect} from "react";
import useRequest from '../../hooks/use-request.js'
import Router from "next/router";

export default () => {
    const [doRequest] = useRequest({
            url: `/api/users/signout`,
            body: {},
            method: 'post',
            onSuccess: () => {
                Router.push('/')
            }
        }
    )

    // 'useEffect' hook tells React that your component needs to do something after render.
    useEffect(() => {
        doRequest();
    }, [])

    return <div>Signing out...</div>
};
