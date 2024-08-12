import { organDetails } from "@/config/organs";
import AppContext from "@/context/AppContext";
import { useContext, useEffect, useState } from "react";
import { nonSupportedRuiOrgans } from "../../config/config";

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
        organUberonUrl: "",
        hraSupport: false
    });
    const {cache} = useContext(AppContext)

    useEffect(() => {
        const organDetail = Object.values(organDetails).find((organDetail) => {
            return organDetail.urlParamName === urlParamName.toLowerCase();
        });
        if (!organDetail) {
            setOrganDetail(null);
            return;
        }
        organDetail.hraSupport = !nonSupportedRuiOrgans.includes(organDetail.ruiCode);

        const getOntologyOrgan = async (organDetail) => {
            const organs = cache.organs
            let organ = organs.find((organ) => {
                return organ.rui_code === organDetail.ruiCode;
            });
            organ = Object.entries(organ).mapKeys((k) => k.camelCase())

            const [_, __, organSide] = organ.term.match(/^((?:\w)+(?: \w+)?)(?: \((Right|Left)\))?$/)
            if (organSide) {
                organ.side = organSide
            }

            return setOrganDetail({ ...organDetail, ...organ });
        };
        getOntologyOrgan(organDetail);
    }, []);

    return { organDetail };
};

export default useOrganDetail;
