import Head from 'next/head'
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import {APP_TITLE, getIngestLogin, getRootURL} from "../config/config"
import 'bootstrap/dist/css/bootstrap.css';
import log from "loglevel";
import {get_read_write_privileges} from "../lib/services";
import { setCookie } from 'cookies-next';
import Unauthorized from "../components/custom/layout/Unauthorized";

export default function Home() {
    const [isLoginPermitted, setIsLoginPermitted] = useState(true)
    const login_url = getIngestLogin();
    const router = useRouter();
    if (router.query['info']) {
        setCookie("groups_token", JSON.parse(router.query['info']).groups_token)
        setCookie("info", router.query['info'])
        localStorage.setItem("info", router.query['info']);
        localStorage.setItem("isAuthenticated", true);
        log.debug(router.query);
        get_read_write_privileges().then(read_write_privileges => {
            if (read_write_privileges.read_privs === true) {
                setCookie('isAuthenticated',true)
                // Redirect to home page without query string
                window.location.replace(getRootURL() + "/search");
            } else {
                router.replace('/', undefined, { shallow: true });
                setIsLoginPermitted(false)
            }
        }).catch(error => {
            log.error(error)
        })
    }

    if(!isLoginPermitted) {
        return (<Unauthorized/>)
    } else {
        return (
            <div className="container login-container">
                <Head>
                    <title>{APP_TITLE}</title>
                    <link rel="icon" href="/favicon.ico"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                </Head>
                <div className="card alert alert-success">
                    <div className="card-body">
                        <h3 className="card-title">{APP_TITLE}</h3>
                        <div className="card-text">User authentication is required to search the dataset catalog. Please click
                            the button below and you will be redirected to a Globus page to select your institution. After
                            selecting your
                            institution, you will be redirected to your institutional login page to enter your credentials.
                        </div>
                        <hr/>
                        <a className="btn btn-primary btn-lg" href={login_url}>
                            Log in with your institution credentials
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}