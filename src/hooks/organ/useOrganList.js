import {useContext, useEffect, useState} from "react";
import {organDetails} from "../../config/organs";
import {getDatasetQuantities} from "../../lib/services";
import AppContext from "@/context/AppContext";

const useOrganList = () => {
    const [organs, setOrgans] = useState([]);
    const {cache} = useContext(AppContext)


    useEffect(() => {
        const retrieveOrgans = async () => {
            let organs = cache.organs;
            organs = organs.map((organ) => {
                const o = Object.entries(organ).mapKeys((k) => k.camelCase())
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
