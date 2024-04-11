import React, {useState} from "react";
import {getJobTypeColor, getStatusColor} from "../js/functions";
import {Button, ListGroup} from "react-bootstrap";

function JobDashboardTutorialSteps({getVariant, data}) {
    const hasData = Array.isArray(data) && data.length
    const stepsCount = hasData ? 6 : 4
    const actionUI = (action) => <Button key={action} variant={getVariant(action)} className={'mx-1'} size="sm">{action}</Button>
    const statusUI = (status) => <span className={`badge ${getStatusColor(status)}`}>{status}</span>
    let _steps = [
        {
            target: '#nav-dropdown, #nav-dropdown--bulkMetadata',
            disableBeacon: true,
            title: <span>Initiate a job (1/{stepsCount})</span>,
            content: <span>Jobs can be initiated via <em>Register entity (bulk)</em> and <em>Upload metadata</em></span>
        },
        {
            target: '.refresh-jobs',
            title: <span>Refresh job list (2/{stepsCount})</span>,
            content: <div>The job list is automatically being refreshed every 3 seconds. Alternatively, may click the <em>Refresh</em> button manually to refresh faster.</div>
        },
        {
            target: '.rdt_Table',
            disableBeacon: true,
            title: <span>Job Types (3/{stepsCount})</span>,
            content: <div>Under either <code>Entity</code> or <code>Metadata</code>, there are two job types <code>validation</code> or <code>registration</code>.
                A <code>validation</code> job checks that that upload meets specification standards. While a <code>registration</code> job saves this upload information.
                This is visible in the table under the <em>Type</em> column as either&nbsp;
                <span className={`badge badge-block`} style={{backgroundColor: getJobTypeColor('Metadata validation')}}>Metadata validation/registration</span> or&nbsp;
                <span className={`badge badge-block`} style={{backgroundColor: getJobTypeColor('Entity validation')}}>Entity validation/registration</span>
            </div>
        },
        {
            target: '.rdt_Table',
            disableBeacon: true,
            title: <span>Job Actions (4/{stepsCount})</span>,
            content: <div>Depending on the status of a particular job, different actions can be taken via the <em>Action</em> column in the jobs table. These actions include
                {actionUI('Register')} {actionUI('Resubmit')} {actionUI('Cancel')} and {actionUI('Delete')}.
                <ListGroup className={'mt-4'}>
                    <ListGroup.Item>{actionUI('Register')} - takes a {statusUI('Complete')} status <code>validation</code> job to <code>registration</code> step</ListGroup.Item>
                    <ListGroup.Item>{actionUI('Resubmit')} - {statusUI('Failed')} or {statusUI('Error')} <code>validation</code> jobs can take a resubmission action </ListGroup.Item>
                    <ListGroup.Item>{actionUI('Cancel')} - stops a currently running or {statusUI('Started')} job</ListGroup.Item>
                    <ListGroup.Item>{actionUI('Delete')} - removes {statusUI('Complete')} status job from list</ListGroup.Item>
                </ListGroup>
            </div>
        },

    ]
    if (hasData) {
        _steps.push(
            {
                target: '.sui-columns-toggle',
                title: <span>Show/Hide Columns In Table (5/{stepsCount})</span>,
                content: 'Columns can be hidden from the results table by clicking on the dropdown menu and selecting which columns to hide. To add these columns back to the results table, click on the ‘x’ next to the column name.'
            }
        )

        _steps.push(
            {
                target: '.btn-illusion-secondary',
                title: <span>Color code linked jobs (6/{stepsCount})</span>,
                content: <div>Toggling the <em>Color code linked jobs</em> switch will turn on or off colors for jobs related to each other.
                    Jobs of same row background color are linked. From the table can even sort by these colors to see related jobs side by side by clicking the color wheel <span className={'color-wheel'} style={{display: 'inline-block'}}></span> icon.</div>
            }
        )

    }
    return _steps
}

export default JobDashboardTutorialSteps