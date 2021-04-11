import * as React from 'react';
import { getTheme } from '@fluentui/react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { Query, Property, Mutation, MutationDeletePropertyArgs } from "../schematypes/schematypes"
import { GET_SELECTED_PROPERTIES, GET_PROPERTIES, DELETE_PROPERTY } from "../gql/gql"
import { gql, useMutation, useQuery } from '@apollo/client';
import { selectedPropertyList } from "../reactivevariables/reactivevariables"
import { mergeStyles, registerIcons } from 'office-ui-fabric-react/lib/Styling';
import { CommandBarButton, IContextualMenuProps, Stack, Text, FontWeights, IconButton, IIconProps, IStackStyles, initializeIcons, DefaultButton, FocusTrapCallout, FocusZone, PrimaryButton, mergeStyleSets, } from 'office-ui-fabric-react';
import { useBoolean } from '@uifabric/react-hooks';
import { IndustrialIcon, RetailIcon, OfficeIcon, MixedUseIcon, SouthAfricaIcon, AreaIcon } from "../assets/svgIcons.js"
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { navigationState } from "../reactivevariables/reactivevariables"
import { Image, Video, Transformation, CloudinaryContext, Placeholder } from 'cloudinary-react';
import LazyLoad, { lazyload } from 'react-lazyload';
import { forceCheck } from 'react-lazyload';

import "./PropertyListItem.css"

const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME

interface Props {
    property: Property
    key: any
}

