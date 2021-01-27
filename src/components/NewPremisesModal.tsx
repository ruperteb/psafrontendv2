import React, { useState } from 'react';
import { useId, useBoolean } from '@uifabric/react-hooks';
import { TextField, ITextFieldStyles } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { IStackStyles, Stack } from 'office-ui-fabric-react/lib/Stack';
import { IRenderFunction, IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import {
    getTheme,
    mergeStyleSets,
    FontWeights,
    ContextualMenu,
    Toggle,
    IToggleStyles,
    DefaultButton,
    Modal,
    IDragOptions,
    IconButton,
    IIconProps,
    IModalStyles,
    mergeStyles,
    ComboBox,
    Fabric,
    IComboBoxOption,
    IComboBox,
    SelectableOptionMenuItemType,
    IComboBoxStyles,
    DatePicker,
    DayOfWeek,
    IDatePickerStrings,
    IDatePickerStyleProps,
    IDatePickerStyles,
    ICalendarProps
} from 'office-ui-fabric-react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { defaultDataIdFromObject, gql, useMutation, useQuery } from '@apollo/client';
import { GET_SINGLE_PROPERTY, NEW_PREMISES, GET_NAV_STATE } from "../gql/gql"
import { Mutation, MutationPostPremisesArgs, Query, Property } from "../schematypes/schematypes"
import { navigationState } from "../reactivevariables/reactivevariables"
import "./NewPremisesModal.css"




const dragOptions: IDragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
};
const cancelIcon: IIconProps = { iconName: 'Cancel' };
const saveIcon: IIconProps = { iconName: 'Save' };

interface Props {
    propertyId: number;
    showNewPremisesModal: boolean;
}

