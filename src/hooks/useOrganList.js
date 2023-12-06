import { useEffect, useState } from "react";
import { organDetails } from "../config/organs";
import { getOrgans } from "../lib/ontology";
import { getDatasetQuantities } from "../lib/services";

const useOrganList = () => {
    const [organs, setOrgans] = useState([]);

    useEffect(() => {
        const retrieveOrgans = async () => {
            let organs = await getOrgans();
            organs = organs.map((organ) => {
                return {...organ, ...organDetails[organ.rui_code]}
            });
            setOrgans(organs);

            const datasetQtys = await getDatasetQuantities();
            if (!datasetQtys) {
                return;
            }
            organs = organs.map((organ) => {
                return {
                    ...organ,
                    datasetQty: datasetQtys[organ.rui_code] || 0,
                };
            })
            setOrgans(organs);
        };

        retrieveOrgans();
    }, []);

    return { organs };
};

export default useOrganList;
