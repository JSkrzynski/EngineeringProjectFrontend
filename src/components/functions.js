export const baseURL = "http://172.19.100.10.nip.io:8080";
// export const baseURL = "http://localhost:8080";

export const config = (token) => {
    return ({
        headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true
        });
};

export function crayfishTypeSwitch(param) {
    switch(param) {
        case "GALICIAN":
            return "Galicyjski";
        case "SIGNAL":
            return "Sygnałowy";
        case "AMERICAN":
            return "Amerykański";
        case "NOBLE":
            return "Szlachetny";
        case "OTHER":
            return "Inne";
        default:
            return "Błąd pobierania danych z bazy";
    }
}

export const generateTableHeaders = (headers, currentHeader, sortAs, handleHeaderClick) => {
    return headers.map((header, index) => (
        <th key={index} onClick={() => handleHeaderClick(header)}>
            {header}
            {currentHeader === header && (
                <span>
                    {sortAs === "asc" ? " ▲" : " ▼"}
                </span>
            )}
        </th>
    ));
};

export const handleHeaderClick = (header, currentHeader, sortAs, setCurrentHeader, setSortAs) => {
    if (header === currentHeader) {
        sortAs === "asc" ? setSortAs("desc") : setSortAs("asc");
    } else {
        setCurrentHeader(header);
    }
};

export const handleDetailsClick = (marker, setDetailsPopupButton, setMarkerDetails) => {
    setDetailsPopupButton(true);
    if (marker.image) {
        setMarkerDetails({
            id: marker._id,
            lat: marker.mapMarker.position.lat,
            lng: marker.mapMarker.position.lng,
            crayfishType: marker.CrayfishType, 
            date: marker.date,
            title: marker.mapMarker.title,
            description: marker.mapMarker.description,
            verified: marker.verified,
            userEmail: marker.userEmail,
            image: {
                name: marker.image.name,
                data: marker.image.data
            }
        });
    } else {
        setMarkerDetails({
            id: marker._id,
            lat: marker.mapMarker.position.lat,
            lng: marker.mapMarker.position.lng,
            crayfishType: marker.CrayfishType, 
            date: marker.date,
            title: marker.mapMarker.title,
            description: marker.mapMarker.description,
            verified: marker.verified,
            userEmail: marker.userEmail
        });
    }
    
};

export const sortMarkers = (data, header, sortAs) => {
    switch(header){
        case "Status":
            if(sortAs === "asc"){
                return data.sort( (a,b) => a.verified - b.verified);
            }
            return data.sort( (a,b) => b.verified - a.verified);

        case "Typ":
            if(sortAs === "asc"){
                return data.sort( (a,b) => a.CrayfishType.localeCompare(b.CrayfishType));
            }
            return data.sort( (a,b) => b.CrayfishType.localeCompare(a.CrayfishType));

        case "Data":
            if(sortAs === "asc"){
                return data.sort( (a,b) => a.date.localeCompare(b.date));
            }
            return data.sort( (a,b) => b.date.localeCompare(a.date));

        case "Tytuł":
            if(sortAs === "asc"){
                return data.sort( (a,b) => a.mapMarker.title.localeCompare(b.mapMarker.title));
            }
            return data.sort( (a,b) => b.mapMarker.title.localeCompare(a.mapMarker.title));

        default:
            return data.sort( (a,b) => a.verified - b.verified);
    }
    
};

export const filterMarkers = (markers, selectedYear) => {
    if (selectedYear === "") {
        return markers;
    } else {
        return markers.filter((marker) => marker.date.substring(0,4) === selectedYear);
    }
}

export const getTenMarkersFromRange = (markers, x) => {
    return markers.slice((x-1) * 10, x * 10);
}

export const getSortedFilteredMarkers = (markers, selectedYear, header, sortAs) => {
    const filteredMarkers = filterMarkers(markers,selectedYear);
    const sortedFilteredMarkers = sortMarkers(filteredMarkers, header, sortAs)
    return sortedFilteredMarkers;
}

export const getSortedFilteredMarkersFromRange = (markers, selectedYear, header, sortAs, page) => {
    const sortedFilteredMarkers = getSortedFilteredMarkers(markers, selectedYear, header, sortAs)
    return getTenMarkersFromRange(sortedFilteredMarkers, page);
}

export const sortUsers = (data, header, sortAs) => {
    data.sort( (a,b) => a.email.localeCompare(b.email));
    switch(header){
        case "E-Mail":
            if(sortAs === "asc"){
                return data.sort( (a,b) => a.email.localeCompare(b.email));
            }
            return data.sort( (a,b) => b.email.localeCompare(a.email));

        case "Rola":
            if(sortAs === "asc"){
                return data.sort( (a,b) => a.role.localeCompare(b.role));
            }
            return data.sort( (a,b) => b.role.localeCompare(a.role));

        default:
            return data.sort( (a,b) => a.role.localeCompare(b.role));
    }
    
};

export const handleCheckboxChange = (marker, selectedMarkers, setSelectedMarkers) => {
    const isSelected = selectedMarkers.some((selectedMarker) => selectedMarker === marker);

    if (isSelected) {
      setSelectedMarkers((prevSelectedMarkers) =>
        prevSelectedMarkers.filter((selectedMarker) => selectedMarker !== marker)
      );
    } else {
      setSelectedMarkers((prevSelectedMarkers) => [...prevSelectedMarkers, marker]);
    }
};
