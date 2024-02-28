import Link from "next/link";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getSamplesByOrgan } from "../../../lib/services";
import SenNetAccordion from "../layout/SenNetAccordion";
import { APP_ROUTES } from "../../../config/constants";
import ClipboardCopy from "../../ClipboardCopy";

const Samples = ({ id, ruiCode }) => {
    const [samples, setSamples] = useState(null);

    useEffect(() => {
        if (!ruiCode) {
            return;
        }

        const getSamples = async () => {
            const res = await getSamplesByOrgan(ruiCode);
            setSamples(res);
        };
        getSamples();
    }, [ruiCode]);

    const sampleUrl = (uuid) => {
        return `${APP_ROUTES.sample}?uuid=${uuid}`;
    };

    const columns = [
        {
            name: "SenNet ID",
            sortable: true,
            cell: (row, index, column, id) => {
                return (
                    <span data-field='sennet_id'>
                    <Link href={sampleUrl(row.uuid)}>
                        {row.sennetId}
                    </Link> <ClipboardCopy text={(row.sennetId)} title={'Copy SenNet ID {text} to clipboard'}/>
                     </span>
                );
            },
        },
        {
            name: "Lab ID",
            selector: (row) => row.labId,
            sortable: true,
        },
        {
            name: "Group",
            selector: (row) => row.groupName,
            sortable: true,
        },
        {
            name: "Last Touch",
            selector: (row) =>
                new Date(row.lastTouch).toLocaleDateString("en-US"),
            sortable: true,
        },
    ];

    const searchUrl =
        "/search?size=n_10000_n&" +
        "filters%5B0%5D%5Bfield%5D=entity_type&filters%5B0%5D%5Bvalues%5D%5B0%5D=Sample&" +
        "filters%5B0%5D%5Btype%5D=any&filters%5B1%5D%5Bfield%5D=organ&" +
        `filters%5B1%5D%5Bvalues%5D%5B0%5D=${ruiCode}&filters%5B1%5D%5Btype%5D=any&` +
        "sort%5B0%5D%5Bfield%5D=last_modified_timestamp&sort%5B0%5D%5Bdirection%5D=desc";

    return (
        <SenNetAccordion id={id} title="Samples" afterTitle={undefined}>
            <div className="d-flex flex-row-reverse">
                <Link
                    className="btn btn-outline-primary rounded-0"
                    href={searchUrl}
                >
                    View on search page
                </Link>
            </div>
            {samples != null && (
                <DataTable columns={columns} data={samples} fixedHeader={true} pagination />
            )}
        </SenNetAccordion>
    );
};

export default Samples;
