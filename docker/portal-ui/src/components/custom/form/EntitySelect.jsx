import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import log from "loglevel";

const SimpleSelect = ({...props}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  let valueDict = {}
  log.debug(props.values)

  // This is used to update the form fields whenever an item is being edited
    useEffect(() => {
        log.debug(props.defaultValue)
		valueDict.label = props.defaultValue
		valueDict.value = props.defaultValue
		if(props.defaultValue != undefined) {
			props.onChange(valueDict)
        }
	}, []);

  return (
    <div className="form-floating mb-3">
      <Select
        className="basic-single"
        classNamePrefix="select"
        onChange={props.onChange}
        options={props.options}
        name={props.name}
        defaultValue={props.defaultValue}
        isClearable={props.isClearable}
      />
    </div>
  );
}

export default SimpleSelect;