import React from 'react';
import {Form} from 'react-bootstrap';
import {
    Paging,
    PagingInfo,
    Results,
    ResultsPerPage,
    SearchBox,
    SearchProvider,
    Sorting,
    WithSearch
} from "@elastic/react-search-ui";
import {Layout} from "@elastic/react-search-ui-views";
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {QuestionCircleFill, Search} from "react-bootstrap-icons";
import {exclude_dataset_config} from "../../../../config/config";
import Facets from "search-ui/components/core/Facets";
import {TableResultsEntities} from '../../TableResultsEntities';
import CustomClearSearchBox from "../../layout/CustomClearSearchBox";
import addons from "../../js/addons/addons";
import SelectedFilters from "../../layout/SelectedFilters";
import {getUBKGFullName} from "../../js/functions";
import SenNetPopover from "../../../SenNetPopover";

export default class AncestorId extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHideModal: false,
        };
    }

    showModal = () => {
        this.setState({showHideModal: true})
        // Enable addons for facets
        addons('sample')
    }
    hideModal = () => {
        this.setState({showHideModal: false})
        // Reset addons for facets
        delete window.addons['sample']
    }

    // Handles when updates are made to `Source ID` when the search feature is used
    changeSource = async (e, sourceId) => {
        this.props.onChange(e, 'direct_ancestor_uuid', sourceId);
        this.props.fetchSource(sourceId);
        this.hideModal();
    }

    render() {
        return (
            <>
                <Form.Label>Ancestor ID <span
                    className="required">* </span>
                    <SenNetPopover className={'direct_ancestor_uuid'}
                                   text={<>The SenNet ID of the entity that this <code>Sample</code> came from. Must be
                                       another <code>Sample</code> or <code>Source</code>.</>}>
                        <QuestionCircleFill/>
                    </SenNetPopover>
                </Form.Label>
                <InputGroup className="mb-3" id="direct_ancestor_uuid">
                    <Form.Control required type="text" placeholder=""
                                  disabled
                                  onChange={e => this.props.onChange(e, e.target.id, e.target.value)}
                                  defaultValue={this.props.source?.sennet_id}/>
                    <Button variant="primary" onClick={this.showModal}>
                        <Search/>
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
                        <SearchProvider config={exclude_dataset_config}>
                            <WithSearch mapContextToProps={({wasSearched, filters}) => ({wasSearched, filters})}>
                                {({wasSearched, filters}) => {
                                    return (
                                        <Layout
                                            header={
                                                <div className="search-box-header js-gtm--search">
                                                    <SearchBox
                                                        view={({onChange, value, onSubmit}) => (
                                                            <Form onSubmit={onSubmit}>
                                                                <Form.Group controlId="search">
                                                                    <InputGroup>
                                                                        <Form.Control
                                                                            value={value}
                                                                            onChange={(e) => onChange(e.currentTarget.value)}
                                                                            className="form-control form-control-lg rounded-0"
                                                                            placeholder="Search"
                                                                            autoFocus={true}
                                                                        />
                                                                        <Button variant="outline-primary"
                                                                                className={"rounded-0"}
                                                                                onClick={onSubmit}>Search</Button>
                                                                    </InputGroup>
                                                                </Form.Group>
                                                            </Form>
                                                        )}
                                                    />
                                                </div>
                                            }
                                            sideContent={
                                                <div data-js-ada='facets'>
                                                    <CustomClearSearchBox/>
                                                    <SelectedFilters/>
                                                    <Facets fields={exclude_dataset_config.searchQuery}
                                                            filters={filters}
                                                            transformFunction={getUBKGFullName}
                                                    />

                                                </div>

                                            }
                                            bodyContent={
                                                <div className="js-gtm--results" data-js-ada='.rdt_TableCell'>
                                                    <Results view={TableResultsEntities} filters={filters} inModal={true}
                                                             onRowClicked={this.changeSource}
                                                    />
                                                </div>
                                            }

                                        />
                                    );
                                }}
                            </WithSearch>
                        </SearchProvider>
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
