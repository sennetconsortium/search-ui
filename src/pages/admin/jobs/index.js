import ViewJobs from "../../user/jobs";
import {useContext} from "react";
import AppContext from "../../../context/AppContext";


function ViewJobsAdmin() {
    const {adminGroup} = useContext(AppContext)

    return (
        <ViewJobs isAdmin={adminGroup || false} />
    )
}


export default ViewJobsAdmin