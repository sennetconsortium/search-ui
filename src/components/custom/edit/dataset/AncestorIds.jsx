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
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {PlusLg, QuestionCircleFill} from "react-bootstrap-icons";
import {ancestor_config, dataset_ancestor_config, RESULTS_PER_PAGE, SORT_OPTIONS} from "../../../../config/config";
import Facets from "search-ui/components/core/Facets";
import {TableResults, TableRowDetail} from "../../TableResults";
import AncestorsTable from "./AncestorsTable";
import CustomClearSearchBox from "../../layout/CustomClearSearchBox";

export default class AncestorIds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHideModal: false,
        };
    }

    showModal = () => {
        this.setState({showHideModal: true})
    }
    hideModal = () => {
        this.setState({showHideModal: false})
    }

    // Handles when updates are made to `Ancestor ID` when the search feature is used
    changeAncestor = async (e, ancestorId) => {
        let old_uuids = [];
        if (this.props.values.direct_ancestor_uuids !== undefined) {
            old_uuids = [...this.props.values.direct_ancestor_uuids]
        }
        old_uuids.push(ancestorId);
        this.props.onChange(e, 'direct_ancestor_uuids', old_uuids);
        this.props.fetchAncestors([ancestorId]);
        this.hideModal();
    }

    render() {
        return (
            <>
                <Form.Label>Ancestors(s) <span
                    className="required">* </span>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Popover>
                                <Popover.Body>
                                    The ancestor samples or data from which this data was derived. At least one
                                    ancestor is required, but multiple may be specified.
                                </Popover.Body>
                            </Popover>
                        }
                    >
                        <QuestionCircleFill/>
                    </OverlayTrigger>
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
                    size="xl"
                    show={this.state.showHideModal}
                    onHide={this.hideModal}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Body>
                        <SearchProvider config={dataset_ancestor_config}>
                            <WithSearch mapContextToProps={({wasSearched, filters}) => ({wasSearched, filters})}>
                                {({wasSearched, filters}) => {
                                    return (
                                        <Layout
                                            header={
                                                <div className="search-box-header">
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
                                                <>
                                                    <CustomClearSearchBox/>

                                                    {wasSearched && (
                                                        <Sorting
                                                            label={"Sort by"}
                                                            sortOptions={SORT_OPTIONS}
                                                        />
                                                    )}

                                                    <Facets fields={ancestor_config.searchQuery} filters={filters}/>

                                                </>

                                            }
                                            bodyContent={
                                                <Results view={TableResults} filters={filters}
                                                         titleField={filters}
                                                         resultView={TableRowDetail}
                                                         urlField={this.changeAncestor}
                                                />
                                            }
                                            bodyHeader={
                                                <React.Fragment>
                                                    {wasSearched && <PagingInfo/>}
                                                    {<Paging/>}
                                                    {wasSearched && <ResultsPerPage options={RESULTS_PER_PAGE}/>}
                                                </React.Fragment>
                                            }
                                            bodyFooter={<Paging/>}
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