export const NewPremisesModal: React.FC<Props> = ({ showNewPremisesModal, propertyId }) => {

    const hideNewPremisesModal = () => {
        navigationState({ ...navigationState(), showNewPremisesModal: false })
        setSelectedPremisesType(undefined)
        setSelectedPremisesIndex(undefined)
        setNewPremises({
            floor: "",
            area: 0,
            vacant: "true",
            type: "",
            premisesIndex: 0,
            occupation: getNextMonth(),
            premisesNotes: "",
            netRental: 0,
            opCosts: 0,
            other: 0,
            grossRental: 0,
            esc: 0,
            openBays: 0,
            openRate: 0,
            coveredBays: 0,
            coveredRate: 0,
            shadedBays: 0,
            shadedRate: 0,
            parkingRatio: 0,
            tenantName: "-",
            leaseExpiry: getNextMonth(),
            tenantNotes: "",
            yard: 0,
            height: 0,
            doors: 0,
            loading: "",
            sprinklered: "",
            canopies: "",
            power: "",
        })
        
    }

    const getNextMonth = () => {
        const date = new Date();
        const today = date.getDate();
        const currentMonth = date.getMonth() + 1;
        const currentYear = date.getFullYear();
        var newDate = new Date(currentYear, currentMonth, 1);
        return newDate.toISOString()

    }


    const [newPremises, setNewPremises] = React.useState(
        {
            floor: "",
            area: 0,
            vacant: "true",
            type: "",
            premisesIndex: 0,
            occupation: getNextMonth(),
            premisesNotes: "",
            netRental: 0,
            opCosts: 0,
            other: 0,
            grossRental: 0,
            esc: 0,
            openBays: 0,
            openRate: 0,
            coveredBays: 0,
            coveredRate: 0,
            shadedBays: 0,
            shadedRate: 0,
            parkingRatio: 0,
            tenantName: "-",
            leaseExpiry: getNextMonth(),
            tenantNotes: "",
            yard: 0,
            height: 0,
            doors: 0,
            loading: "",
            sprinklered: "",
            canopies: "",
            power: "",

        });

    console.log(newPremises)

    const [postPremises, { data }] = useMutation<Mutation, MutationPostPremisesArgs>(NEW_PREMISES);

    const saveNewPremises = () => {

        postPremises({
            variables: {
                propertyId: propertyId,
                floor: newPremises.floor,
                area: newPremises.area,
                vacant: newPremises.vacant,
                type: newPremises.type,
                premisesIndex: newPremises.premisesIndex,
                occupation: newPremises.occupation,
                premisesNotes: newPremises.premisesNotes,
                netRental: newPremises.netRental,
                opCosts: newPremises.opCosts,
                other: newPremises.other,
                grossRental: newPremises.grossRental,
                esc: newPremises.esc,
                openBays: newPremises.openBays,
                openRate: newPremises.openRate,
                coveredBays: newPremises.coveredBays,
                coveredRate: newPremises.coveredRate,
                shadedBays: newPremises.shadedBays,
                shadedRate: newPremises.shadedRate,
                parkingRatio: newPremises.parkingRatio,
                tenantName: newPremises.tenantName,
                leaseExpiry: newPremises.leaseExpiry,
                tenantNotes: newPremises.tenantNotes,
                yard: newPremises.yard,
                height: newPremises.height,
                doors: newPremises.doors,
                loading: newPremises.loading,
                sprinklered: newPremises.sprinklered,
                canopies: newPremises.canopies,
                power: newPremises.power,
            },

            update(cache, { data }) {

                if (!data) {
                    return null;
                }

                const getExistingProperty = cache.readQuery<Query>({ query: GET_SINGLE_PROPERTY, variables: { propertyId: propertyId } })
                const existingProperty: Property = getExistingProperty ? getExistingProperty.singleProperty! : { propertyId: 1, propertyName: "" };

                const existingPremises = getExistingProperty ? getExistingProperty.singleProperty?.premisesList : [];
                const newPremises = [...existingPremises!, data.postPremises]

                const newProperty = { ...existingProperty, premisesList: newPremises }
                if (existingPremises)
                    cache.writeQuery<Query>({
                        query: GET_SINGLE_PROPERTY,
                        variables: { propertyId: propertyId },
                        data: { singleProperty: newProperty }
                    });
            }


        })
        hideNewPremisesModal()


    }



    /* const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(false); */

    // Use useId() to ensure that the IDs are unique on the page.
    // (It's also okay to use plain strings and manually ensure uniqueness.)


    const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200, marginRight: 20 } };
    const textFieldFloorStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200, marginRight: 20 } };
    const textFieldAreaStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 150, marginRight: 20 } };
    const textFieldEscStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 150, marginRight: 20 } };
    const textFieldCoordinatesStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 150, marginRight: 20 } };
    const textFieldErfStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200, marginRight: 20 } };
    const textFieldNotesStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 470 } };
    const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 125, marginRight: 20 } };
    const dropdownSectorStyles: Partial<IDropdownStyles> = { dropdown: { width: 420, marginRight: 20 } };
    const dropdownProvinceStyles: Partial<IDropdownStyles> = { dropdown: { width: 140, marginRight: 20 } };
    const comboBoxStyles: Partial<IComboBoxStyles> = { root: { width: 140, marginRight: 20 } }

    const toggleStyles: Partial<IToggleStyles> = { container: { marginTop: 5 }, label: { marginLeft: 4 } };
    const modalStyles: Partial<IModalStyles> = { main: { position: "absolute", top: 150 },  };

    const datePickerStyles: IStyleFunctionOrObject<IDatePickerStyleProps, IDatePickerStyles> = { root: { width: 160, marginRight: 20 }, callout: {} }

    /* const calendarProps: ICalendarProps ={styles  } */



    const headerIconStackStyles: Partial<IStackStyles> = { root: { marginRight: 0, marginLeft: "auto", } }

    const DayPickerStrings: IDatePickerStrings = {
        months: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ],

        shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

        shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

        goToToday: 'Go to today',
        prevMonthAriaLabel: 'Go to previous month',
        nextMonthAriaLabel: 'Go to next month',
        prevYearAriaLabel: 'Go to previous year',
        nextYearAriaLabel: 'Go to next year',
        closeButtonAriaLabel: 'Close date picker',
        monthPickerHeaderAriaLabel: '{0}, select to change the year',
        yearPickerHeaderAriaLabel: '{0}, select to change the month',
    };

    const controlClass = mergeStyleSets({
        control: {
            margin: '0 0 15px 0',
            maxWidth: '300px',
        },

    });

    const premisesTypeOptions = [

        { key: 'Office', text: 'Office' },
        { key: 'Warehouse', text: 'Warehouse' },
        { key: 'Retail', text: 'Retail' },
        { key: 'Stores', text: 'Stores' },
        { key: 'Balcony', text: 'Balcony' },
    ];

    const premisesIndexOptions = [

        { key: '1', text: '1' },
        { key: '2', text: '2' },
        { key: '3', text: '3' },
        { key: '4', text: '5' },
        { key: '5', text: '5' },
        { key: '6', text: '6' },
    ];



    const [selectedPremisesType, setSelectedPremisesType] = React.useState<IDropdownOption>();
    const [selectedPremisesIndex, setSelectedPremisesIndex] = React.useState<IDropdownOption>();



    const onChangePremisesType = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void => {
        if (item !== undefined) {
            setSelectedPremisesType(item);
            setNewPremises({ ...newPremises, type: item.text });
        }
    };

    const onChangePremisesIndex = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void => {
        if (item !== undefined) {
            setSelectedPremisesIndex(item);
            setNewPremises({ ...newPremises, premisesIndex: parseInt(item.text) });
        }
    };


    const stackTokens = { childrenGap: 15 };



    const onChangeFloor = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, floor: newValue || '' });
        },
        [newPremises],
    );

    const onChangeArea = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            console.log(newValue)
            setNewPremises({ ...newPremises, area: parseFloat(newValue!) || 0 });
        },
        [newPremises],
    );


    const handleChecked = () => {
        if (newPremises.vacant === "false") {
            return false
        } else {
            return true
        }

    }

    const onChangeVacantToggle = React.useCallback(
        (ev: React.MouseEvent<HTMLElement>, checked: boolean | undefined) => {
            if (newPremises.vacant === "false") {
                setNewPremises({ ...newPremises, vacant: "true" });

            } else {
                setNewPremises({ ...newPremises, vacant: "false" });
            }
        },
        [newPremises])

    const onSelectOccupationDate = React.useCallback(
        (date: Date | null | undefined) => {
            if (date !== undefined && date !== null)
                setNewPremises({ ...newPremises, occupation: date.toISOString() });
        },
        [newPremises])

    const onFormatDate = (date?: Date): string => {
        return !date ? '' : date.toLocaleDateString(
            'en-gb',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        );
    };



    const onChangePremisesNotes = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, premisesNotes: newValue || '' });
        },
        [newPremises],
    );

    const onChangeNetRental = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, netRental: parseFloat(newValue!) || 0 });
        },
        [newPremises],
    );

    const onChangeOpCosts = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, opCosts: parseFloat(newValue!) || 0 });
        },
        [newPremises],
    );

    const onChangeOther = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, other: parseFloat(newValue!) || 0 });
        },
        [newPremises],
    );

    const onChangeGrossRental = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, grossRental: parseFloat(newValue!) || 0 });
        },
        [newPremises],
    );

    const onChangeEsc = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, esc: parseFloat(newValue!) || 0 });
        },
        [newPremises],
    );

    const onChangeOpenBays = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, openBays: parseFloat(newValue!) || 0 });
        },
        [newPremises],
    );

    const onChangeOpenRate = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, openRate: parseFloat(newValue!) || 0 });
        },
        [newPremises],
    );

    const onChangeCoveredBays = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, coveredBays: parseFloat(newValue!) || 0 });
        },
        [newPremises],
    );

    const onChangeCoveredRate = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, coveredRate: parseFloat(newValue!) || 0 });
        },
        [newPremises],
    );

    const onChangeShadedBays = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, shadedBays: parseFloat(newValue!) || 0 });
        },
        [newPremises],
    );

    const onChangeShadedRate = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, shadedRate: parseFloat(newValue!) || 0 });
        },
        [newPremises],
    );

    const onChangeParkingRatio = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, parkingRatio: parseFloat(newValue!) || 0 });
        },
        [newPremises],
    );

    const onChangeTenantName = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, tenantName: newValue || '' });
        },
        [newPremises],
    );

    const onSelectLeaseExpiry = React.useCallback(
        (date: Date | null | undefined) => {
            if (date !== undefined && date !== null)
                setNewPremises({ ...newPremises, leaseExpiry: date.toISOString() });
        },
        [newPremises])

    const onChangeTenantNotes = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewPremises({ ...newPremises, tenantNotes: newValue || '' });
        },
        [newPremises],
    );


    const [selectedKey, setSelectedKey] = React.useState('Premises Details');

    const handleLinkClick = (item?: PivotItem, ev?: React.MouseEvent<HTMLElement>) => {

        setSelectedKey(item!.props.itemKey!);
    };

    const getTabId = (itemKey: string | undefined) => {
        return `NewPremisesPivot_${itemKey}`;
    };

    const titleId = useId('New Premises');


    const newPremisesTab = () => {

        switch (selectedKey) {
            case "Premises Details":
                return (
                    <>
                        <Stack horizontal /* style={{marginLeft: 50}} */
                            styles={{
                                root: {
                                    /* width: '400px', */
                                    /*  margin: '10px', */

                                    color: '#605e5c',

                                    marginLeft: "0px",
                                    marginRight: "auto",
                                    /* display: "block" */

                                }

                            }}>
                            <TextField
                                label="Floor/Unit"
                                value={newPremises.floor}
                                onChange={onChangeFloor}
                                styles={textFieldFloorStyles}

                            />
                            <TextField
                                label="Area"
                                type="number"
                                value={newPremises.area === 0 ? "" : String(newPremises.area)}
                                onChange={onChangeArea}
                                styles={textFieldAreaStyles}
                                suffix="m²"
                            />

                            <Toggle styles={toggleStyles} label="Vacant?" checked={handleChecked()} onChange={onChangeVacantToggle} />



                        </Stack>

                        <Stack horizontal styles={{
                            root: {
                                /* width: '400px', */
                                /*  margin: '10px', */

                                color: '#605e5c',

                                marginLeft: "0px",
                                marginRight: "auto",
                                /* display: "block" */

                            }

                        }}>

                            <Dropdown
                                label="Premises Type"
                                selectedKey={selectedPremisesType ? selectedPremisesType.key : undefined}
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange={onChangePremisesType}
                                placeholder="Select type"
                                options={premisesTypeOptions}
                                styles={dropdownStyles}
                            />

                            <Dropdown
                                label="Premises Index"
                                selectedKey={selectedPremisesIndex ? selectedPremisesIndex.key : undefined}
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange={onChangePremisesIndex}
                                placeholder="Select index"
                                options={premisesIndexOptions}
                                styles={dropdownStyles}
                            />

                            <DatePicker
                                label="Occupation Date"
                                className={controlClass.control}
                                firstDayOfWeek={DayOfWeek.Monday}
                                strings={DayPickerStrings}
                                placeholder="Select a date..."
                                ariaLabel="Select a date"
                                value={new Date(newPremises.occupation)}
                                onSelectDate={onSelectOccupationDate}
                                formatDate={onFormatDate}
                                styles={datePickerStyles}

                            />

                        </Stack>

                        <Stack horizontal>

                            <TextField
                                label="Premises Notes"
                                value={newPremises.premisesNotes}
                                onChange={onChangePremisesNotes}
                                styles={textFieldNotesStyles}
                                multiline
                                autoAdjustHeight
                            />

                        </Stack>
                    </>
                )

            case "Rental Details":

                return (
                    <>
                        <Stack horizontal
                            styles={{
                                root: {
                                    /* width: '400px', */
                                    /*  margin: '10px', */

                                    color: '#605e5c',

                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    /* display: "block" */

                                }
                            }}>
                            <TextField
                                label="Net Rental"
                                type="number"
                                value={newPremises.netRental === 0 ? "" : String(newPremises.netRental)}
                                onChange={onChangeNetRental}
                                styles={textFieldFloorStyles}

                                prefix="R"
                                suffix="/m²/month"
                            />
                            <TextField
                                label="Op Costs"
                                type="number"
                                value={newPremises.opCosts === 0 ? "" : String(newPremises.opCosts)}
                                onChange={onChangeOpCosts}
                                styles={textFieldFloorStyles}
                                prefix="R"
                                suffix="/m²/month"
                            />

                        </Stack>

                        <Stack horizontal
                            styles={{
                                root: {
                                    /* width: '400px', */
                                    /*  margin: '10px', */

                                    color: '#605e5c',

                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    /* display: "block" */

                                }
                            }}>
                            <TextField
                                label="Other"
                                type="number"
                                value={newPremises.other === 0 ? "" : String(newPremises.other)}
                                onChange={onChangeOther}
                                styles={textFieldFloorStyles}
                                prefix="R"
                                suffix="/m²/month"
                            />
                            <TextField
                                label="Gross Rental"
                                type="number"
                                value={newPremises.grossRental === 0 ? "" : String(newPremises.grossRental)}
                                onChange={onChangeGrossRental}
                                styles={textFieldFloorStyles}
                                prefix="R"
                                suffix="/m²/month"
                            />



                        </Stack>

                        <Stack horizontal
                            styles={{
                                root: {
                                    /* width: '400px', */
                                    /*  margin: '10px', */

                                    color: '#605e5c',

                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    /* display: "block" */

                                }
                            }}>


                            <TextField
                                label="Esc"
                                type="number"
                                value={newPremises.esc === 0 ? "" : String(newPremises.esc)}
                                onChange={onChangeEsc}
                                styles={textFieldEscStyles}
                                suffix="% per annum"
                            />

                        </Stack>
                    </>
                )

            case "Parking Details":

                return (
                    <>
                        <Stack horizontal
                            styles={{
                                root: {
                                    /* width: '400px', */
                                    /*  margin: '10px', */

                                    color: '#605e5c',

                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    /* display: "block" */

                                }
                            }}>
                            <TextField
                                label="Open Bays"
                                type="number"
                                value={newPremises.openBays === 0 ? "" : String(newPremises.openBays)}
                                onChange={onChangeOpenBays}
                                styles={textFieldFloorStyles}
                                suffix="bays"
                            />
                            <TextField
                                label="Open Rate"
                                type="number"
                                value={newPremises.openRate === 0 ? "" : String(newPremises.openRate)}
                                onChange={onChangeOpenRate}
                                styles={textFieldFloorStyles}
                                prefix="R"
                                suffix="/bay/month"
                            />

                        </Stack>

                        <Stack horizontal
                            styles={{
                                root: {
                                    /* width: '400px', */
                                    /*  margin: '10px', */

                                    color: '#605e5c',

                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    /* display: "block" */

                                }
                            }}>
                            <TextField
                                label="Covered Bays"
                                type="number"
                                value={newPremises.coveredBays === 0 ? "" : String(newPremises.coveredBays)}
                                onChange={onChangeCoveredBays}
                                styles={textFieldFloorStyles}
                                suffix="bays"
                            />
                            <TextField
                                label="Covered Rate"
                                type="number"
                                value={newPremises.coveredRate === 0 ? "" : String(newPremises.coveredRate)}
                                onChange={onChangeCoveredRate}
                                styles={textFieldFloorStyles}
                                prefix="R"
                                suffix="/bay/month"
                            />



                        </Stack>

                        <Stack horizontal
                            styles={{
                                root: {
                                    /* width: '400px', */
                                    /*  margin: '10px', */

                                    color: '#605e5c',

                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    /* display: "block" */

                                }
                            }}>


                            <TextField
                                label="Shaded Bays"
                                type="number"
                                value={newPremises.shadedBays === 0 ? "" : String(newPremises.shadedBays)}
                                onChange={onChangeShadedBays}
                                styles={textFieldFloorStyles}
                                suffix="bays"
                            />
                            <TextField
                                label="Shaded Rate"
                                type="number"
                                value={newPremises.shadedRate === 0 ? "" : String(newPremises.shadedRate)}
                                onChange={onChangeShadedRate}
                                styles={textFieldFloorStyles}
                                prefix="R"
                                suffix="/bay/month"
                            />

                        </Stack>
                        <Stack horizontal
                            styles={{
                                root: {
                                    /* width: '400px', */
                                    /*  margin: '10px', */

                                    color: '#605e5c',

                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    /* display: "block" */

                                }
                            }}>


                            <TextField
                                label="Parking Ratio"
                                type="number"
                                value={newPremises.parkingRatio === 0 ? "" : String(newPremises.parkingRatio)}
                                onChange={onChangeParkingRatio}
                                styles={textFieldFloorStyles}

                                suffix="bays/100m²"
                            />


                        </Stack>
                    </>
                )


            case "Tenant Details":

                return (
                    <>
                        

                        <Stack horizontal styles={{
                            root: {
                                /* width: '400px', */
                                /*  margin: '10px', */

                                color: '#605e5c',

                                marginLeft: "0px",
                                marginRight: "auto",
                                /* display: "block" */

                            }

                        }}>

                            <TextField
                                label="Tenant Name"
                                value={newPremises.tenantName === "-"? "" : newPremises.tenantName}
                                onChange={onChangeTenantName}
                                styles={textFieldFloorStyles}

                            />

                            <DatePicker
                                label="Lease Expiry Date"
                                className={controlClass.control}
                                firstDayOfWeek={DayOfWeek.Monday}
                                strings={DayPickerStrings}
                                placeholder="Select a date..."
                                ariaLabel="Select a date"
                                value={new Date(newPremises.leaseExpiry)}
                                onSelectDate={onSelectLeaseExpiry}
                                formatDate={onFormatDate}
                                styles={datePickerStyles}

                            />

                        </Stack>

                        <Stack horizontal>

                            <TextField
                                label="Tenant Notes"
                                value={newPremises.tenantNotes}
                                onChange={onChangeTenantNotes}
                                styles={textFieldNotesStyles}
                                multiline
                                autoAdjustHeight
                            />

                        </Stack>
                    </>
                )


            default:
            // code block
        }

    }

    return (
        <div>


            <Modal
                styles={modalStyles}

                titleAriaId={titleId}
                isOpen={showNewPremisesModal}
                /* onDismiss={hideNewPremisesModal} */
                isBlocking={false}
                containerClassName={contentStyles.container}
            /* dragOptions={dragOptions} */
            >
                <div className={contentStyles.header}>
                    <span id={titleId}>New Premises</span>
                    <Stack horizontal
                        styles={headerIconStackStyles}
                    >

                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={saveIcon}
                            ariaLabel="Save Premises"
                            onClick={saveNewPremises}
                        />
                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={cancelIcon}
                            ariaLabel="Close popup modal"
                            onClick={hideNewPremisesModal}
                        />

                    </Stack>

                </div>
                <div className={contentStyles.body} >

                    <Stack tokens={stackTokens}>

                        <Pivot
                            aria-label="Separately Rendered Content Pivot Example"
                            selectedKey={selectedKey}
                            // eslint-disable-next-line react/jsx-no-bind
                            onLinkClick={handleLinkClick}
                            headersOnly={true}
                            getTabId={getTabId}
                        >
                            <PivotItem headerText="Premises Details" itemKey="Premises Details" />
                            <PivotItem headerText="Rental Details" itemKey="Rental Details" />
                            <PivotItem headerText="Parking Details" itemKey="Parking Details" />
                            <PivotItem headerText="Tenant Details" itemKey="Tenant Details" />
                        </Pivot>

                        {newPremisesTab()}





                    </Stack>


                </div>
            </Modal>
        </div>
    );
};

const theme = getTheme();
const contentStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
        /*  width: 525, */

    },

    header: [

        theme.fonts.xLargePlus,
        {
            flex: '1 1 auto',
            borderTop: `4px solid ${theme.palette.themePrimary}`,
            color: theme.palette.neutralPrimary,
            display: 'flex',
            alignItems: 'center',
            fontWeight: FontWeights.semibold,
            padding: '12px 12px 14px 24px',
        },
    ],
    body: {
        flex: '4 4 auto',
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        selectors: {
            p: { margin: '14px 0' },
            'p:first-child': { marginTop: 0 },
            'p:last-child': { marginBottom: 0 },
        },
    },
});

const iconButtonStyles = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: "10px !important",
        marginTop: '4px',
        marginRight: '2px',

    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
    icon: {
        fontSize: "24px",

    }
};

export default NewPremisesModal
