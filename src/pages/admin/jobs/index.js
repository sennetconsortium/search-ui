import ViewJobs from "../../user/jobs";
import React, {useContext} from "react";
import AppContext from "../../../context/AppContext";
import Spinner from "../../../components/custom/Spinner";
import {JobQueueProvider} from "../../../context/JobQueueContext";


function ViewJobsAdmin() {
    const {adminGroup} = useContext(AppContext)

    return (
        <>
            {adminGroup && <ViewJobs isAdmin={adminGroup} />}
            {!adminGroup && <Spinner/>}
        </>
    )
}


export default ViewJobsAdmin

ViewJobsAdmin.withWrapper = function (page) {
    return <JobQueueProvider>{page}</JobQueueProvider>
}