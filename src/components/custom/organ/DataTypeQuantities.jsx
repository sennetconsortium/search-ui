import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import useLocalSettings from "../../../hooks/useLocalSettings";
import { getOrganDataTypeQuantities } from "../../../lib/services";
import SenNetAccordion from "../layout/SenNetAccordion";

const DataTypeQuantities = ({ id, ruiCode }) => {
    const router = useRouter();
    const {setLocalSettings} = useLocalSettings();
    const [dataTypes, setDataTypes] = useState(null);

    useEffect(() => {
        if (!ruiCode) {
            return;
        }

        const getQuantities = async () => {
            const qtys = await getOrganDataTypeQuantities(ruiCode);
            const res = Object.entries(qtys || []).map((qty) => {
                return { dataType: qty[0], count: qty[1] };
            });
            setDataTypes(res);
        };
        getQuantities();
    }, [ruiCode]);

    const searchUrl =
        "/search?size=n_10000_n&" +
        "filters%5B0%5D%5Bfield%5D=entity_type&filters%5B0%5D%5Bvalues%5D%5B0%5D=Dataset&" +
        "filters%5B0%5D%5Btype%5D=any&filters%5B1%5D%5Bfield%5D=origin_sample.organ&" +
        `filters%5B1%5D%5Bvalues%5D%5B0%5D=${ruiCode}&filters%5B1%5D%5Btype%5D=any&` +
        "sort%5B0%5D%5Bfield%5D=last_modified_timestamp&sort%5B0%5D%5Bdirection%5D=desc";

    const searchUrlForDatasetType = (datasetType) => {
        return (
            "/search?size=n_10000_n&" +
            "filters%5B0%5D%5Bfield%5D=entity_type&filters%5B0%5D%5Bvalues%5D%5B0%5D=Dataset&" +
            "filters%5B0%5D%5Btype%5D=any&filters%5B1%5D%5Bfield%5D=origin_sample.organ&" +
            `filters%5B1%5D%5Bvalues%5D%5B0%5D=${ruiCode}&filters%5B1%5D%5Btype%5D=any&` +
            `filters%5B2%5D%5Bfield%5D=dataset_type&filters%5B2%5D%5Bvalues%5D%5B0%5D=${datasetType}&filters%5B2%5D%5Btype%5D=any&` +
            "sort%5B0%5D%5Bfield%5D=last_modified_timestamp&sort%5B0%5D%5Bdirection%5D=desc"
        );
    };

    const handleSearchPageClick = (e) => {
        e.preventDefault();
        // Expand the relevant facets on the search page
        setLocalSettings("entities", {
            "entity_type": { isExpanded: true },
            "origin_sample.organ": { isExpanded: true },
        })
        router.push(searchUrl);
    }

    const handleDatasetTypeRowClick = (e, datasetType) => {
        e.preventDefault();
        // Expand the relevant facets on the search page
        setLocalSettings("entities", {
            "entity_type": { isExpanded: true },
            "origin_sample.organ": { isExpanded: true },
            "dataset_type": { isExpanded: true },
        })
        router.push(searchUrlForDatasetType(datasetType));
    }

    const columns = [
        {
            name: "Dataset Type",
            sortable: true,
            cell: (row, index, column, id) => {
                return (
                    <Link
                        href=""
                        onClick={(e) => handleDatasetTypeRowClick(e, row.dataType)}
                    >
                        {row.dataType}
                    </Link>
                );
            },
        },
        {
            name: "Count",
            selector: (row) => row.count,
            sortable: true,
        },
    ];

    return (
        <SenNetAccordion id={id} title="Dataset Types" afterTitle={undefined}>
            <div className="d-flex flex-row-reverse">
                <Link
                    className="btn btn-outline-primary rounded-0"
                    href=""
                    onClick={handleSearchPageClick}
                >
                    View on search page
                </Link>
            </div>
            {dataTypes != null && (
                <DataTable columns={columns} data={dataTypes} fixedHeader={true} pagination />
            )}
        </SenNetAccordion>
    );
};

export default DataTypeQuantities;
