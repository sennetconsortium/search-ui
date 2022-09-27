import 'bootstrap/dist/css/bootstrap.css';
import Header from "../components/custom/layout/Header";
import React from "react";

export default function Custom404() {
    return (
        <>
            <Header title="Page Not Found | SenNet"></Header>

            <div className={"container"}>
                <div className={"row align-items-center error-row"}>
                    <div className={"col"}></div>
                    <div className={"col"}>
                        <h1 className={"error-heading"}>404</h1>
                        <h2>Oops! This page could not be found</h2>
                        <p>Sorry but the page you are looking for does not exist, has been removed, or is
                            temporarily unavailable</p>
                        <div className={"row"}>
                            <div className={"col"}></div>
                            <div className={"col text-center"}>
                                <a className="btn btn-outline-primary" role={"button"} href={"/search"}>Home</a>
                            </div>
                            <div className={"col"}></div>
                        </div>
                    </div>
                    <div className={"col"}></div>
                </div>
            </div>
        </>
    )
}
