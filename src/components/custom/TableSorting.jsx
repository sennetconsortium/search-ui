import Select from "react-select"

function TableSorting({ onChange, options, label, value}) {

    const key = 'facets:sortBy'

    const getSelected = () => {
        let result =  options[0]
        let storage = localStorage.getItem(key)
        console.log(options)
        if (storage) {
            result = options.filter(item => item.value === storage)
        }
        return result
    }

    const handleChange = (e) => {
        onChange(e.value)
        localStorage.setItem(key, e.value)
    }
    return (
        <div className='sui-sorting'>
            <div className="sui-sorting__label">{label}</div>
            <div className='sui-select'>
                <Select
                    onChange={(e) => handleChange(e)}
                    defaultValue={getSelected()}
                    label={label}
                    options={options}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            text: '#6c757d',
                            primary25: '#e9ecef',
                            primary: '#0d6efd',
                        },
                    })}
                />
            </div>
        </div>


    )
}

export default TableSorting