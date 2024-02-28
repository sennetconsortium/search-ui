import React, {useEffect, useState, useMemo} from 'react'

import {Button, Form, InputGroup, Col, Row} from 'react-bootstrap'

const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
        <Form.Group as={Col}>
            <InputGroup>
                <Form.Control defaultValue={filterText} onChange={onFilter}/>
                <InputGroup.Text className={"transparent"}><i className="bi bi-search"></i></InputGroup.Text>
                <Button type="button" onClick={onClear} label={'Reset'}><i className="bi bi-x"></i></Button>
            </InputGroup>
        </Form.Group>
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
                        if (results.indexOf(d) === -1) results.push(d);
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