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
import {QuestionCircleFill, Search} from "react-bootstrap-icons";
import {config, RESULTS_PER_PAGE, SORT_OPTIONS} from "../../../../config/config";
import ClearSearchBox from "search-ui/components/core/ClearSearchBox";
import Facets from "search-ui/components/core/Facets";
import {TableResults, TableRowDetail} from "../../TableResults";
import log from "loglevel";

export default class AncestorId extends React.Component {
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
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Popover>
                                <Popover.Body>
                                    The SenNet Unique identifier of the direct origin entity,
                                    other sample or donor, where this sample came from.
                                </Popover.Body>
                            </Popover>
                        }
                    >
                        <QuestionCircleFill/>
                    </OverlayTrigger>
                </Form.Label>
                <InputGroup className="mb-3" id="direct_ancestor_uuid">
                    <Form.Control required type="text" placeholder=""
                                  onChange={e => this.props.onChange(e, e.target.id, e.target.value)}
                                  defaultValue={this.props.source?.hubmap_id}/>
                    <Button variant="primary" onClick={this.showModal}>
                        <Search/>
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
                        <SearchProvider config={config}>
                            <WithSearch mapContextToProps={({wasSearched, filters}) => ({wasSearched, filters})}>
                                {({wasSearched, filters}) => {
                                    return (
                                        <Layout
                                            header={
                                                <div>
                                                    <SearchBox/>
                                                    <ClearSearchBox/>
                                                </div>
                                            }
                                            sideContent={
                                                <>
                                                    {wasSearched && (
                                                        <Sorting
                                                            label={"Sort by"}
                                                            sortOptions={SORT_OPTIONS}
                                                        />
                                                    )}

                                                    <Facets fields={config.searchQuery}/>

                                                </>

                                            }
                                            bodyContent={
                                                <Results view={TableResults} filters={filters}
                                                         titleField={filters}
                                                         resultView={TableRowDetail}
                                                         urlField={this.changeSource}
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
                        <Button variant="secondary" onClick={this.hideModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}
