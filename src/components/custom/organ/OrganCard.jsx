import Image from "next/image";
import { Card } from "react-bootstrap";

const OrganCard = ({ organ }) => {
    const getDisplayQty = (qty) => {
        if (qty === 1) {
            return "1 dataset";
        } else {
            return `${qty} datasets`;
        }
    };

    return (
        <Card className="p-4 rounded-0 h-100 text-dark card-hover">
            <Card.Body className="d-flex flex-row justify-content-between">
                <div>
                    <div className="mb-1 h4">{organ.term}</div>
                    <div className="mb-1">{organ.organUberon}</div>
                    {organ.datasetQty != undefined && (
                        <div className="title_badge">
                            <span className="badge bg-dataset p-2 text-dark">
                                {getDisplayQty(organ.datasetQty)}
                            </span>
                        </div>
                    )}
                </div>
                <Image
                    className="align-self-center"
                    src={organ.icon}
                    alt={organ.term}
                    width="75"
                    height="75"
                />
            </Card.Body>
        </Card>
    );
};

export default OrganCard;
