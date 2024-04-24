import ViewJobs from "../../user/jobs";
import React, {useContext} from "react";
import AppContext from "../../../context/AppContext";
import Spinner from "../../../components/custom/Spinner";
import {JobQueueProvider} from "../../../context/JobQueueContext";
import Unauthorized from "../../../components/custom/layout/Unauthorized";
import AdminContext, {AdminProvider} from "../../../context/AdminContext";


function ViewJobsAdmin() {
    const {adminGroup, authorized} = useContext(AppContext)
    const { uiAdminAuthorized } = useContext(AdminContext)

    if (!authorized || uiAdminAuthorized.loading) {
        return <Spinner />
    }

    if (!uiAdminAuthorized.authorized) {
        return <Unauthorized />
    }

    return (
        <>
            {adminGroup && <ViewJobs isAdmin={adminGroup} />}
        </>
    )
}


export default ViewJobsAdmin

ViewJobsAdmin.withWrapper = function (page) {
    return <AdminProvider><JobQueueProvider>{page}</JobQueueProvider></AdminProvider>
}