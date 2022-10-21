import { useContext } from 'react'
import {Col, Container, Row} from 'react-bootstrap'
import AppContext from '../../../context/AppContext'

function EntityViewHeader({entity, data, isEditMode}) {
  const {_t } = useContext(AppContext)
  return (
    <Container className="px-0" fluid={true}>
        <Row md={12}>
            <h4>{_t(`${entity} Information`)}</h4>
        </Row>
        {isEditMode &&
            <>
                <Row>
                    <Col md={6}><h5>{_t('SenNet ID')}: {data.sennet_id}</h5></Col>
                    <Col md={6}><h5>{_t('Group')}: {data.group_name}</h5></Col>
                </Row>
                <Row>
                    <Col md={6}><h5>{_t('Entered By')}: {data.created_by_user_email}</h5></Col>
                    <Col md={6}><h5>{_t('Entry Date')}: {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    }).format(data.created_timestamp)}</h5></Col>
                </Row>
            </>
        }

    </Container>
  )
}

export default EntityViewHeader