import React, {useEffect, useState, useMemo} from 'react'

import {Button, Form} from 'react-bootstrap'

const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
        <Form.Control defaultValue={filterText} onChange={onFilter}/>
        <Button type="button" onClick={onClear}>X</Button>
    </>
);

function useDataTableSearch(data,  idField, fieldsToSearch = []) {
    useEffect(() => {
    }, [])

    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const filteredItems = () => {
        let results = []
        let dict = {};
        for (let searchIndex of fieldsToSearch) {
            for (let d of data) {
                if (!dict[d[idField]] || !idField) {
                    if (d[searchIndex] && d[searchIndex].toLowerCase().includes(filterText.toLowerCase())) {
                        results.push(d);
                        if (idField) {
                            dict[d[idField]] = true;
                        }

                    }
                }
            }
        }
        return results;
    }
    const searchBarComponent = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
        );
    }, [filterText, resetPaginationToggle]);

    return {filteredItems: filteredItems(), filterText, searchBarComponent}
}


export default useDataTableSearch