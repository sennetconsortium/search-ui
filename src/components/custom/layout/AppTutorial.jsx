import React, {useContext, useEffect, useState} from 'react'
import {getCookie, setCookie} from "cookies-next";
import TutorialSteps from "./TutorialSteps";
import AppContext from "../../../context/AppContext";
import Joyride from "react-joyride";
import {equals} from "../js/functions";
import {Alert} from 'react-bootstrap'
import {Binoculars} from "react-bootstrap-icons";

function AppTutorial() {
    const {isLoggedIn} = useContext(AppContext)
    const [steps, setSteps] = useState([])
    const [runTutorial, setRunTutorial] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [stepIndex, setStepIndex] = useState(0)
    const cookieKey = `tutorialCompleted_${isLoggedIn()}`

    useEffect(() => {
        const tutorialCompleted = getCookie(cookieKey)
        if (!tutorialCompleted) {
            setShowAlert(true)
            setSteps(TutorialSteps(isLoggedIn()))
        }
    }, [])

    const handleTutorial = () => {
        setShowAlert(false)
        // Set a quick timeout to allow the alert to close
        // first before Joyride calculates the highlight region
        setTimeout(()=> {
            setRunTutorial(true)
        }, 200)
    }
    return (
        <>
            <Alert variant="info" show={showAlert} onClose={() => setShowAlert(false)} dismissible className='text-center alert-hlf mb-4'>
                <Alert.Heading><Binoculars /> Getting Started</Alert.Heading>
                <p>Welcome to the SenNet Data Portal. Get a quick tour of different sections of the application.</p>
                <a className='btn btn-primary' onClick={() => handleTutorial()}>Begin Tutorial Tour</a>
            </Alert>
            {steps.length > 0 && <Joyride
                steps={steps}
                scrollOffset={80}
                callback={(res) => {
                    console.log(res)
                        if (equals(res.action, 'reset')) {
                            setCookie(cookieKey, true, {sameSite: 'Lax'})
                        }
                    }
                }
                run={runTutorial}
                showProgress={true}
                showSkipButton={true}
                locale={{last: 'Finish Tutorial'}}
                continuous
                styles={{
                    options: {
                        arrowColor: '#ffffff',
                        backgroundColor: '#ffffff',
                        primaryColor: '#0d6efd',
                        textColor: 'rgba(0, 0, 0, 0.87)',
                        width: 900,
                        zIndex: 1000,
                    }
                }}
            />}
        </>
    )
}


export default AppTutorial