import PropTypes from 'prop-types'
import DataTable from 'react-data-table-component'

function SourceDataTable({ metadata }) {
    const tableStyles = {
        rows: {
            style: {
                fontWeight: 'bold'
            }
        }
    }

    const columns = [
        {
            name: 'Key',
            selector: (row) => row.name,
            sortable: true
        },
        {
            name: 'Value',
            selector: () => null,
            sortable: true
        }
    ]

    const groupSourceMappedMetadata = (metadata) => {
        const groups = []

        for (const value of Object.values(metadata)) {
            const groupName = value.group_display
            const idx = groups.findIndex((group) => group.name === groupName)
            if (idx < 0) {
                groups.push({
                    name: groupName,
                    data: [
                        { key: value.key_display, value: value.value_display }
                    ]
                })
                continue
            }
            groups[idx].data.push({
                key: value.key_display,
                value: value.value_display
            })
        }

        return groups
    }

    const tableRow = ({ data }) => {
        if (data.length === 0) {
            return null
        }

        return data.data.map((row) => {
            return (
                <div key={row.key} className='d-flex ms-5 py-2 border-bottom'>
                    <div className='w-50 ps-3' style={{ fontSize: '13px' }}>
                        {row.key}
                    </div>
                    <div className='w-50 ps-3' style={{ fontSize: '13px' }}>
                        {row.value}
                    </div>
                </div>
            )
        })
    }

    return (
        <DataTable
            className='pb-4'
            columns={columns}
            customStyles={tableStyles}
            data={groupSourceMappedMetadata(metadata)}
            expandableRows
            fixedHeader={true}
            expandableRowExpanded={() => true}
            expandableRowsComponent={tableRow}
            expandOnRowClicked/>
    )
}

SourceDataTable.propTypes = {
    metadata: PropTypes.object.isRequired,
}

export default SourceDataTable
