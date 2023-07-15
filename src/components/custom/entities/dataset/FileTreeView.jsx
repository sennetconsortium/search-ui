import React, {Fragment, useContext, useEffect, useState} from 'react';
import {
    BoxArrowUpRight,
    CaretDownFill,
    CaretRightFill,
    EnvelopeFill,
    FileEarmark,
    Folder,
    Folder2Open,
    InfoCircleFill
} from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import SenNetAccordion from "../../layout/SenNetAccordion";
import Link from "next/link";
import DerivedContext from "../../../../context/DerivedContext";
import {fetchGlobusFilepath} from "../../../../lib/services";
import {getAssetsEndpoint, getAuth} from "../../../../config/config";
import SenNetPopover, {SenPopoverOptions} from "../../../SenNetPopover";
import {formatByteSize} from "../../js/functions";
import {Row, Table} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';
import {Tree} from "react-arborist";

export const FileTreeView = ({data}) => {
    const [status, setStatus] = useState(null)
    const [filepath, setFilepath] = useState(null)
    const [treeData, setTreeData] = useState(null)
    const [searchTerm, setSearchTerm] = useState(null)
    const [checked, setChecked] = useState(false);
    const {
        isPrimaryDataset,
        derivedDataset
    } = useContext(DerivedContext)

    useEffect(async () => {
        await fetchGlobusFilepath(data.uuid).then((globusData) => {
            setStatus(globusData.status);
            setFilepath(globusData.filepath);
        });

        //Default to use files, otherwise wait until derivedDataset is populated
        if (data.files && Object.keys(data.files).length) {
            buildTree(data.uuid, data.files)
        }
    }, [])

    useEffect(() => {
        if (isPrimaryDataset && derivedDataset.files && Object.keys(derivedDataset.files).length) {
            buildTree(derivedDataset.uuid, derivedDataset.files)
        }
    }, [derivedDataset])

    const showHideQa = (checked) => {
        if (checked) {
            setSearchTerm("true")
        } else {
            setSearchTerm(null)
        }
    }

    function FolderArrow({node}) {
        return (
            <span>
                {node.isOpen ? (<><CaretDownFill/> <Folder2Open/></>) : (<><CaretRightFill/>
                    <Folder/></>)} {node.data.name}
            </span>
        )
    }

    function Node({node, style, dragHandle}) {
        /* This node instance can do many things. See the API reference. */
        return (
            <div style={style} ref={dragHandle} onClick={() => node.toggle()}>
                {node.isLeaf ? (<Table borderless={true}>
                    <tbody>
                    <tr>
                        <td className={"p-0"}>
                            <FileEarmark/> <a target="_blank"
                                              className={"icon_inline"}
                                              href={`${getAssetsEndpoint()}${node.data.uuid}/${node.data.rel_path}?token=${getAuth()}`}><span
                            className="me-1">{node.data.name}</span>
                        </a>
                            <SenNetPopover className={`file-${node.data.name}`}
                                           trigger={SenPopoverOptions.triggers.hover}
                                           text={`${node.data.description}`}><InfoCircleFill/>
                            </SenNetPopover>
                        </td>
                        <td className={"text-end p-0"}>
                            {node.data.is_qa_qc === true ? (
                                <span className="badge bg-secondary mx-2"> QA</span>) : (<></>)}
                        </td>
                        <td className={"text-end p-0"}>
                            {formatByteSize(node.data.size)}
                        </td>
                    </tr>
                    </tbody>
                </Table>) : (<FolderArrow node={node}/>)}
            </div>
        );
    }

    function buildSubDirectory(uuid, file, data, directories, directory_name, id) {
        if(directory_name==="TWKB-SN001H1-Md1A3Y1K2N1Z1_1Bmn1_1_S1_L004_R1_001_fastqc.html" ) {
            console.log("here")
        }
        id = id + directory_name
        let sub_directory = {
            id: id,
            name: directory_name,
            uuid: uuid,
            rel_path: file.rel_path,
            description: file.description,
            is_qa_qc: file.is_qa_qc,
            size: file.size
        };
        let sub_directory_children = []
        directories.shift()

        //Check if directory has already been added to `data`
        if (data.length>0 && data.filter(e => e.name === directory_name).length > 0) {
            let alter_data = data.filter(e => e.name === directory_name)[0]
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
        }
        return sub_directory
    }

    const buildTree = (uuid, files) => {
        let id = 1
        let data = [];

        files.forEach(file => {
            let directories = file.rel_path.split("/")
            if (directories.length === 0) {
                data.push({
                    id: id,
                    name: file.rel_path,
                    uuid: uuid,
                    rel_path: file.rel_path,
                    description: file.description,
                    is_qa_qc: file.is_qa_qc,
                    size: file.size
                })
                id++
            } else {
                let sub_directory = buildSubDirectory(uuid, file, data, directories, directories[0], "")
                // If sub_directory is `undefined` then data was modified during the recursive call
                if (sub_directory) {
                    id++
                    data.push(sub_directory)
                }
            }
        });

        console.log(data)

        setTreeData(data)
    }

    return <Fragment>
        <SenNetAccordion title={'Files'}>
            {!!((data.files && Object.keys(data.files).length) || (isPrimaryDataset && derivedDataset?.files && Object.keys(derivedDataset?.files).length)) &&
                <Card border={'0'} className={"m-2 p-2"}>
                    {derivedDataset &&
                        <span className={'fw-light fs-6 mb-2'}>
                                Derived from
                                <Link target="_blank" href={{pathname: '/dataset', query: {uuid: derivedDataset.uuid}}}>
                                    <span className={'ms-2 me-2'}>{derivedDataset.sennet_id}</span>
                                </Link>
                            </span>
                    }
                    <Row className={"mb-4"}>
                        <Form.Group as={Col} md={6}>
                            <Form.Control
                                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                                className="form-control rounded-0"
                                placeholder="Search"
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={2}>
                            <ToggleButton
                                className="rounded-0"
                                id="toggle-check"
                                type="checkbox"
                                variant="outline-primary"
                                checked={checked}
                                value="1"
                                onChange={(e) => (setChecked(e.currentTarget.checked), showHideQa(e.currentTarget.checked))}
                            >
                                Show QA files only
                            </ToggleButton>

                        </Form.Group>
                    </Row>
                    {treeData &&
                        <div className={"tree_container"}>
                            <Tree
                                data={treeData}
                                openByDefault={false}
                                disableDrag={true}
                                disableDrop={true}
                                disableEdit={true}
                                width={"max"}
                                height={250}
                                indent={24}
                                rowHeight={36}
                                overscanCount={1}
                                paddingTop={30}
                                paddingBottom={10}
                                padding={0 /* sets both */}
                                searchTerm={searchTerm}
                            >
                                {Node}
                            </Tree>
                        </div>
                    }
                </Card>
            }
            <Card border={'0'}>
                <Card.Body>
                    {status === 200 && filepath &&
                        <p>Files are available through the Globus Research Data Management System. Access
                            dataset <a
                                target="_blank"
                                href={filepath}
                                className="icon_inline"><span
                                className="me-1">{data.sennet_id}</span> <BoxArrowUpRight/></a></p>}

                    {status > 200 &&
                        <p>Access to the files on the Globus Research Management system is restricted. You may
                            not have
                            access to these files because the Consortium
                            is still curating data and/or the data is protected data that requires you to be a
                            member of the
                            Consortium "Protected Data Group".
                            Such protected data will be available via dbGaP in the future.
                            If you believe this to be an error, please contact <a className={'lnk--ic'}
                                                                                  href={'mailto:help@sennetconsortium.org'}>help@sennetconsortium.org <EnvelopeFill/></a>
                        </p>}
                </Card.Body>
            </Card>
        </SenNetAccordion>
    </Fragment>
}

export default FileTreeView