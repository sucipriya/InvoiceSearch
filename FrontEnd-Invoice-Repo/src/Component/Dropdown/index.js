import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import startCase from "lodash/startCase";
import toLower from "lodash/toLower";

const CustomDropdown = ({ options, searchByCallBack }) => {
  const [selectedDropdown, setSelectedDropdown] = useState("");

  const onChangeSelect = (eventKey) => {
    setSelectedDropdown(eventKey);
    searchByCallBack(eventKey);
  };
  return (
    <>
      <Dropdown
        onSelect={onChangeSelect}
        style={{
          border: "1px solid lightgrey",
          borderRadius: "5px",
          height: "37px",
        }}
      >
        <Dropdown.Toggle
          id="dropdown-basic"
          style={{
            color: "black",
            backgroundColor: "#eafff8",
            padding: "4px 10px",
            border: "1px solid #eafff8",
          }}
        >
          Filter By {selectedDropdown}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {options.map((option) => {
            return (
              <Dropdown.Item eventKey={startCase(toLower(option))}>
                {startCase(toLower(option))}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default CustomDropdown;
