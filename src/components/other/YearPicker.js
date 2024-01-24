import React from "react";

export default function YearPicker(props) {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const lastMarker = props.markers[props.markers.length - 1];

    const handleChange = (e) => {
        props.setSelectedYear(e.target.value);
        props.setPage(1);
    }
    
    const generateOptions = () => {
        if (lastMarker) {
            const yearOfLastMarker = lastMarker.date.substring(0,4);
            const options = [];
            for(let i = currentYear; i >= yearOfLastMarker; i--) {
                options.push(<option key={i} value={i.toString()}>{i}</option>);
            }
            return options;
        }
        return null; 
    }

    return (
        <div className="YearPicker">
            <select className="YearSelector" name="yearpicker" value={props.selectedYear} onChange={handleChange}>
                <option key={"All"} value="">Wszystkie</option>
                {generateOptions()}
            </select>
        </div>
    )
}