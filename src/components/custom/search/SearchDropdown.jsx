import Link from "next/link";

const SearchDropdown = ({ title }) => {
    const dropdownItems = [
        { name: "Entities", url: "/search" },
        { name: "Metadata", url: "/search/metadata" },
    ];

    const createLinkView = (item) => {
        if (item.name === title) {
            return <span key={item.name} className="dropdown-item">{item.name}</span>;
        }
        return (
            <Link key={item.name} className="dropdown-item" href={item.url}>
                {item.name}
            </Link>
        );
    };

    return (
        <div className="dropdown">
            <button
                className="btn btn-outline-primary rounded-0 dropdown-toggle w-100"
                type="button"
                id="searchDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {title}
            </button>
            <ul className="dropdown-menu" aria-labelledby="searchDropdown">
                {dropdownItems.map((item) => {
                    return createLinkView(item);
                })}
            </ul>
        </div>
    );
};

export default SearchDropdown;
