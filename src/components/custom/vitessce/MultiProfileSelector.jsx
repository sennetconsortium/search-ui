import Form from 'react-bootstrap/Form';

function MultiProfileSelector({vitessceConfig, profileIndex, setProfileIndex}) {

    console.log(profileIndex)
    return (
        <>
            <div className={'col text-end p-2 m-2'}>
                <Form.Select id={"vitessce-profile-selector"} onChange={e => {
                    setProfileIndex(e.target.value);
                    console.log(e.target.value)
                }}>
                    {vitessceConfig.map((profile, index) => (
                        <option key={`profile-${index}`} value={index}
                                selected={profileIndex === index}>{profile.name}</option>
                        ))}
                </Form.Select>
            </div>
        </>

    )

}

export default MultiProfileSelector