import _ from "lodash";
import { useEffect, useState } from "react";
import { organDetails } from "../../config/organs";
import { getOrgans } from "../../lib/ontology";
import { getDatasetQuantities } from "../../lib/services";

const useOrganList = () => {
    const [organs, setOrgans] = useState([]);

    useEffect(() => {
        const retrieveOrgans = async () => {
            let organs = await getOrgans();
            organs = organs.map((organ) => {
                const o = _.mapKeys(organ, (v, k) => _.camelCase(k));
                return {...o, ...organDetails[o.ruiCode]}
            });
            setOrgans(organs);

            const datasetQtys = await getDatasetQuantities();
            if (!datasetQtys) {
                return;
            }
            organs = organs.map((organ) => {
                return {
                    ...organ,
                    datasetQty: datasetQtys[organ.ruiCode] || 0,
                };
            })
            setOrgans(organs);
        };

        retrieveOrgans();
    }, []);

    return { organs };
};

export default useOrganList;
