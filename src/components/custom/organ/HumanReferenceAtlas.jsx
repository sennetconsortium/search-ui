import SenNetAccordion from '../layout/SenNetAccordion'
import CCFOrganInfo from './CCFOrganInfo'

const HumanReferenceAtlas = ({ id, organ }) => {
    return (
        <SenNetAccordion
            id={id}
            title='Human Reference Atlas'
            afterTitle={undefined}
        >
            <CCFOrganInfo organ={organ} />
        </SenNetAccordion>
    )
}

export default HumanReferenceAtlas
