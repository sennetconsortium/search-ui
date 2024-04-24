import ViewJobs from "../../user/jobs";
import React, {useContext, useEffect} from "react";
import AppContext from "../../../context/AppContext";
import Spinner from "../../../components/custom/Spinner";
import {JobQueueProvider} from "../../../context/JobQueueContext";
import {APP_ROUTES} from "../../../config/constants";
import Unauthorized from "../../../components/custom/layout/Unauthorized";


function ViewJobsAdmin() {
    const {adminGroup, isLoggedIn, router} = useContext(AppContext)

    useEffect(() => {
        if (!isLoggedIn()) {
            router.push(APP_ROUTES.login)
            return
        }
    }, [])

    return (
        <>
            {adminGroup && <ViewJobs isAdmin={adminGroup} />}
            {isLoggedIn() && !adminGroup && <Unauthorized />}
        </>
    )
}


export default ViewJobsAdmin

ViewJobsAdmin.withWrapper = function (page) {
    return <JobQueueProvider>{page}</JobQueueProvider>
}