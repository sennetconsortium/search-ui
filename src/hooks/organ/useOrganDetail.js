import _ from "lodash";
import { useEffect, useState } from "react";
import { organDetails } from "../../config/organs";
import { getOrgans } from "../../lib/ontology";

const useOrganDetail = (urlParamName) => {
    const [organDetail, setOrganDetail] = useState({
        code: "",
        organCui: "",
        organUberon: "",
        ruiCode: "",
        sab: "",
        term: "",
        icon: "",
        searchUrl: "",
        urlParamName: "",
        uberonUrl: "",
    });

    useEffect(() => {
        const organDetail = Object.entries(organDetails).find((organDetail) => {
            return organDetail[1].urlParamName === urlParamName.toLowerCase();
        });

        if (!organDetail) {
            setOrganDetail(null);
            return;
        }

        const getOntologyOrgan = async (organDetail) => {
            const organs = await getOrgans();
            let organ = organs.find((organ) => {
                return organ.rui_code === organDetail.ruiCode;
            });
            organ = _.mapKeys(organ, (v, k) => _.camelCase(k));

            const uberonPath = organ.organUberon.replace(":", "_");
            const uberonUrl = `http://purl.obolibrary.org/obo/${uberonPath}`;
            return setOrganDetail({ ...organDetail, ...organ, uberonUrl });
        };
        getOntologyOrgan(organDetail[1]);
    }, []);

    return { organDetail };
};

export default useOrganDetail;
