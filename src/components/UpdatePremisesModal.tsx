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
import { GET_SINGLE_PROPERTY, UPDATE_PREMISES, GET_NAV_STATE } from "../gql/gql"
import { Mutation, MutationUpdatePremisesArgs, Query, Property, Premises } from "../schematypes/schematypes"
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
    premisesId: number
    showUpdatePremisesModal: boolean;
}

export const UpdatePremisesModal: React.FC<Props> = ({ showUpdatePremisesModal, propertyId, premisesId }) => {



    const {
        data: propertyData,
        loading: propertyLoading,
        error: propertyError
    } = useQuery<Query>(GET_SINGLE_PROPERTY, {
        variables: { propertyId: propertyId },
    });


    const getPremises = propertyData?.singleProperty?.premisesList!.find(premises => premises?.premisesId === premisesId);
    const handlePremisesData = React.useCallback(() => {
        if (getPremises !== undefined && getPremises !== null) {
            return { ...getPremises, openRatio: getPremises.openBays! / (getPremises.area! / 100), coveredRatio: getPremises.coveredBays! / (getPremises.area! / 100), shadedRatio: getPremises.shadedBays! / (getPremises.area! / 100), }
        } else {
            return {
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
                openRatio: 0,
                coveredBays: 0,
                coveredRate: 0,
                coveredRatio: 0,
                shadedBays: 0,
                shadedRate: 0,
                shadedRatio: 0,
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

            }
        }
    }, [getPremises])


    React.useEffect(() => {
        setUpdatedPremises(handlePremisesData)
        setSelectedPremisesType({ key: handlePremisesData().type!, text: handlePremisesData().type! })
        setSelectedPremisesIndex(({ key: handlePremisesData().premisesIndex!, text: String(handlePremisesData().premisesIndex!) }))

    }, [handlePremisesData])




    const hideUpdatePremisesModal = () => {

        navigationState({ ...navigationState(), showUpdatePremisesModal: false })

    }

    const getNextMonth = () => {
        const date = new Date();
        const today = date.getDate();
        const currentMonth = date.getMonth() + 1;
        const currentYear = date.getFullYear();
        var newDate = new Date(currentYear, currentMonth, 1);
        return newDate.toISOString()

    }


    const [updatedPremises, setUpdatedPremises] = React.useState<any>(
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
            openRatio: 0,
            coveredBays: 0,
            coveredRate: 0,
            coveredRatio: 0,
            shadedBays: 0,
            shadedRate: 0,
            shadedRatio: 0,
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




    const [updatePremises, { data }] = useMutation<Mutation, MutationUpdatePremisesArgs>(UPDATE_PREMISES);

    const saveUpdatedPremises = () => {

        updatePremises({
            variables: {
                premisesId: premisesId,
                floor: updatedPremises.floor,
                area: updatedPremises.area,
                vacant: updatedPremises.vacant,
                type: updatedPremises.type,
                premisesIndex: updatedPremises.premisesIndex,
                occupation: updatedPremises.occupation,
                premisesNotes: updatedPremises.premisesNotes,
                netRental: updatedPremises.netRental,
                opCosts: updatedPremises.opCosts,
                other: updatedPremises.other,
                grossRental: updatedPremises.grossRental,
                esc: updatedPremises.esc,
                openBays: updatedPremises.openBays,
                openRate: updatedPremises.openRate,
                coveredBays: updatedPremises.coveredBays,
                coveredRate: updatedPremises.coveredRate,
                shadedBays: updatedPremises.shadedBays,
                shadedRate: updatedPremises.shadedRate,
                parkingRatio: updatedPremises.parkingRatio,
                tenantName: updatedPremises.tenantName,
                leaseExpiry: updatedPremises.leaseExpiry,
                tenantNotes: updatedPremises.tenantNotes,
                yard: updatedPremises.yard,
                height: updatedPremises.height,
                doors: updatedPremises.doors,
                loading: updatedPremises.loading,
                sprinklered: updatedPremises.sprinklered,
                canopies: updatedPremises.canopies,
                power: updatedPremises.power,
            },

            update(cache, { data }) {

                if (!data) {
                    return null;
                }

                const getExistingProperty = cache.readQuery<Query>({ query: GET_SINGLE_PROPERTY, variables: { propertyId: propertyId } })
                const existingProperty: Property = getExistingProperty ? getExistingProperty.singleProperty! : { propertyId: 1, propertyName: "" };

                const existingPremises = getExistingProperty ? getExistingProperty.singleProperty?.premisesList : [];
                const filteredPremises = existingPremises?.filter(premises => {
                    return premises.premisesId !== premisesId
                })

                const updatedPremises = data.updatePremises

                const newPremisesList = [...filteredPremises!, updatedPremises]

                const newProperty = { ...existingProperty, premisesList: newPremisesList }
                if (existingPremises)
                    cache.writeQuery<Query>({
                        query: GET_SINGLE_PROPERTY,
                        variables: { propertyId: propertyId },
                        data: { singleProperty: newProperty }
                    });
            }


        })
        hideUpdatePremisesModal()



    }



    /* const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(false); */

    // Use useId() to ensure that the IDs are unique on the page.
    // (It's also okay to use plain strings and manually ensure uniqueness.)


    const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200, marginRight: 20 } };
    const textFieldFloorStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200, marginRight: 20 } };
    const textFieldAreaStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 150, marginRight: 20 } };
    const textFieldYardStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 125, marginRight: 20 } };
    const textFieldPowerStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200, marginRight: 20 } };
    const textFieldEscStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 150, marginRight: 20 } };
    const textFieldCoordinatesStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 150, marginRight: 20 } };
    const textFieldErfStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200, marginRight: 20 } };
    const textFieldNotesStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 470 } };
    const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 125, marginRight: 20 } };
    const dropdownSectorStyles: Partial<IDropdownStyles> = { dropdown: { width: 420, marginRight: 20 } };
    const dropdownProvinceStyles: Partial<IDropdownStyles> = { dropdown: { width: 140, marginRight: 20 } };
    const comboBoxStyles: Partial<IComboBoxStyles> = { root: { width: 140, marginRight: 20 } }

    const textFieldParkingBaysStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 100, marginRight: 20 } };
    const textFieldParkingRateStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 185, marginRight: 20 } };
    const textFieldParkingRatioStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 140, marginRight: 20 } };

    const toggleStyles: Partial<IToggleStyles> = { container: { marginTop: 5 }, label: { marginLeft: 4 } };
    const modalStyles: Partial<IModalStyles> = { main: { position: "absolute", top: 150 }, };

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

        { key: 1, text: "1" },
        { key: 2, text: "2" },
        { key: 3, text: "3" },
        { key: 4, text: "4" },
        { key: 5, text: "5" },
        { key: 6, text: "6" },
    ];



    const [selectedPremisesType, setSelectedPremisesType] = React.useState<IDropdownOption>();
    const [selectedPremisesIndex, setSelectedPremisesIndex] = React.useState<IDropdownOption>();


    const onChangePremisesType = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void => {
        if (item !== undefined) {
            setSelectedPremisesType(item);
            setUpdatedPremises({ ...updatedPremises, type: item.text });
        }
    };

    const onChangePremisesIndex = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void => {
        if (item !== undefined) {
            setSelectedPremisesIndex(item);
            setUpdatedPremises({ ...updatedPremises, premisesIndex: parseInt(item.text) });
        }
    };


    const stackTokens = { childrenGap: 15 };



    const onChangeFloor = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, floor: newValue || '' });
        },
        [updatedPremises],
    );

    const onChangeArea = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            console.log(newValue)
            setUpdatedPremises({ ...updatedPremises, area: parseFloat(newValue!) || 0 });
        },
        [updatedPremises],
    );


    const handleChecked = () => {
        if (updatedPremises.vacant === "false") {
            return false
        } else {
            return true
        }

    }

    const onChangeVacantToggle = React.useCallback(
        (ev: React.MouseEvent<HTMLElement>, checked: boolean | undefined) => {
            if (updatedPremises.vacant === "false") {
                setUpdatedPremises({ ...updatedPremises, vacant: "true" });

            } else {
                setUpdatedPremises({ ...updatedPremises, vacant: "false" });
            }
        },
        [updatedPremises])

    const onSelectOccupationDate = React.useCallback(
        (date: Date | null | undefined) => {
            if (date !== undefined && date !== null)
                setUpdatedPremises({ ...updatedPremises, occupation: date.toISOString() });
        },
        [updatedPremises])

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
            setUpdatedPremises({ ...updatedPremises, premisesNotes: newValue || '' });
        },
        [updatedPremises],
    );

    const onChangeNetRental = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, netRental: parseFloat(newValue!) || 0 });
        },
        [updatedPremises],
    );

    const onChangeOpCosts = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, opCosts: parseFloat(newValue!) || 0 });
        },
        [updatedPremises],
    );

    const onChangeOther = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, other: parseFloat(newValue!) || 0 });
        },
        [updatedPremises],
    );

    const onChangeGrossRental = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, grossRental: parseFloat(newValue!) || 0 });
        },
        [updatedPremises],
    );

    const onChangeEsc = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, esc: parseFloat(newValue!) || 0 });
        },
        [updatedPremises],
    );

    const getOpenBays = (ratio: number) => {
        return (ratio * (updatedPremises.area / 100))
    }

    const getOpenRatio = (bays: number) => {
        return (bays / (updatedPremises.area / 100))
    }

    const getCoveredBays = (ratio: number) => {
        return (ratio * (updatedPremises.area / 100))
    }

    const getCoveredRatio = (bays: number) => {
        return (bays / (updatedPremises.area / 100))
    }

    const getShadedBays = (ratio: number) => {
        return (ratio * (updatedPremises.area / 100))
    }

    const getShadedRatio = (bays: number) => {
        return (bays / (updatedPremises.area / 100))
    }

    const onChangeOpenBays = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, openBays: parseFloat(newValue!) || 0, openRatio: getOpenRatio(parseFloat(newValue!)) });
        },
        [updatedPremises],
    );

    const onChangeOpenRate = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, openRate: parseFloat(newValue!) || 0 });
        },
        [updatedPremises],
    );


    const onChangeOpenRatio = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, openRatio: parseFloat(newValue!) || 0, openBays: getOpenBays(parseFloat(newValue!)) });
        },
        [updatedPremises],
    );

    const onChangeCoveredBays = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, coveredBays: parseFloat(newValue!) || 0, coveredRatio: getCoveredRatio(parseFloat(newValue!)) });
        },
        [updatedPremises],
    );

    const onChangeCoveredRate = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, coveredRate: parseFloat(newValue!) || 0 });
        },
        [updatedPremises],
    );

    const onChangeCoveredRatio = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, coveredRatio: parseFloat(newValue!) || 0, coveredBays: getCoveredBays(parseFloat(newValue!)) });
        },
        [updatedPremises],
    );

    const onChangeShadedBays = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, shadedBays: parseFloat(newValue!) || 0, shadedRatio: getShadedRatio(parseFloat(newValue!)) });
        },
        [updatedPremises],
    );

    const onChangeShadedRate = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, shadedRate: parseFloat(newValue!) || 0 });
        },
        [updatedPremises],
    );

    const onChangeShadedRatio = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, shadedRatio: parseFloat(newValue!) || 0, shadedBays: getShadedBays(parseFloat(newValue!)) });
        },
        [updatedPremises],
    );

    const onChangeParkingRatio = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, parkingRatio: parseFloat(newValue!) || 0 });
        },
        [updatedPremises],
    );

    const onChangeTenantName = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, tenantName: newValue || '' });
        },
        [updatedPremises],
    );

    const onSelectLeaseExpiry = React.useCallback(
        (date: Date | null | undefined) => {
            if (date !== undefined && date !== null)
                setUpdatedPremises({ ...updatedPremises, leaseExpiry: date.toISOString() });
        },
        [updatedPremises])

    const onChangeTenantNotes = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, tenantNotes: newValue || '' });
        },
        [updatedPremises],
    );

    const onChangeYard = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, yard: parseFloat(newValue!) || 0 });
        },
        [updatedPremises],
    );

    const onChangeHeight = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, height: parseFloat(newValue!) || 0 });
        },
        [updatedPremises],
    );

    const onChangeDoors = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, doors: parseFloat(newValue!) || 0 });
        },
        [updatedPremises],
    );

    const onChangeLoading = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, loading: newValue || '' });
        },
        [updatedPremises],
    );

    const onChangeSprinklered = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, sprinklered: newValue || '' });
        },
        [updatedPremises],
    );

    const onChangeCanopies = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, canopies: newValue || '' });
        },
        [updatedPremises],
    );

    const onChangePower = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdatedPremises({ ...updatedPremises, power: newValue || '' });
        },
        [updatedPremises],
    );




    /* const onChangeCoordinates = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewProperty({ ...newProperty, coordinates: newValue || '' });
        },
        [newProperty],
    );
    const onChangeErfExtent = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewProperty({ ...newProperty, erfExtent: parseInt(newValue!) || 0 });
        },
        [newProperty],
    );
    const onChangeTotalGLA = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewProperty({ ...newProperty, totalGLA: parseInt(newValue!) || 0 });
        },
        [newProperty],
    );
    const onChangeNotes = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setNewProperty({ ...newProperty, notes: newValue || '' });
        },
        [newProperty],
    ); */

    const [selectedKey, setSelectedKey] = React.useState('Premises Details');

    const handleLinkClick = (item?: PivotItem, ev?: React.MouseEvent<HTMLElement>) => {

        setSelectedKey(item!.props.itemKey!);
    };

    const getTabId = (itemKey: string | undefined) => {
        return `NewPremisesPivot_${itemKey}`;
    };

    const titleId = useId('title');



    const updatePremisesTab = () => {

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
                                value={updatedPremises.floor}
                                onChange={onChangeFloor}
                                styles={textFieldFloorStyles}

                            />
                            <TextField
                                label="Area"
                                type="number"
                                value={updatedPremises.area === 0 ? "" : String(updatedPremises.area)}
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
                                value={new Date(updatedPremises.occupation)}
                                onSelectDate={onSelectOccupationDate}
                                formatDate={onFormatDate}
                                styles={datePickerStyles}

                            />

                        </Stack>

                        <Stack horizontal>

                            <TextField
                                label="Premises Notes"
                                value={updatedPremises.premisesNotes}
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
                                value={updatedPremises.netRental === 0 ? "" : String(updatedPremises.netRental)}
                                onChange={onChangeNetRental}
                                styles={textFieldFloorStyles}

                                prefix="R"
                                suffix="/m²/month"
                            />
                            <TextField
                                label="Op Costs"
                                type="number"
                                value={updatedPremises.opCosts === 0 ? "" : String(updatedPremises.opCosts)}
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
                                value={updatedPremises.other === 0 ? "" : String(updatedPremises.other)}
                                onChange={onChangeOther}
                                styles={textFieldFloorStyles}
                                prefix="R"
                                suffix="/m²/month"
                            />
                            <TextField
                                label="Gross Rental"
                                type="number"
                                value={updatedPremises.grossRental === 0 ? "" : String(updatedPremises.grossRental)}
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
                                value={updatedPremises.esc === 0 ? "" : String(updatedPremises.esc)}
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
                                value={updatedPremises.openBays === 0 ? "" : String(updatedPremises.openBays)}
                                onChange={onChangeOpenBays}
                                styles={textFieldParkingBaysStyles}
                                suffix="bays"
                            />
                            <TextField
                                label="Open Rate"
                                type="number"
                                value={updatedPremises.openRate === 0 ? "" : String(updatedPremises.openRate)}
                                onChange={onChangeOpenRate}
                                styles={textFieldParkingRateStyles}
                                prefix="R"
                                suffix="/bay/month"
                            />

                            <TextField
                                label="Open Ratio"
                                type="number"
                                value={updatedPremises.openRatio === 0 ? "" : String(updatedPremises.openRatio.toFixed(1).replace(/[.,]0$/, ""))}
                                onChange={onChangeOpenRatio}
                                styles={textFieldParkingRatioStyles}

                                suffix="bays/100m²"
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
                                value={updatedPremises.coveredBays === 0 ? "" : String(updatedPremises.coveredBays)}
                                onChange={onChangeCoveredBays}
                                styles={textFieldParkingBaysStyles}
                                suffix="bays"
                            />
                            <TextField
                                label="Covered Rate"
                                type="number"
                                value={updatedPremises.coveredRate === 0 ? "" : String(updatedPremises.coveredRate)}
                                onChange={onChangeCoveredRate}
                                styles={textFieldParkingRateStyles}
                                prefix="R"
                                suffix="/bay/month"
                            />

                            <TextField
                                label="Covered Ratio"
                                type="number"
                                value={updatedPremises.coveredRatio === 0 ? "" : String(updatedPremises.coveredRatio.toFixed(1).replace(/[.,]0$/, ""))}
                                onChange={onChangeCoveredRatio}
                                styles={textFieldParkingRatioStyles}

                                suffix="bays/100m²"
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
                                value={updatedPremises.shadedBays === 0 ? "" : String(updatedPremises.shadedBays)}
                                onChange={onChangeShadedBays}
                                styles={textFieldParkingBaysStyles}
                                suffix="bays"
                            />
                            <TextField
                                label="Shaded Rate"
                                type="number"
                                value={updatedPremises.shadedRate === 0 ? "" : String(updatedPremises.shadedRate)}
                                onChange={onChangeShadedRate}
                                styles={textFieldParkingRateStyles}
                                prefix="R"
                                suffix="/bay/month"
                            />

                            <TextField
                                label="Shaded Ratio"
                                type="number"
                                value={updatedPremises.shadedRatio === 0 ? "" : String(updatedPremises.shadedRatio.toFixed(1).replace(/[.,]0$/, ""))}
                                onChange={onChangeShadedRatio}
                                styles={textFieldParkingRatioStyles}

                                suffix="bays/100m²"
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
                                value={updatedPremises.parkingRatio === 0 ? "" : String(updatedPremises.parkingRatio.toFixed(1).replace(/[.,]0$/, ""))}
                                onChange={onChangeParkingRatio}
                                styles={textFieldFloorStyles}

                                suffix="bays/100m²"
                            />


                        </Stack>
                    </>
                )

            case "Industrial Features":

                return (
                    <>


                        <Stack horizontal styles={{
                            root: {
                                color: '#605e5c',
                                marginLeft: "auto",
                                marginRight: "auto",
                            }
                        }}>

                            <TextField
                                label="Yard Size"
                                value={updatedPremises.yard === 0 ? "" : String(updatedPremises.yard)}
                                onChange={onChangeYard}
                                styles={textFieldYardStyles}
                                suffix="m²"

                            />

                            <TextField
                                label="Floor to Eave Height"
                                value={updatedPremises.height === 0 ? "" : String(updatedPremises.height)}
                                onChange={onChangeHeight}
                                styles={textFieldYardStyles}
                                suffix="m"
                            />

                            <TextField
                                label="No of Doors"
                                value={updatedPremises.doors === 0 ? "" : String(updatedPremises.doors)}
                                onChange={onChangeDoors}
                                styles={textFieldYardStyles}

                            />



                        </Stack>

                        <Stack horizontal styles={{
                            root: {
                                color: '#605e5c',
                                marginLeft: "auto",
                                marginRight: "auto",
                            }
                        }}>

                            <TextField
                                label="Loading Type"
                                value={updatedPremises.loading === "" ? "" : updatedPremises.loading}
                                onChange={onChangeLoading}
                                styles={textFieldPowerStyles}

                            />

                            <TextField
                                label="Sprinkler Type"
                                value={updatedPremises.sprinklered === "" ? "" : updatedPremises.sprinklered}
                                onChange={onChangeSprinklered}
                                styles={textFieldPowerStyles}

                            />

                        </Stack>

                        <Stack horizontal styles={{
                            root: {
                                color: '#605e5c',
                                marginLeft: "auto",
                                marginRight: "auto",
                            }
                        }}>

                            <TextField
                                label="Canopy Details"
                                value={updatedPremises.canopies === "" ? "" : updatedPremises.canopies}
                                onChange={onChangeCanopies}
                                styles={textFieldPowerStyles}

                            />

                            <TextField
                                label="Power"
                                value={updatedPremises.power === "" ? "" : updatedPremises.power}
                                onChange={onChangePower}
                                styles={textFieldPowerStyles}

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
                                value={updatedPremises.tenantName === "-" ? "" : updatedPremises.tenantName}
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
                                value={new Date(updatedPremises.leaseExpiry)}
                                onSelectDate={onSelectLeaseExpiry}
                                formatDate={onFormatDate}
                                styles={datePickerStyles}

                            />

                        </Stack>

                        <Stack horizontal>

                            <TextField
                                label="Tenant Notes"
                                value={updatedPremises.tenantNotes}
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
                isOpen={showUpdatePremisesModal}
                /*  onDismiss={hideUpdatePremisesModal} */
                isBlocking={false}
                containerClassName={contentStyles.container}
            /* dragOptions={dragOptions} */
            >
                <div className={contentStyles.header}>
                    <span id={titleId}>Update Premises</span>
                    <Stack horizontal
                        styles={headerIconStackStyles}
                    >

                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={saveIcon}
                            ariaLabel="Save Premises"
                            onClick={saveUpdatedPremises}
                        />
                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={cancelIcon}
                            ariaLabel="Close popup modal"
                            onClick={hideUpdatePremisesModal}
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
                            styles={{ link: {/* padding:0, margin:0, fontSize:14 */  marginRight: 20 }, linkIsSelected: {/* padding:0, margin:0, fontSize:14 */marginRight: 20 }, root: { marginLeft: "auto", marginRight: "auto" } }}
                        >
                            <PivotItem headerText="Premises" itemKey="Premises Details" />
                            <PivotItem headerText="Rental" itemKey="Rental Details" />
                            <PivotItem headerText="Parking" itemKey="Parking Details" />
                            <PivotItem headerText="Industrial" itemKey="Industrial Features" />
                            <PivotItem headerText="Tenant" itemKey="Tenant Details" />
                        </Pivot>

                        {updatePremisesTab()}





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
        width: 525,

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

export default UpdatePremisesModal
