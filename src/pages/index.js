import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import '@elastic/react-search-ui-views/lib/styles/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import log from 'loglevel';
import { setCookie } from 'cookies-next';
import { getRootURL } from '../config/config';
import { APP_ROUTES } from '../config/constants';
import { get_read_write_privileges } from '../lib/services';
import Unauthorized from '../components/custom/layout/Unauthorized';
import Login from '../components/custom/Login';

export default function Home() {
    const [isLoginPermitted, setIsLoginPermitted] = useState(true)
    const router = useRouter();

    useEffect(() => {
        if (router.query['info']) {
            setCookie("groups_token", JSON.parse(router.query['info']).groups_token)
            setCookie("info", router.query['info'])
            log.debug(router.query);
            get_read_write_privileges().then(read_write_privileges => {
                if (read_write_privileges.read_privs === true) {
                    setCookie('isAuthenticated', true)
                    // Redirect to home page without query string
                    window.location.replace(getRootURL() + APP_ROUTES.search);
                } else {
                    router.replace('/', undefined, {shallow: true});
                    setIsLoginPermitted(false)
                }
            }).catch(error => {
                log.error(error)
            })
        }
    }, [router.isReady]);

    if (!isLoginPermitted) {
        return <Unauthorized />
    } else {
        return <Login />
    }
}