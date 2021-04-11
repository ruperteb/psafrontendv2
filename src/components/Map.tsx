import React, { useState, useEffect } from 'react';
import MapGL, { Marker, NavigationControl } from 'react-map-gl';
import Pin from "../assets/pin";
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
import {
    FontWeights,
    Text,
    IconButton,
    getTheme,
    IIconProps
    
} from 'office-ui-fabric-react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_COORDINATES, GET_SINGLE_PROPERTY } from "../gql/gql"
import { Mutation, MutationUpdatePropertyArgs, Query } from "../schematypes/schematypes"

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

interface Props {
    coordinatesArray: string[] | undefined,
    propertyId: number,
    contactId: number
}

export const Map: React.FC<Props> = ({ coordinatesArray, propertyId, contactId }) => {

    const [updateProperty, { data }] = useMutation<Mutation, MutationUpdatePropertyArgs>(UPDATE_COORDINATES);

    const saveUpdatedCoordinates = () => {

        updateProperty({
            variables: {
                contactId: contactId,
                propertyId: propertyId,
                coordinates: `${marker.latitude},${marker.longitude}`
            },

            update(cache, { data }) {

                if (!data) {
                    return null;
                }

                const getExistingProperty = cache.readQuery<Query>({ query: GET_SINGLE_PROPERTY, variables: { propertyId: propertyId } })

                const updatedProperty = data.updateProperty!;
                
                if (getExistingProperty)
                    cache.writeQuery<Query>({
                        query: GET_SINGLE_PROPERTY,
                        variables: { propertyId: propertyId },
                        data: { singleProperty: updatedProperty }
                    });
            }
        })
       
        
    }


    var latitude = -33.973564350686324
    var longitude = 18.456012615707248

    if (coordinatesArray !== undefined && coordinatesArray !== null && isNaN(Number(coordinatesArray[0])) === false && isNaN(Number(coordinatesArray[1])) === false) {
        latitude = Number(coordinatesArray[0])
        longitude = Number(coordinatesArray[1])
    } else {
        latitude = -33.973564350686324
        longitude = 18.456012615707248

    }

    const navStyle: any = {
        position: "absolute",
        top: 0,
        left: 0,
        padding: '10px'
    };

    const dropdownStyle: any = {
        position: "absolute",
        top: 0,
        right: 0,
        padding: '10px'
    };

    const coordinatesStyle: any = {
        position: "absolute",
        bottom: 0,
        left: "35%",
        margin: 10,
        paddingLeft: '5px',
        border: "1px solid",
        display: "flex",
        alignItems: "center",
        backgroundColor: "white"
    };

    const theme = getTheme();
    const saveIconStyles = {
        root: {
            color: theme.palette.neutralPrimary,
             marginLeft: 5,
             

        },
        rootHovered: {
            color: theme.palette.neutralDark,
        },
        icon: {
            fontSize: "16px",

        }
    };

    const saveIcon: IIconProps = { iconName: 'Save' };

    const [viewport, setViewport] = useState({
        width: 600,
        height: 400,
        latitude: latitude,
        longitude: longitude,
        zoom: 15
    });


    const [marker, setMarker] = useState({
        latitude: latitude,
        longitude: longitude
    });



    const handleDragEnd: any | undefined = (event: any) => {

        setMarker({
            longitude: event.lngLat[0],
            latitude: event.lngLat[1]
        })
    }

    const mapTypeOptions = [

        { key: "mapbox://styles/mapbox/outdoors-v11", text: 'Default' },
        { key: "mapbox://styles/mapbox/satellite-streets-v11", text: 'Satelite' },
    
    ];



    const [selectedMapType, setSelectedMapType] = React.useState<IDropdownOption>({ key: "mapbox://styles/mapbox/outdoors-v11", text: 'Default' });



    const onChangeMapType = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void => {
        if (item !== undefined) {
            setSelectedMapType(item);
           
        }
    };

    const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 100, marginRight: 5 } };

    return (
        <MapGL
            {...viewport}
            /* width="100%"
            height="100%" */
            mapStyle={String(selectedMapType.key)}
            onViewportChange={setViewport}
            mapboxApiAccessToken={MAPBOX_TOKEN}
        >
            <Marker
                longitude={marker.longitude}
                latitude={marker.latitude}
                offsetTop={-20}
                offsetLeft={-10}
                draggable
                /* onDragStart={this._onMarkerDragStart}
                onDrag={this._onMarkerDrag} */
                onDragEnd={handleDragEnd}
            >
                <Pin size={20} />
            </Marker>

            <div className="nav" style={navStyle}>
                <NavigationControl onViewportChange={setViewport} />
            </div>

            <div className="dropdown" style={dropdownStyle}>
            <Dropdown
                                
                                selectedKey={selectedMapType ? selectedMapType.key : undefined}
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange={onChangeMapType}
                                placeholder="Select type"
                                options={mapTypeOptions}
                                styles={dropdownStyles}
                            />
            </div>

            <div className="coordinates" style={coordinatesStyle}>
                
                <Text>{`${marker.latitude.toFixed(4)} ,${marker.longitude.toFixed(4)}`}</Text>
                <IconButton
                    styles={saveIconStyles}
                    iconProps={saveIcon}
                    ariaLabel="Close panel"
                    onClick={saveUpdatedCoordinates}
                />
            </div>

            


        </MapGL>

    );
}

export default Map;