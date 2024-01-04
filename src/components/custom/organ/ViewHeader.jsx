import { BoxArrowUpRight } from "react-bootstrap-icons";

const OrganViewHeader = ({ organ }) => {
    return (
        <div style={{ width: "100%" }}>
            {/* Title */}
            <h4>Organ</h4>
            <h3>{organ.term}</h3>

            {/* Badges */}
            <div className="row mb-2" style={{ minHeight: "38px" }}>
                <div className="col-md-6 col-sm-12 entity_subtitle icon_inline">
                    <h5 className="title_badge">
                        <span className="badge bg-secondary">
                            <a
                                href={organ.uberonUrl}
                                className="icon_inline text-white"
                            >
                                {organ.organUberon}
                            </a>
                            &nbsp;
                            <BoxArrowUpRight className="lnk--white" />
                        </span>
                    </h5>
                </div>
            </div>
        </div>
    );
};

export default OrganViewHeader;
