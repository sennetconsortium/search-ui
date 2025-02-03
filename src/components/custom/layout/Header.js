import React from "react";
import Head from 'next/head'

const Header = ({title}) => {
    return (
        <Head>
            <title>{title}</title>
            <link rel="icon" href="/favicon.ico"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </Head>
    )
}

export default Header
