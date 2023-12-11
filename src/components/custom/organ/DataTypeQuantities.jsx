import Link from "next/link";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getOrganDataTypeQuantities } from "../../../lib/services";
import SenNetAccordion from "../layout/SenNetAccordion";

const DataTypeQuantities = ({ id, ruiCode }) => {
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

    const columns = [
        {
            name: "Dataset Type",
            selector: (row) => row.dataType,
            sortable: true,
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
                    href={searchUrl}
                >
                    View on search page
                </Link>
            </div>
            {dataTypes != null && (
                <DataTable columns={columns} data={dataTypes} pagination />
            )}
        </SenNetAccordion>
    );
};

export default DataTypeQuantities;
