import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import {APP_TITLE, getEntityEndPoint, getIngestLogin, getRootURL} from "../config/config"

import 'bootstrap/dist/css/bootstrap.css';
import cookieCutter from 'cookie-cutter'
import log from "loglevel";
import {get_read_write_privileges} from "../lib/services";

export default function Home() {
    const [isLoginPermitted, setIsLoginPermitted] = useState(true)
    const login_url = getIngestLogin();
    const router = useRouter();
    if (router.query['info']) {
        cookieCutter.set("groups_token", JSON.parse(router.query['info']).groups_token)
        cookieCutter.set("info", router.query['info'])
        localStorage.setItem("info", router.query['info']);
        log.debug(router.query);
        get_read_write_privileges().then(read_write_privileges => {
            if (read_write_privileges.read_privs === true) {
                cookieCutter.set("isAuthenticated", true);
                // Redirect to home page without query string
                window.location.replace(getRootURL() + "/search");
            } else {
                cookieCutter.set("isAuthenticated", false);
                setIsLoginPermitted(false)
                router.replace('/', undefined, { shallow: true });
            }
        }).catch(error => {
            log.error(error)
        })
    }

    return (
        <div className="container login-container">
            <Head>
                <title>{APP_TITLE}</title>
                <link rel="icon" href="/favicon.ico"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>

            {!isLoginPermitted && <div className={'alert alert-danger text-center'}>You have not been granted access to use the SenNet Data Sharing Portal</div>}
            <div className="card alert alert-success">
                <div className="card-body">
                    <h3 className="card-title">{APP_TITLE}</h3>
                    <p className="card-text">User authentication is required to search the dataset catalog. Please click
                        the button below and you will be redirected to a Globus page to select your institution. After
                        selecting your
                        institution, you will be redirected to your institutional login page to enter your credentials.
                    </p>
                    <hr/>
                    <a className="btn btn-primary btn-lg" href={login_url}>
                        Log in with your institution credentials
                    </a>

                </div>
            </div>
        </div>
    )
}