export const PropertyListItemImages: React.FunctionComponent<Props> = ({ property }) => {

    registerIcons({
        icons: {
            'office': <OfficeIcon></OfficeIcon>,
            'industrial': <IndustrialIcon></IndustrialIcon>,
            'retail': <RetailIcon></RetailIcon>,
            'mixeduse': <MixedUseIcon></MixedUseIcon>,
            'southafrica': <SouthAfricaIcon></SouthAfricaIcon>,
            'area': <AreaIcon></AreaIcon>
        }
    })

    forceCheck();

    const [isDeleteCalloutVisible, { toggle: toggleIsDeleteCalloutVisible }] = useBoolean(false);

    const {
        data,
        loading,
        error
    } = useQuery<Query>(GET_SELECTED_PROPERTIES);

    var selectedProperties = data!.selectedPropertyList!

    const onCheckProperty = React.useCallback((): void => {

        const found = !!selectedPropertyList().find((t) => t.propertyId === property.propertyId);


        if (found) {
            selectedPropertyList(
                selectedProperties.filter((t) => t.propertyId !== property.propertyId)
            )
        } else {
            selectedPropertyList(
                selectedProperties.concat(property)
            )
        }

    }, [selectedProperties]);

    var isChecked = () => {
        const found = !!selectedProperties.find((t) => t.propertyId === property.propertyId);

        if (found) {
            return true
        } else {
            return false
        }
    }

    const [deleteProperty, { data: deletePropertyData }] = useMutation<Mutation, MutationDeletePropertyArgs>(DELETE_PROPERTY);

    const deletePropertyButton = () => {

        deleteProperty({
            variables: {
                propertyId: property.propertyId
            },
            update(cache, { data }) {

                if (!data) {
                    return null;
                }

                const getExistingProperties = cache.readQuery<Query>({ query: GET_PROPERTIES });
                const existingProperties = getExistingProperties ? getExistingProperties.properties : [];
                const newProperties = existingProperties!.filter(t => {
                    if (t)
                        return (t.propertyId !== property.propertyId)
                });  
                if (existingProperties)
                    cache.writeQuery<Query>({
                        query: GET_PROPERTIES,
                        data: { properties: newProperties }
                    });
            }

        })

    }

    const getPropertyIconType = () => {
        var buildingType = ""
        switch (property.buildingType) {
            case "Office":
                buildingType = "office"
                break;
            case "Industrial":
                buildingType = "industrial"
                break;
            case "Retail":
                buildingType = "retail"
                break;
            case "Mixed Use":
                buildingType = "mixeduse"
                break;
            default:
                buildingType = "mixeduse"
        }
        return buildingType
    }

    const handleSelectedPropertyClick = () => {
        navigationState({ ...navigationState(), selectedPropertyId: property.propertyId, showSelectedPropertyPanel: true })
    }

    const getVacantGLA = () => {
        var vacantGLA = 0
        property.premisesList!.map(premises => {
            if (premises.vacant === "true") {
                vacantGLA += premises.area!
            }
        })
        return vacantGLA.toFixed()
    }


    const styles = mergeStyleSets({
        callout: {
            maxWidth: 400,
        },
        header: {
            padding: '18px 24px 12px',
        },
        title: [
            {
                margin: 0,
                fontWeight: FontWeights.bold,
            },
        ],
        inner: {
            height: '100%',
            padding: '0 24px 20px',
        },
        actions: {
            position: 'relative',
            marginTop: 20,
            width: '100%',
            whiteSpace: 'nowrap',
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '0 24px 24px',
        },
        subtext: [
            {
                margin: 0,
                fontWeight: FontWeights.semilight,
            },
        ],
    });


    const checkClass = {
        root: {
            /*  marginLeft: "auto !important", */
            marginRight: 0,
            visibility: isChecked() ? "visible" : "hidden",
            padding: 10
        },
        checkbox: {
            borderRadius: "50%",
            height: 40,
            width: 40,
            selectors: {
                '&:hover': { backgroundColor: "white" },
            },
            /* backgroundColor:"white" */
        },
        checkmark: {
            fontSize: 20
        }
    }

    const imageClass = mergeStyles({
        width: 100,
        height: 80

    });

    const chevronClass = mergeStyles({
        alignSelf: 'center',
        marginLeft: 2,
        marginTop: "0 !important",
        fontSize: 40,
        flexShrink: 0,
        cursor: "pointer",
        /* selectors: {
          '&:hover': { "transition": "all .2s ease-in-out", transform: "scale(1.1)" },
        }, */

    });

    const iconClass = mergeStyles({
        fontSize: 50,
        height: 50,
        width: 50,
        marginLeft: 15,
        marginRight: 25,
        marginTop: "auto",
        marginBottom: "auto",
        padding: "5px",
    });

    const areaIconClass = mergeStyles({
        fontSize: 50,
        height: 50,
        width: 50,
        marginLeft: 15,

        marginTop: "auto",
        marginBottom: "auto",
        padding: "5px",

    });



    const mapClass = mergeStyles({
        marginLeft: 15,
        marginRight: 25,
        marginTop: "auto",
        marginBottom: "auto",
        padding: "5px",
        selectors: {
            '#ZA-WC': {
                fill: property.province === "WC" ? "#0078d4;" : "#dad1d1"
            },
            '#ZA-GT': {
                fill: property.province === "GAU" ? "#0078d4;" : "#dad1d1"
            },
            '#ZA-NL': {
                fill: property.province === "KZN" ? "#0078d4;" : "#dad1d1"
            },
            '#ZA-EC': {
                fill: property.province === "Other Provinces" ? "#0078d4;" : "#dad1d1"
            },
            '#ZA-LP': {
                fill: property.province === "Other Provinces" ? "#0078d4;" : "#dad1d1"
            },
            '#ZA-FS': {
                fill: property.province === "Other Provinces" ? "#0078d4;" : "#dad1d1"
            },
            '#ZA-NP': {
                fill: property.province === "Other Provinces" ? "#0078d4;" : "#dad1d1"
            },
            '#ZA-NC': {
                fill: property.province === "Other Provinces" ? "#0078d4;" : "#dad1d1"
            },
            '#ZA-NW': {
                fill: property.province === "Other Provinces" ? "#0078d4;" : "#dad1d1"
            },
            '#ZA-MP': {
                fill: property.province === "Other Provinces" ? "#0078d4;" : "#dad1d1"
            },

        }
    });

    const chevronIconDiv = mergeStyles({
        /* fontSize: 50, */
        height: 60,
        width: 60,
        lineHeight: 60,
        textAlign: "center",
        marginLeft: "auto",
        marginRight: 10,
        marginTop: "auto !important",
        marginBottom: "auto",
        borderRadius: 30,
        /* padding: "5px", */
        selectors: {
            '&:hover': { backgroundColor: "rgb(0 13 255 / 14%)", borderRadius: 30, "transition": "all .1s ease-in-out", transform: "scale(1.2)" },
        },

    });

    const boldStyle = { root: { fontWeight: FontWeights.semibold } };
    const propertyHeadingStyles = { alignSelf: "start", fontSize: "26px", padding: 5, paddingLeft: "25px", color: "white", marginTop: "auto", marginBottom: "auto" }
    const propertyAddressLabelStyles = { alignSelf: "start", fontSize: "16px", padding: 5, paddingLeft: "25px", paddingRight: 0, fontWeight: 800, /* fontStyle: "italic" */ }
    const propertyAddressStyles = { alignSelf: "start", fontSize: "16px", padding: 5, paddingLeft: "15px" }
    const propertyAreaStyles = { alignSelf: "start", fontSize: "18px", padding: 5, paddingTop: 0, /* marginTop: "auto", */ marginBottom: "auto" }
    const propertyAreaVacantStyles = { alignSelf: "start", fontSize: "14px", padding: 5, paddingBottom: 0, marginTop: "auto", /* marginBottom: "auto" */ }
    const theme = getTheme();
    const iconButtonStyles = {
        root: {
            color: "#ffffff94",
            marginLeft: "auto !important",
            marginTop: 'auto',
            marginBottom: 'auto',
            marginRight: 0,
            width: 40,
            height: 40,
            border: "1px solid rgb(50, 49, 48)",
            borderRadius: "50%",
            visibility: isChecked() ? "visible" : "hidden",
            padding: 0

        },
        rootHovered: {
            color: "white",
            backgroundColor: "#ff0000c4",
            borderRadius: "50%",
            border: "1px solid rgb(50, 49, 48)",
            /* "transition": "all .2s ease-in-out", transform: "scale(1.2)" */

        },
        icon: {
            fontSize: "20px",
            marginLeft: 6

        }
    };

    const deleteIcon: IIconProps = { iconName: 'Delete' };


    return (

        <Stack
            horizontalAlign="start"
            verticalAlign="start"
            id="card"

            styles={{
                root: {
                    marginBottom: 20,
                    textAlign: 'center',
                    color: '#605e5c',
                    alignItems: "center",
                    display: "flex",
                    flexFlow: "row",
                    
                    backgroundColor: "white",
                    background: isChecked() ? "rgb(104 113 140 / 14%)" : "white",
                    boxShadow: "-1px 1px 7px 2px #d4cece",
                    selectors: {
                        '&:hover': { background: "rgb(104 113 140 / 14%)" },
                    },

                }
            }}
            gap={15}>

            <Stack>
                {property.images!.length !== 0 ?
                    <Image cloudName={CLOUD_NAME} width="400" height="300" publicId={property.images![0]} loading="lazy"
                        gravity="auto" crop="fill"
                        quality="auto" fetchFormat="auto">
                        <Placeholder
                            type="blur">
                        </Placeholder>
                    </Image> :
                    <Image cloudName={CLOUD_NAME} publicId={"https://res.cloudinary.com/drlfedqyz/image/upload/v1618132201/logo_reverse_cropped_h57c8f.jpg"}
                        loading="lazy"
                        width="400" height="300" gravity="auto"
                        quality="auto" fetchFormat="auto"
                    >
                        <Placeholder
                            type="blur">
                        </Placeholder>
                    </Image>
                }
            </Stack>


            <Stack verticalFill styles={{ root: { paddingTop: 0, marginTop: "0 !important", height: 300, width: "100%" } }}>

                <Stack horizontal style={{ backgroundColor: "#20314b", boxShadow: "rgb(212 206 206) 3px 5px 7px 2px" }}>
                    <Text styles={boldStyle} style={propertyHeadingStyles}>{property.propertyName}</Text>
                    <IconButton
                        styles={iconButtonStyles}
                        id={`deleteButton${property.propertyId}`}
                        iconProps={deleteIcon}
                        ariaLabel="Delete Property"
                        onClick={toggleIsDeleteCalloutVisible}
                    />
                    <Checkbox styles={checkClass} checked={isChecked()} onChange={onCheckProperty} />
                </Stack>

                <Stack horizontal>
                    <Stack styles={{ root: { paddingTop: 0, marginTop: "20px !important", marginBottom: "auto" } }} verticalFill>

                        <Text styles={boldStyle} style={propertyAddressLabelStyles}>Address:</Text>
                        <Text styles={boldStyle} style={propertyAddressLabelStyles}>Suburb:</Text>
                        <Text styles={boldStyle} style={propertyAddressLabelStyles}>Landlord:</Text>
                    </Stack>

                    <Stack styles={{ root: { paddingTop: 0, marginTop: "20px !important", marginBottom: "auto" } }} verticalFill>

                        <Text styles={boldStyle} style={propertyAddressStyles}>{property.address !== "" || undefined ? property.address : "-"}</Text>
                        <Text styles={boldStyle} style={propertyAddressStyles}>{property.suburb !== "" || undefined ? property.suburb : "-"}</Text>
                        <Text styles={boldStyle} style={propertyAddressStyles}>{property.contact?.landlordName?.landlordName !== "" || undefined ? property.contact?.landlordName?.landlordName : "-"}</Text>
                    </Stack>

                    <Stack verticalFill styles={{ root: { /* height: 186, */ marginLeft: "auto !important", marginRight: 0, marginTop: 15, marginBottom: "auto" } }}>


                        <div className={chevronIconDiv} onClick={handleSelectedPropertyClick}><Icon className={chevronClass} iconName={'ChevronRight'} /></div>


                    </Stack>
                </Stack>



                <Stack horizontal styles={{ root: { paddingTop: 0, marginTop: "auto !important", marginBottom: 5 } }}>
                    <FontIcon iconName={getPropertyIconType()} className={iconClass} style={{ marginLeft: "auto" }} />
                    <FontIcon iconName="southafrica" className={mapClass} />
                    <FontIcon iconName='area' className={areaIconClass} />
                    <Stack verticalFill styles={{ root: { paddingTop: 0, marginTop: "auto", marginBottom: "auto", marginRight: "auto" } }}>
                        <Text styles={boldStyle} style={propertyAreaVacantStyles}>Vacant:</Text>
                        <Text styles={boldStyle} style={propertyAreaStyles}>{`${getVacantGLA()} m²`}</Text>
                    </Stack>


                </Stack>

            </Stack>





            {isDeleteCalloutVisible ? (
                <div>
                    <FocusTrapCallout
                        role="alertdialog"
                        className={styles.callout}
                        gapSpace={0}
                        target={`#deleteButton${property.propertyId}`}
                        onDismiss={toggleIsDeleteCalloutVisible}
                        setInitialFocus
                    >
                        <div className={styles.header}>
                            <Text className={styles.title}>Delete Property</Text>
                        </div>
                        <div className={styles.inner}>
                            <div>
                                <Text className={styles.subtext}>
                                    Are you sure you want to delete this property?
                </Text>
                            </div>
                        </div>
                        <FocusZone>
                            <Stack className={styles.buttons} gap={8} horizontal>
                                <PrimaryButton onClick={deletePropertyButton}>Confirm</PrimaryButton>
                                <DefaultButton onClick={toggleIsDeleteCalloutVisible}>Cancel</DefaultButton>
                            </Stack>
                        </FocusZone>
                    </FocusTrapCallout>
                </div>
            ) : null}



        </Stack>

    );
};

export default PropertyListItemImages