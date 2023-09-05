import React, {Fragment, useContext, useEffect, useState} from 'react';
import {BoxArrowUpRight, EnvelopeFill, InfoCircleFill, Search, X} from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import SenNetAccordion from "../../layout/SenNetAccordion";
import Link from "next/link";
import DerivedContext from "../../../../context/DerivedContext";
import {fetchGlobusFilepath} from "../../../../lib/services";
import {FILE_KEY_SEPARATOR, getAssetsEndpoint, getAuth} from "../../../../config/config";
import SenNetPopover, {SenPopoverOptions} from "../../../SenNetPopover";
import {formatByteSize} from "../../js/functions";
import {Button, Row} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {Tree} from 'primereact/tree';
import $ from 'jquery'
import log from 'loglevel'

import 'primeicons/primeicons.css';

export const FileTreeView = ({data, selection = {}, keys = {files: 'files', uuid: 'uuid'},
                                 loadDerived = true, treeViewOnly = false, className = ''}) => {
    const [status, setStatus] = useState(null)
    const [filepath, setFilepath] = useState(null)
    const [treeData, setTreeData] = useState(null)
    const [filterValue, setFilterValue] = useState('')
    const [checked, setChecked] = useState(false)
    const [hasData, setHasData] = useState(false)

    const {
        isPrimaryDataset,
        derivedDataset
    } = useContext(DerivedContext)

    const getLength = (obj) => {
        if (!obj) return 0
        return Array.isArray(obj) ? obj.length : Object.keys(obj).length
    }

    useEffect( () => {
        async function fetchData() {
            await fetchGlobusFilepath(data[keys.uuid]).then((globusData) => {
                setStatus(globusData.status);
                setFilepath(globusData.filepath);
            });
        }

        fetchData()

        //Default to use files, otherwise wait until derivedDataset is populated
        if (data[keys.files] && getLength(data[keys.files])) {
            setHasData(true)
            buildTree(data[keys.uuid], data[keys.files])
        }
    }, [])

    useEffect(() => {
        if (loadDerived) {
            if (isPrimaryDataset && derivedDataset[keys.files] && getLength(derivedDataset[keys.files])) {
                setHasData(true)
                buildTree(derivedDataset[keys.uuid], derivedDataset[keys.files])
            }
        }

    }, [derivedDataset])

    const onExpand = (event) => {
        event.node.icon = 'pi pi-fw pi-folder-open'
    }

    const onCollapse = (event) => {
        event.node.icon = 'pi pi-fw pi-folder'
    }

    const myResetFunction = (options) => {
        let form = $('#file-search')[0]
        form.reset();
        options.reset();
    }

    const myFilterFunction = (event, options) => {
        let _filterValue = event.target.value;
        setFilterValue(_filterValue);
        options.filter(event);
    }

    const showHideQa = (event, options) => {
        if (event.currentTarget.checked) {
            setFilterValue("true");
            event.target.value = "true"
            options.filter(event);
        } else {
            myResetFunction(options)
        }
    }

    const nodeTemplate = (node, options) => {
        /* This node instance can do many things. See the API reference. */
        return (
            <Fragment>
                {node.icon.includes("file") ? (
                    <Row className={"w-100"}>
                        <Col md={8}>
                            <a target="_blank"
                               className={"icon_inline"}
                               href={`${getAssetsEndpoint()}${node.data.uuid}/${node.data.rel_path}?token=${getAuth()}`}><span
                                className="me-1">{node.label}</span>
                            </a>
                            <SenNetPopover className={`file-${node.label}`}
                                           trigger={SenPopoverOptions.triggers.hover}
                                           text={`${node.data.description}`}><InfoCircleFill/>
                            </SenNetPopover>
                        </Col>
                        <Col md={2} className={"text-end"}>
                            {node.data.is_qa_qc === "true" ? (
                                <span className="badge bg-secondary mx-2"> QA</span>) : (<></>)}
                        </Col>
                        <Col md={2} className={"text-end"}>
                            {formatByteSize(node.data.size)}
                        </Col>
                    </Row>) : (<>{node.label}</>)}
            </Fragment>
        );
    }

    const filterTemplate = (options) => {
        let {filterOptions} = options;
        return (
            <Form id="file-search">
                <Row className={"mb-4"}>
                    <Form.Group as={Col} md={6}>
                        <InputGroup>
                            <Form.Control
                                onChange={(e) => myFilterFunction(e, filterOptions)}
                                className="right-border-none rounded-0"
                                placeholder="Search"
                            />
                            <InputGroup.Text className={"transparent"}><Search/></InputGroup.Text>
                            <Button label="Reset" onClick={() => myResetFunction(filterOptions)}><X/></Button>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group as={Col} md={2}>
                        <ToggleButton
                            className="rounded-0"
                            id="toggle-check"
                            type="checkbox"
                            variant="outline-primary"
                            checked={checked}
                            value="1"
                            onChange={(e) => (setChecked(e.currentTarget.checked), showHideQa(e, filterOptions))}
                        >
                            Show QA files only
                        </ToggleButton>
                    </Form.Group>
                </Row>
            </Form>
        )
    }

    const formatKeyId = (str, str2) => str + FILE_KEY_SEPARATOR + str2

    function buildSubDirectory(uuid, file, data, directories, directory_name, id) {
        id = formatKeyId(id, directory_name)
        let sub_directory = {
            key: id,
            label: directory_name,
            icon: 'pi pi-fw pi-folder',
            data: {
                uuid: uuid,
                rel_path: file.rel_path,
                description: file.description || file.rel_path,
                is_qa_qc: file?.is_qa_qc?.toString(),
                size: file.size
            }
        };
        let sub_directory_children = []
        directories.shift()

        //Check if directory has already been added to `data`
        if (data.length > 0 && data.filter(e => e.label === directory_name).length > 0) {
            let alter_data = data.filter(e => e.label === directory_name)[0]
            if (alter_data.hasOwnProperty("children")) {
                let new_child = buildSubDirectory(uuid, file, alter_data.children, directories, directories[0], id)
                // new_child will be `undefined` if children is modified, no need to push
                if (new_child) {
                    alter_data.children.push(new_child)
                }
                return
            } else {
                if (directories.length > 0) {
                    alter_data.children = (buildSubDirectory(uuid, file, data, directories, directories[0], id))
                    return
                }
            }
        }
        if (directories.length > 0) {
            sub_directory_children.push(buildSubDirectory(uuid, file, data, directories, directories[0], id))
            sub_directory.children = sub_directory_children
        } else {
            sub_directory.icon = 'pi pi-fw pi-file'
        }
        return sub_directory
    }

    const buildTree = (uuid, files) => {
        try {
            let id = 1
            let data = [];

            files.forEach(file => {
                let directories = file.rel_path.split("/")
                if (directories.length === 0) {
                    data.push({
                        key: id,
                        label: file.rel_path,
                        icon: "pi pi-fw pi-file",
                        data: {
                            uuid: uuid,
                            rel_path: file.rel_path,
                            description: file.description || file.rel_path,
                            is_qa_qc: file?.is_qa_qc,
                            size: file.size
                        }
                    })
                    id++
                } else {
                    let sub_directory = buildSubDirectory(uuid, file, data, directories, directories[0], formatKeyId(uuid, id)) //use id to allow unique key name if files have same name
                    // If sub_directory is `undefined` then data was modified during the recursive call
                    if (sub_directory) {
                        id++
                        data.push(sub_directory)
                    }
                }
            });
            log.debug(data)
            setTreeData(data)
        } catch (e) {
            console.error(e)
        }
    }

    const treeView = (
        <Tree
            className={`c-treeView__main ${className}`}
            selectionMode={selection.mode}
            selectionKeys={selection.value}
            onSelectionChange={selection.setValue ? (e) => selection.setValue(e, selection.args) : undefined}
            value={treeData}
            nodeTemplate={nodeTemplate}
            filter={true}
            filterBy={"label,data.is_qa_qc"}
            filterTemplate={filterTemplate}
            onExpand={onExpand}
            onCollapse={onCollapse}
        />
    )

    if (treeViewOnly) {
        return treeView
    }

    return (<Fragment>
        <SenNetAccordion title={'Files'}>
            <Card border={'0'} className={"m-2 p-2"}>
                {status === 200 && filepath &&
                    <p className={'fw-light fs-6 mb-2'}>Files for this dataset are available through the Globus Research Data Management System.
                        Access <a
                            target="_blank"
                            href={filepath}
                            className="icon_inline"><span
                            className="me-1">{data.sennet_id} Globus</span> <BoxArrowUpRight/></a></p>}

                {status > 200 &&
                    <p className={'fw-light fs-6 mb-2'}>Access to the files on the Globus Research Management system is restricted. You may
                        not have
                        access to these files because the Consortium
                        is still curating data and/or the data is protected data that requires you to be a
                        member of the
                        Consortium "Protected Data Group".
                        Such protected data will be available via dbGaP in the future.
                        If you believe this to be an error, please contact <a className={'lnk--ic'}
                                                                              href={'mailto:help@sennetconsortium.org'}>help@sennetconsortium.org <EnvelopeFill/></a>
                    </p>}
            </Card>

            {hasData &&
                <Card border={'0'} className={"m-2 p-2"}>
                    {derivedDataset &&
                        <span className={'fw-light fs-6 mb-2'}>
                                Files from descendant
                                <Link target="_blank" href={{pathname: '/dataset', query: {uuid: derivedDataset.uuid}}}>
                                    <span className={'ms-2 me-2'}>{derivedDataset.sennet_id}</span>
                                </Link>
                            </span>
                    }
                    {treeData &&
                        <div className={"c-treeView"}>
                            {treeView}
                        </div>
                    }
                </Card>
            }
        </SenNetAccordion>
    </Fragment>)
}

export default FileTreeView