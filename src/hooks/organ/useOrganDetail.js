import _ from "lodash";
import { useEffect, useState } from "react";
import { organDetails } from "../../config/organs";
import { getOrgans } from "../../lib/ontology";
import { supportedRuiSources } from "../../config/config";

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
        hraSupport: false
    });

    useEffect(() => {
        const organDetail = Object.entries(organDetails).find((organDetail) => {
            return organDetail[1].urlParamName === urlParamName.toLowerCase();
        });
        organDetail[1].hraSupport = !supportedRuiSources.includes(organDetail[1].ruiCode);

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

            let uberonUrl = undefined;
            if (organ.organUberon || organ.organCui) {
                const path = organ.organUberon ?? organ.organCui;
                const uberonPath = path.replace(":", "_");
                uberonUrl = `http://purl.obolibrary.org/obo/${uberonPath}`;
            }
            return setOrganDetail({ ...organDetail, ...organ, uberonUrl });
        };
        getOntologyOrgan(organDetail[1]);
    }, []);

    return { organDetail };
};

export default useOrganDetail;
