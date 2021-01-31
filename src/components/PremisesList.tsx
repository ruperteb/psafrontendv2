import * as React from 'react';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { Query, Property } from "../schematypes/schematypes"
import { useQuery } from '@apollo/client';
import { selectedPropertyList } from "../reactivevariables/reactivevariables"
import PremisesListItem from "./PremisesListItem"
import { Text, Stack, ITextStyles, IStyleFunctionOrObject, IconButton, IIconProps } from 'office-ui-fabric-react';
/* import { DeepPartial  } from 'office-ui-fabric-react/lib/Styling'; */
import { TooltipHost, ITooltipHostStyles, ITooltipHostStyleProps, } from 'office-ui-fabric-react/lib/Tooltip';
import { useId } from '@uifabric/react-hooks';
import { getTheme } from '@fluentui/react';
import { navigationState } from "../reactivevariables/reactivevariables"
const calloutProps = { gapSpace: 0 };
// The TooltipHost root uses display: inline by default.
// If that's causing sizing issues or tooltip positioning issues, try overriding to inline-block.






interface Props {
    singleProperty: Property | undefined
}

export const PremisesList: React.FunctionComponent<Props> = ({ singleProperty }) => {

   

    const tooltipNetRentalId = useId('NetRental');
    const tooltipOpCostsId = useId('NetRental');
    const tooltipOtherId = useId('NetRental');
    const tooltipGrossRentalId = useId('NetRental');
    const tooltipOpenRateId = useId('NetRental');
    const tooltipCoveredRateId = useId('NetRental');
    const tooltipShadedRateId = useId('NetRental');
    const tooltipEscId = useId('NetRental');
    const tooltipParkingRatioId = useId('NetRental');

    const tooltipHostStyles: IStyleFunctionOrObject<ITooltipHostStyleProps, ITooltipHostStyles> = { root: { display: "flex" } }

    var originalPropertyData = singleProperty
    var originalPremises = originalPropertyData!.premisesList!
    var indexSortedPremises = originalPremises.slice().sort((a, b) => {
        return (a.premisesIndex!) - (b.premisesIndex!)
    });

    var floorSortedPremises = indexSortedPremises.slice().sort((a, b) => {
        var floorA = a.floor!.toUpperCase();
        var floorB = b.floor!.toUpperCase();
        if (floorA < floorB && a.premisesIndex=== b.premisesIndex) {
            return -1;
        }
        if (floorA > floorB && a.premisesIndex=== b.premisesIndex) {
            return 1;
        }
        return 0;
    });


    const tableCellStyles: ITextStyles = { root: { alignSelf: "start", fontSize: "14px", padding: 5, marginTop: "auto !important", marginBottom: "auto", width: 45, /* fontStyle : "italic", */ fontWeight: 600, } }
    const tableHeadingStyles: ITextStyles = { root: { fontSize: "18px", paddingTop: 5, fontWeight: 600, } }
    const tableCellBelowStyles: ITextStyles = { root: { alignSelf: "start", fontSize: "10px", padding: 0, marginTop: "auto !important", marginBottom: "auto", width: 50, } }
    const theme = getTheme();
    const iconButtonStyles = {
        root: {
            color: theme.palette.neutralPrimary,
            marginLeft: 20,
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

    const addIcon: IIconProps = { iconName: 'Add' };

    /* const onFilterChanged = (_: any, text: string): void => {
      setItems(originalItems.filter(item => item.name.toLowerCase().indexOf(text.toLowerCase()) >= 0));
    }; */

    return (
        <div>

            <Stack
                horizontalAlign="start"
                verticalAlign="start"
                id="premisesListHeadings"

                styles={{
                    root: {
                        width: "fit-content",
                        marginBottom: 10,
                        marginTop: 20,
                        marginLeft: 20,
                        marginRight: "auto",
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
                        /* boxShadow: "-1px 1px 7px 2px #d4cece", */
                        /* selectors: {
                            '&:hover': { background:   "rgb(104 113 140 / 14%)" },
                        }, */

                    }
                }}
            >

                {/*  <Stack verticalAlign="start" horizontalAlign="start" styles={{
                    root: {
                        textAlign: 'center',
                        alignItems: "center",
                        display: "flex",
                        flexFlow: "row",
                    }
                }}>
                    <div style={{ width: 50, display: "flex" }}></div>
                    <div style={{ width: 350, display: "flex" }}>Premises Details</div>
                    <div style={{ width: 250, display: "flex" }}>Rental Details</div>
                    <div style={{ width: 390, display: "flex" }}>Parking Details</div>
                    <div style={{ width: 275, display: "flex" }}>Tenant Details</div>
                    <div style={{ width: 50, display: "flex" }}></div>






                </Stack> */}

                <Stack verticalAlign="start" horizontalAlign="start" styles={{
                    root: {
                        textAlign: 'center',
                        alignItems: "center",
                        display: "flex",
                        flexFlow: "row",
                    }
                }}>

                    <div style={{ width: 80, display: "flex" }}>
                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={addIcon}
                            ariaLabel="Add Premises"
                            onClick={() => navigationState({ ...navigationState(), showNewPremisesModal: true })}
                        />
                    </div>


                    <div style={{
                        display: "flex",
                        flexFlow: "column",
                        borderTop: "3px solid rgb(210 26 69 / 42%)",
                        borderRight: "3px solid rgb(210 26 69 / 42%)",
                        borderLeft: "3px solid rgb(210 26 69 / 42%)",
                        marginRight: 2,
                        marginLeft: 2,
                    }}>
                        <Text styles={tableHeadingStyles}>Premises Details</Text>
                        <div style={{ display: "flex", flexFlow: "row" }}>
                            <Text styles={tableCellStyles} style={{ width: 100 }}>Floor/ Unit</Text>
                            <Text styles={tableCellStyles}>Area</Text>
                            <Text styles={tableCellStyles}>Vacant</Text>
                            <Text styles={tableCellStyles} style={{ width: 55 }}>Type</Text>
                            <Text styles={tableCellStyles} style={{ width: 100 }}>Occupation Date</Text>
                        </div>
                    </div>
                    <div style={{
                        display: "flex",
                        flexFlow: "column",
                        borderTop: "3px solid rgb(63 55 189 / 42%)",
                        borderRight: "3px solid rgb(63 55 189 / 42%)",
                        borderLeft: "3px solid rgb(63 55 189 / 42%)",
                        marginRight: 2,
                        marginLeft: 2,
                    }}>
                        <Text styles={tableHeadingStyles}>Rental Details</Text>
                        <div style={{ display: "flex", flexFlow: "row" }}>
                            <TooltipHost styles={tooltipHostStyles} content="R/m²/month" id={tooltipNetRentalId} calloutProps={calloutProps}> <Text styles={tableCellStyles}>Net Rental</Text> </TooltipHost>
                            <TooltipHost styles={tooltipHostStyles} content="R/m²/month" id={tooltipOpCostsId} calloutProps={calloutProps}> <Text styles={tableCellStyles}>Op Costs</Text></TooltipHost>
                            <TooltipHost styles={tooltipHostStyles} content="R/m²/month" id={tooltipOtherId} calloutProps={calloutProps}> <Text styles={tableCellStyles}>Other Costs</Text></TooltipHost>
                            <TooltipHost styles={tooltipHostStyles} content="R/m²/month" id={tooltipGrossRentalId} calloutProps={calloutProps}> <Text styles={tableCellStyles}>Gross Rental</Text></TooltipHost>
                            <TooltipHost styles={tooltipHostStyles} content="annual %" id={tooltipEscId} calloutProps={calloutProps}> <Text styles={tableCellStyles}>Esc</Text></TooltipHost>
                        </div>
                    </div>
                    <div style={{
                        display: "flex",
                        flexFlow: "column",
                        borderTop: "3px solid rgb(61 177 123 / 42%)",
                        borderRight: "3px solid rgb(61 177 123 / 42%)",
                        borderLeft: "3px solid rgb(61 177 123 / 42%)",
                        marginRight: 2,
                        marginLeft: 2,
                    }}>
                        <Text styles={tableHeadingStyles}>Parking Details</Text>
                        <div style={{ display: "flex", flexFlow: "row" }}>
                            <Text styles={tableCellStyles}>Open Bays</Text>
                            <TooltipHost styles={tooltipHostStyles} content="R/bay/month" id={tooltipOpenRateId} calloutProps={calloutProps}><Text styles={tableCellStyles}>Open Rate</Text></TooltipHost>
                            <Text styles={tableCellStyles} style={{ width: 50 }}>Covered Bays</Text>
                            <TooltipHost styles={tooltipHostStyles} content="R/bay/month" id={tooltipCoveredRateId} calloutProps={calloutProps}> <Text styles={tableCellStyles} style={{ width: 50 }}>Covered Rate</Text></TooltipHost>
                            <Text styles={tableCellStyles} style={{ width: 50 }}>Shaded Bays</Text>
                            <TooltipHost styles={tooltipHostStyles} content="R/bay/month" id={tooltipShadedRateId} calloutProps={calloutProps}><Text styles={tableCellStyles} style={{ width: 50 }}>Shaded Rate</Text></TooltipHost>
                            <TooltipHost styles={tooltipHostStyles} content="bays/100m²" id={tooltipParkingRatioId} calloutProps={calloutProps}><Text styles={tableCellStyles} style={{ width: 50 }}>Parking Ratio</Text></TooltipHost>
                        </div>
                    </div>
                    <div style={{
                        display: "flex",
                        flexFlow: "column",
                        borderTop: "3px solid rgb(212 236 10 / 42%)",
                        borderRight: "3px solid rgb(212 236 10 / 42%)",
                        borderLeft: "3px solid rgb(212 236 10 / 42%)",
                        marginRight: 2,
                        marginLeft: 2,
                    }}>
                        <Text styles={tableHeadingStyles}>Tenant Details</Text>
                        <div style={{ display: "flex", flexFlow: "row" }}>
                            <Text styles={tableCellStyles} style={{ width: 125 }}>Tenant Name <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></Text>
                            <Text styles={tableCellStyles} style={{ width: 100 }}>Lease Expiry <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> </Text>
                        </div>
                    </div>
                    <Text style={{ width: 60 }} styles={tableCellStyles}>Notes</Text>
                </Stack>
            </Stack>


            {floorSortedPremises.map(premises => {

                return (
                    <PremisesListItem key={premises?.premisesId} premises={premises!} propertyId={singleProperty?.propertyId!}> </PremisesListItem>
                )

            })}

        </div>

    );
};

export default PremisesList