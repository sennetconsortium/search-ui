import React, {useContext} from 'react';
import {Form} from 'react-bootstrap';
import {Results, SearchBox} from "@elastic/react-search-ui";
import {Layout} from "@elastic/react-search-ui-views";
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {PlusLg, QuestionCircleFill, Search} from "react-bootstrap-icons";
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

function BodyContent({ handleChangeAncestor }) {
    const { wasSearched, filters } = useContext(SearchUIContext)

    return (
        <div
            className="js-gtm--results"
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

export default class AncestorIds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHideModal: false,
        };

        // Return an array of data types that should be excluded from search
        // const excludeDataTypes = getDataTypesByProperty("vis-only", true)
        const excludeNonPrimaryTypes = getDataTypesByProperty("primary", false)
        valid_dataset_ancestor_config['searchQuery']['excludeFilters'].push({
            keyword: "data_types.keyword",
            value: excludeNonPrimaryTypes
        });
    }

    handleSearchFormSubmit(event, onSubmit) {
        onSubmit(event)
    }

    showModal = () => {
        this.setState({showHideModal: true})
        // Enable addons for facets
        addons('dataset')
    }
    hideModal = () => {
        this.setState({showHideModal: false})
        // Reset addons for facets
        delete window.addons['dataset']
    }

    // Handles when updates are made to `Ancestor ID` when the search feature is used
    changeAncestor = async (e, ancestorId) => {
        let old_uuids = [];
        const $modalTable = $('.modal-content .rdt_Table')
        if (this.props.values.direct_ancestor_uuids !== undefined) {
            old_uuids = [...this.props.values.direct_ancestor_uuids]
        }
        if (old_uuids.indexOf(ancestorId) === -1) {
            old_uuids.push(ancestorId);
            this.props.onChange(e, 'direct_ancestor_uuids', old_uuids);
            this.props.fetchAncestors([ancestorId]);
            this.hideModal();
            $modalTable.removeAttr('data-tooltipText')
        } else {
            $modalTable.attr('data-tooltipText', 'That ancestor has already been selected.')
        }
    }

    render() {
        return (
            <>
                <Form.Label>Ancestors(s) <span
                    className="required">* </span>
                    <SenNetPopover className={'direct_ancestor_uuids'} text={<>
                        The SenNet ID(s) of ancestor samples or data from which this data was derived. At least one
                        ancestor is required, but multiple may be specified.
                    </>}>
                        <QuestionCircleFill/>
                    </SenNetPopover>
                </Form.Label>
                <Form.Group controlId="direct_ancestor_uuids">

                    <Form.Control style={{display: 'none'}}
                                  isInvalid={this.props.values.direct_ancestor_uuids === undefined || this.props.values.direct_ancestor_uuids.length === 0}></Form.Control>
                    <Form.Control.Feedback type="invalid">
                        Please add at least one ancestor
                    </Form.Control.Feedback>
                </Form.Group>

                {/*Ancestor Information Box*/}
                {this.props.ancestors &&
                    <AncestorsTable values={this.props.values} onChange={this.props.onChange}
                                    ancestors={this.props.ancestors} deleteAncestor={this.props.deleteAncestor}/>
                }

                <InputGroup className="mb-3" id="direct_ancestor_uuid_button">
                    <Button variant="outline-primary rounded-0 mt-1" onClick={this.showModal} aria-controls='js-modal'>
                        Add another ancestor <PlusLg/>
                    </Button>
                </InputGroup>

                <Modal
                    size="xxl"
                    show={this.state.showHideModal}
                    onHide={this.hideModal}
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
                                                    onSubmit={e => this.handleSearchFormSubmit(e, onSubmit)}>
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
                                                                className={"transparent"}><Search/></InputGroup.Text>
                                                            <Button variant="outline-primary"
                                                                    className={"rounded-1"}
                                                                    onClick={e => this.handleSearchFormSubmit(e, onSubmit)}>Search</Button>
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
                                    <BodyContent handleChangeAncestor={this.changeAncestor} />
                                }
                            />
                        </SearchUIContainer>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary rounded-0" onClick={this.hideModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}
