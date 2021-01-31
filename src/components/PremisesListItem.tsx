import * as React from 'react';
import { getTheme } from '@fluentui/react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { Query, Premises, Mutation, MutationDeletePremisesArgs, Property } from "../schematypes/schematypes"
import { GET_SELECTED_PROPERTIES, GET_PREMISES, DELETE_PREMISES, GET_SINGLE_PROPERTY } from "../gql/gql"
import { gql, useMutation, useQuery } from '@apollo/client';
import { selectedPropertyList } from "../reactivevariables/reactivevariables"
import { mergeStyles, registerIcons } from 'office-ui-fabric-react/lib/Styling';
import { CommandBarButton, IContextualMenuProps, Stack, Text, FontWeights, IconButton, IIconProps, IStackStyles, initializeIcons, DefaultButton, FocusTrapCallout, FocusZone, PrimaryButton, mergeStyleSets, ITextStyles, } from 'office-ui-fabric-react';
import { useBoolean } from '@uifabric/react-hooks';
import { IndustrialIcon, RetailIcon, OfficeIcon, MixedUseIcon } from "../assets/svgIcons.js"
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { navigationState } from "../reactivevariables/reactivevariables"
import "./PropertyListItem.css"




interface Props {
    premises: Premises
    propertyId: number,
    key: any
}

