import { organDetails } from "@/config/organs";
import AppContext from "@/context/AppContext";
import { useContext, useEffect, useState } from "react";

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
    });
    const {cache} = useContext(AppContext)

    useEffect(() => {
        const organDetail = Object.entries(organDetails).find((organDetail) => {
            return organDetail[1].urlParamName === urlParamName.toLowerCase();
        });

        if (!organDetail) {
            setOrganDetail(null);
            return;
        }

        const getOntologyOrgan = async (organDetail) => {
            const organs = cache.organs
            let organ = organs.find((organ) => {
                return organ.rui_code === organDetail.ruiCode;
            });
            organ = Object.entries(organ).mapKeys((k) => k.camelCase())

            return setOrganDetail({ ...organDetail, ...organ });
        };
        getOntologyOrgan(organDetail[1]);
    }, []);

    return { organDetail };
};

export default useOrganDetail;
