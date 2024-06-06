import React, {useContext, useEffect, useState} from 'react';
import {Form} from 'react-bootstrap';
import {Results, SearchBox} from "@elastic/react-search-ui";
import {Layout} from "@elastic/react-search-ui-views";
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {valid_dataset_ancestor_config} from "../../../../config/config";
import {TableResultsEntities} from '../../TableResultsEntities'
import AncestorsTable from "./AncestorsTable";
import CustomClearSearchBox from "../../layout/CustomClearSearchBox";
import addons from "../../js/addons/addons";
import $ from 'jquery'
import SelectedFilters from "../../layout/SelectedFilters";
import {getDataTypesByProperty, getUBKGFullName} from "../../js/functions";
import SenNetPopover from "../../../SenNetPopover";
import SearchUIContainer from 'search-ui/components/core/SearchUIContainer';
import FacetsContent from '../../search/FacetsContent';
import SearchUIContext from 'search-ui/components/core/SearchUIContext';
import AppContext from "../../../../context/AppContext";

function BodyContent({ handleChangeAncestor }) {
    const { wasSearched, filters } = useContext(SearchUIContext)
    const {hasAuthenticationCookie, isUnauthorized } = useContext(AppContext)
    const addConditional = (key, entity) => {
        valid_dataset_ancestor_config['searchQuery']['conditionalFacets'][key] = ({filters}) => {
            return hasAuthenticationCookie() && !isUnauthorized() &&
                filters.some((filter) => filter.field === "entity_type" && filter.values.includes(entity))
        }
    }

    addConditional('rui_location','Sample' )
    addConditional('ancestors.rui_location', 'Dataset')

    return (
        <div
            data-js-ada='.rdt_TableCell'
            data-js-tooltip='{"trigger":".rdt_TableBody [role=\"row\"]", "diffY": -81, "data":".modal-content .rdt_Table", "class": "is-error"}'
        >
            {wasSearched && <Results filters={filters}
                                     inModal={true}
                                     onRowClicked={handleChangeAncestor}
                                     view={TableResultsEntities} />}
        </div>
    )
}

export default function AncestorIds({values, onChange, fetchAncestors, deleteAncestor, ancestors, otherWithAdd, onShowModal, formLabelPlural,
                                        formLabel = 'ancestor', controlId = 'direct_ancestor_uuids', dataset_category, addButtonDisabled}) {
    const [showHideModal, setShowHideModal] = useState(false)

    useEffect(() => {
        // Return an array of data types that should be excluded from search
        // const excludeDataTypes = getDataTypesByProperty("vis-only", true)
        const excludeNonPrimaryTypes = getDataTypesByProperty("primary", false)
        valid_dataset_ancestor_config['searchQuery']['excludeFilters'].push({
            keyword: "dataset_type.keyword",
            value: excludeNonPrimaryTypes
        });
    }, [])


    const handleSearchFormSubmit = (event, onSubmit) => {
        onSubmit(event)
    }

    const showModal = () => {
        if (onShowModal) {
            onShowModal()
        }
        setShowHideModal(true)
        // Enable addons for facets
        addons('dataset')
    }

    const hideModal = () => {
        setShowHideModal(false)
        // Reset addons for facets
        delete window.addons['dataset']
    }

    // Handles when updates are made to `Ancestor ID` when the search feature is used
    const changeAncestor = async (e, ancestorId) => {
        let old_uuids = [];
        const $modalTable = $('.modal-content .rdt_Table')
        if (values[controlId] !== undefined) {
            old_uuids = [...values[controlId]]
        }
        if (old_uuids.indexOf(ancestorId) === -1) {
            old_uuids.push(ancestorId);
            onChange(e, controlId, old_uuids);
            fetchAncestors([ancestorId]);
            hideModal();
            $modalTable.removeAttr('data-tooltipText')
        } else {
            $modalTable.attr('data-tooltipText', `That ${formLabel} has already been selected.`)
        }
    }

    return (
        <>
            <Form.Label>{`${formLabelPlural ? formLabelPlural.upperCaseFirst() : `${formLabel.upperCaseFirst()}(s)`}`} <span
                className="required">* </span>
                <SenNetPopover className={controlId} text={<>
                    The SenNet ID(s) of ancestor samples or data from which this data was derived. At least one
                    ancestor is required, but multiple may be specified.
                </>}>
                    <i className="bi bi-question-circle-fill"></i>
                </SenNetPopover>
            </Form.Label>
            <Form.Group controlId="direct_ancestor_uuids">

                <Form.Control style={{display: 'none'}}
                              isInvalid={values[controlId] === undefined || values[controlId].length === 0}></Form.Control>
                <Form.Control.Feedback type="invalid">
                    Please add at least one {formLabel}
                </Form.Control.Feedback>
            </Form.Group>

            {/*Ancestor Information Box*/}
            {ancestors && ancestors.length !== 0 &&
                <AncestorsTable controlId={controlId} formLabel={formLabel} values={values} onChange={onChange}
                                ancestors={ancestors} deleteAncestor={deleteAncestor} dataset_category={dataset_category}/>
            }

            {/*Disable the button if the dataset is not 'primary'*/}
            <InputGroup className="mb-3 ancestor-ctas" id="direct_ancestor_uuid_button">
                <Button variant="outline-primary rounded-0 mt-1" onClick={showModal} aria-controls='js-modal' disabled={addButtonDisabled}>
                    Add another {formLabel} <i className="bi bi-plus-lg"></i>
                </Button>
                {otherWithAdd}
            </InputGroup>



            <Modal
                size="xxl"
                show={showHideModal}
                onHide={hideModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Body>
                    <SearchUIContainer config={valid_dataset_ancestor_config} name={undefined}>
                        <Layout
                            header={
                                <div className="search-box-header js-gtm--search">
                                    <SearchBox
                                        view={({onChange, value, onSubmit}) => (
                                            <Form
                                                onSubmit={e => handleSearchFormSubmit(e, onSubmit)}>
                                                <Form.Group controlId="search">
                                                    <InputGroup>
                                                        <Form.Control
                                                            value={value}
                                                            onChange={(e) => onChange(e.currentTarget.value)}
                                                            className="right-border-none form-control form-control-lg rounded-1"
                                                            placeholder="Search"
                                                            autoFocus={true}
                                                        />
                                                        <InputGroup.Text
                                                            className={"transparent"}><i
                                                            className="bi bi-search"></i></InputGroup.Text>
                                                        <Button variant="outline-primary"
                                                                className={"rounded-1"}
                                                                onClick={e => handleSearchFormSubmit(e, onSubmit)}>Search</Button>
                                                    </InputGroup>
                                                </Form.Group>
                                            </Form>
                                        )}
                                    />
                                </div>
                            }
                            sideContent={
                                <div data-js-ada='facets'>
                                    <CustomClearSearchBox />

                                    <SelectedFilters />

                                    <FacetsContent transformFunction={getUBKGFullName} />
                                </div>
                            }
                            bodyContent={
                                <BodyContent handleChangeAncestor={changeAncestor} />
                            }
                        />
                    </SearchUIContainer>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary rounded-0" onClick={hideModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