export const PremisesListItem: React.FunctionComponent<Props> = ({ premises, propertyId }) => {



    const [isDeleteCalloutVisible, { toggle: toggleIsDeleteCalloutVisible }] = useBoolean(false);

    


    /* var selectedItems = data!.selectedItemsList!.propertyIds
  
  
    const onChange = React.useCallback((): void => {
  
      const found = !!selectedItemsList().propertyIds.find((t) => t === property.propertyId);
  
      console.log(found)
      console.log(selectedItemsList().propertyIds)
      if (found) {
        selectedItemsList({
          propertyIds: selectedItems.filter((t) => t !== property.propertyId)
        })
      } else {
        selectedItemsList({
          propertyIds: selectedItems.concat(property.propertyId)
        })
      }
  
    }, [selectedItems]);
  
    var isChecked = () => {
      const found = !!selectedItems.find((t) => t === property.propertyId);
      console.log(found)
      if (found) {
        return true
      } else {
        return false
      }
    } */

    const [deletePremises, { data: deletePremisesData }] = useMutation<Mutation, MutationDeletePremisesArgs>(DELETE_PREMISES);

    const deletePremisesButton = () => {

        deletePremises({
            variables: {
                premisesId: premises.premisesId
            },
            update(cache, { data }) {

                if (!data) {
                    return null;
                }

                const getExistingProperty = cache.readQuery<Query>({ query: GET_SINGLE_PROPERTY, variables: { propertyId: propertyId } })
                const existingProperty: Property = getExistingProperty ? getExistingProperty.singleProperty! : {propertyId:1, propertyName:""};
             
                const existingPremises = getExistingProperty ? getExistingProperty.singleProperty?.premisesList : [];
                const newPremises = existingPremises!.filter(t => {
                    if (t)
                        return (t.premisesId !== premises.premisesId)
                });  /* .returning[0] */;

            const newProperty= {...existingProperty, premisesList: newPremises}
                if (existingPremises)
                    cache.writeQuery<Query>({
                        query: GET_SINGLE_PROPERTY,
                        variables: { propertyId: propertyId},
                        data: { singleProperty: newProperty }
                    });
            }

        })
        toggleIsDeleteCalloutVisible()
    }

    /* const getPropertyIconType =() => {
      var buildingType= ""
      switch(property.buildingType) {
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
    } */

    /*  const handleSelectedPropertyClick = () => {
       navigationState ( {...navigationState(), selectedPropertyId: property.propertyId})
     } */


    const styles = mergeStyleSets({
        /*  buttonArea: {
           verticalAlign: 'top',
           display: 'inline-block',
           textAlign: 'center',
           margin: '0 100px',
           minWidth: 130,
           height: 32,
         }, */
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


    /* const checkClass = {
      root: {
        marginLeft: 5,
        visibility: isChecked() ? "visible" : "hidden",
      },
      checkbox: {
        borderRadius: "50%"
      }
    } */

    const imageClass = mergeStyles({
        width: 100,
        height: 80

    });

    const chevronClass = mergeStyles({
        alignSelf: 'center',
        marginLeft: 2,
        /*  marginRight: 5, */
        marginTop: "0 !important",
        /* color: palette.neutralTertiary, */
        fontSize: 20,
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
        marginRight: 15,
        marginTop: "-10px !important",
        padding: "5px",



    });

    const chevronIconDiv = mergeStyles({
        /* fontSize: 50, */
        height: 40,
        width: 40,
        lineHeight: 40,
        textAlign: "center",
        marginLeft: 15,
        marginRight: 15,
        marginTop: "0px !important",
        /* padding: "5px", */
        selectors: {
            '&:hover': { backgroundColor: "rgb(0 13 255 / 14%)", borderRadius: 30, "transition": "all .2s ease-in-out", transform: "scale(1.2)" },
        },

    });

    const boldStyle = { root: { fontWeight: FontWeights.semibold } };
    const propertyHeadingStyles = { alignSelf: "start", fontSize: "23px", padding: 5, paddingLeft: "25px" }
    const tableCellStyles: ITextStyles = { root: { alignSelf: "start", fontSize: "14px", padding: 5, marginTop: "auto !important", marginBottom: "auto", width: 45 } }
    const theme = getTheme();
    const iconButtonStyles = {
        root: {
            color: theme.palette.neutralPrimary,
            marginLeft: 5,
            marginTop: '0px !important',
            marginRight: 5,
            width: 35,
            height: 35,
            /*  visibility: isChecked() ? "visible" : "hidden", */

        },
        rootHovered: {
            color: theme.palette.neutralDark,
            backgroundColor: "rgb(3 122 212 / 16%);",
            /* borderRadius: 30, */
            "transition": "all .2s ease-in-out", transform: "scale(1.1)"

        },
        icon: {
            fontSize: "24px",
            marginLeft: 6

        }
    };

    const vacantIconStyles = {
        root: {
           

        },
        rootHovered: {
            backgroundColor:  "rgb(104 113 140 / 0%)",
        },
        rootActive: {
            backgroundColor:    "rgb(104 113 140 / 0%)",
        },
        icon: {
            fontSize: "24px",
            marginLeft: 6

        }
    };

    const menuIcon: IIconProps = { iconName: 'SingleColumnEdit' };
    const checkIcon: IIconProps = { iconName: 'StatusCircleCheckmark' };
    const crossIcon: IIconProps = { iconName: 'StatusCircleErrorX' };
    const notesIcon: IIconProps = { iconName: 'DietPlanNotebook' };

    const getOccDate = () => {

        var date = new Date(premises.occupation)
        return date.toLocaleDateString(
            'en-gb',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        );
    }

    const getExpDate = () => {

        var date = new Date(premises.leaseExpiry)
        return date.toLocaleDateString(
            'en-gb',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        );
    }


    const handlePremisesNotesClick =() => {
        navigationState({ ...navigationState(), selectedPremisesId: premises.premisesId! })
        navigationState({ ...navigationState(), showPremisesNotesModal: true })
    
    }

    const handlePremisesEditClick =() => {
        navigationState({ ...navigationState(), selectedPremisesId: premises.premisesId! })
        navigationState({ ...navigationState(), showUpdatePremisesModal: true })
    
    }

    const handlePremisesDuplicateClick =() => {
        navigationState({ ...navigationState(), selectedPremisesId: premises.premisesId! })
        navigationState({ ...navigationState(), showDuplicatePremisesModal: true })
    
    }

    const menuProps: IContextualMenuProps = {
        items: [
          {
            key: 'Delete Premises',
            text: 'Delete Premises',
            iconProps: { iconName: 'Delete' },
            onClick: toggleIsDeleteCalloutVisible
          },
          {
            key: 'Edit Premises',
            text: 'Edit Premises',
            iconProps: { iconName: 'Edit' },
            onClick: handlePremisesEditClick
          },
          {
            key: 'Duplicate Premises',
            text: 'Duplicate Premises',
            iconProps: { iconName: 'DuplicateRow' },
            onClick: handlePremisesDuplicateClick
          },
        ],
        directionalHintFixed: false,
      };


    return (

        <Stack
            horizontalAlign="start"
            verticalAlign="start"
            id={`premisesRow${premises.premisesId}`}

            styles={{
                root: {
                     width: "fit-content",
                    marginBottom: 10,
                    marginLeft: 20,
                    marginRight:"auto",
                    /* padding: '10px', */
                    textAlign: 'center',
                    color: '#605e5c',
                    alignItems: "center",
                    display: "flex",
                    flexFlow: "row",
                    /*  borderTop: "4px solid #2557a2;",
                     borderBottom: "4px solid #2557a2;", */
                    backgroundColor: "white",
                    /*  background: isChecked() ? "rgb(104 113 140 / 14%)" : "white", */
                    boxShadow: "-1px 1px 7px 2px #d4cece",
                    selectors: {
                        '&:hover': { background: /* palette.neutralLight */  "rgb(104 113 140 / 14%)" },
                    },

                }
            }}
        >



            <Stack horizontalAlign="start" styles={{
                root: {
                   /*  width:60, */
                   marginRight: 10,
                    textAlign: 'center',
                    color: '#605e5c',
                    alignItems: "center",
                    display: "flex",
                    flexFlow: "row",
                }
            }}>
                <IconButton
                    styles={iconButtonStyles}
                    id={`deletePremisesButton${premises.premisesId}`}
                    menuProps={menuProps}
                    iconProps={menuIcon}
                    ariaLabel="Delete Premises"
                   /*  onClick={toggleIsDeleteCalloutVisible} */
                />
                {isDeleteCalloutVisible ? (
                    <div>
                        <FocusTrapCallout
                            role="alertdialog"
                            className={styles.callout}
                            gapSpace={0}
                            target={`#deletePremisesButton${premises.premisesId}`}
                            onDismiss={toggleIsDeleteCalloutVisible}
                            setInitialFocus
                        >
                            <div className={styles.header}>
                                <Text className={styles.title}>Delete Premises</Text>
                            </div>
                            <div className={styles.inner}>
                                <div>
                                    <Text className={styles.subtext}>
                                        Are you sure you want to delete this premises?
                </Text>
                                </div>
                            </div>
                            <FocusZone>
                                <Stack className={styles.buttons} gap={8} horizontal>
                                    <PrimaryButton onClick={deletePremisesButton}>Confirm</PrimaryButton>
                                    <DefaultButton onClick={toggleIsDeleteCalloutVisible}>Cancel</DefaultButton>
                                </Stack>
                            </FocusZone>
                        </FocusTrapCallout>
                    </div>
                ) : null}
                {/* <IconButton
                    styles={iconButtonStyles}
                    id={`deletePremisesButton${premises.premisesId}`}
                    iconProps={deleteIcon}
                    ariaLabel="Delete Premises"
                    onClick={toggleIsDeleteCalloutVisible}
                /> */}

            </Stack>



            <Text styles={tableCellStyles} style={{ width: 100, borderLeft: "3px solid rgba(210, 26, 69, 0.42) "}}>{premises.floor}</Text>
            <Text styles={tableCellStyles}>{premises.area}</Text>
            <Text styles={tableCellStyles}>{premises.vacant === "true"?
            <IconButton
                    styles={vacantIconStyles}
                    iconProps={checkIcon}
                    ariaLabel="Vacant"
                />: <IconButton
                styles={vacantIconStyles}
                iconProps={crossIcon}
                ariaLabel="Not vacant"
            /> }</Text>
            <Text styles={tableCellStyles} style={{ width: 55,}}>{premises.type}</Text>
            <Text styles={tableCellStyles} style={{ width: 100, borderRight: "3px solid rgba(210, 26, 69, 0.42) " , marginRight:2 }}>{getOccDate()}</Text>
           {/*  <Text styles={tableCellStyles} style={{ width: 70 }}>{premises.premisesNotes}</Text> */}
            <Text styles={tableCellStyles} style={{ borderLeft: "3px solid rgba(63, 55, 189, 0.42) ", marginLeft:2}}>{premises.netRental}</Text>
            <Text styles={tableCellStyles}>{premises.opCosts}</Text>
            <Text styles={tableCellStyles}>{premises.other}</Text>
            <Text styles={tableCellStyles}>{premises.grossRental}</Text>
            <Text styles={tableCellStyles} style={{borderRight: "3px solid rgba(63, 55, 189, 0.42) ", marginRight:2 }}>{premises.esc}</Text>
            <Text styles={tableCellStyles} style={{ borderLeft: "3px solid rgba(61, 177, 123, 0.42) " , marginLeft:2}}>{premises.openBays}</Text>
            <Text styles={tableCellStyles}>{premises.openRate}</Text>
            <Text styles={tableCellStyles} style={{ width: 50 }}>{premises.coveredBays}</Text>
            <Text styles={tableCellStyles} style={{ width: 50 }}>{premises.coveredRate}</Text>
            <Text styles={tableCellStyles} style={{ width: 50 }}>{premises.shadedBays}</Text>
            <Text styles={tableCellStyles} style={{ width: 50 }}>{premises.shadedRate}</Text>
            <Text styles={tableCellStyles} style={{ width: 50, borderRight: "3px solid rgba(61, 177, 123, 0.42) ", marginRight:2 }}>{premises.parkingRatio}</Text>
            <Text styles={tableCellStyles}  style={{ width: 125, borderLeft: "3px solid rgba(212, 236, 10, 0.42) " , marginLeft:2 }}>{premises.tenantName}</Text>
            <Text styles={tableCellStyles} style={{ width: 100, borderRight: "3px solid rgba(212, 236, 10, 0.42) ", marginRight:2 }}>{getExpDate()}</Text>
            <div style={{ width: 60, marginLeft: 10, marginRight: "auto", display: "flex" }}>
                    <IconButton
                    styles={iconButtonStyles}
                    iconProps={notesIcon}
                    ariaLabel="Premises Notes"
                    onClick={handlePremisesNotesClick}
                />
                    </div>




        </Stack>

    );
};

export default PremisesListItem