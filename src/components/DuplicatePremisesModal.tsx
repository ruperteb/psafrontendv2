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
import { Mutation, MutationPostPremisesArgs, Query, Property, Premises } from "../schematypes/schematypes"
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
    showDuplicatePremisesModal: boolean;
}

export const DuplicatePremisesModal: React.FC<Props> = ({ showDuplicatePremisesModal, propertyId, premisesId }) => {



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
        setDuplicatedPremises(handlePremisesData)
        setSelectedPremisesType({ key: handlePremisesData().type!, text: handlePremisesData().type! })
        setSelectedPremisesIndex(({ key: handlePremisesData().premisesIndex!, text: String(handlePremisesData().premisesIndex!) }))

    }, [handlePremisesData])




    const hideDuplicatePremisesModal = () => {

        navigationState({ ...navigationState(), showDuplicatePremisesModal: false })

    }

    const getNextMonth = () => {
        const date = new Date();
        const today = date.getDate();
        const currentMonth = date.getMonth() + 1;
        const currentYear = date.getFullYear();
        var newDate = new Date(currentYear, currentMonth, 1);
        return newDate.toISOString()

    }


    const [duplicatedPremises, setDuplicatedPremises] = React.useState<any>(
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




    const [postPremises, { data }] = useMutation<Mutation, MutationPostPremisesArgs>(NEW_PREMISES);

    const saveDuplicatedPremises = () => {

        postPremises({
            variables: {
                propertyId: propertyId,
                floor: duplicatedPremises.floor,
                area: duplicatedPremises.area,
                vacant: duplicatedPremises.vacant,
                type: duplicatedPremises.type,
                premisesIndex: duplicatedPremises.premisesIndex,
                occupation: duplicatedPremises.occupation,
                premisesNotes: duplicatedPremises.premisesNotes,
                netRental: duplicatedPremises.netRental,
                opCosts: duplicatedPremises.opCosts,
                other: duplicatedPremises.other,
                grossRental: duplicatedPremises.grossRental,
                esc: duplicatedPremises.esc,
                openBays: duplicatedPremises.openBays,
                openRate: duplicatedPremises.openRate,
                coveredBays: duplicatedPremises.coveredBays,
                coveredRate: duplicatedPremises.coveredRate,
                shadedBays: duplicatedPremises.shadedBays,
                shadedRate: duplicatedPremises.shadedRate,
                parkingRatio: duplicatedPremises.parkingRatio,
                tenantName: duplicatedPremises.tenantName,
                leaseExpiry: duplicatedPremises.leaseExpiry,
                tenantNotes: duplicatedPremises.tenantNotes,
                yard: duplicatedPremises.yard,
                height: duplicatedPremises.height,
                doors: duplicatedPremises.doors,
                loading: duplicatedPremises.loading,
                sprinklered: duplicatedPremises.sprinklered,
                canopies: duplicatedPremises.canopies,
                power: duplicatedPremises.power,
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
        hideDuplicatePremisesModal()



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
            setDuplicatedPremises({ ...duplicatedPremises, type: item.text });
        }
    };

    const onChangePremisesIndex = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void => {
        if (item !== undefined) {
            setSelectedPremisesIndex(item);
            setDuplicatedPremises({ ...duplicatedPremises, premisesIndex: parseInt(item.text) });
        }
    };


    const stackTokens = { childrenGap: 15 };



    const onChangeFloor = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, floor: newValue || '' });
        },
        [duplicatedPremises],
    );

    const onChangeArea = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            console.log(newValue)
            setDuplicatedPremises({ ...duplicatedPremises, area: parseFloat(newValue!) || 0 });
        },
        [duplicatedPremises],
    );


    const handleChecked = () => {
        if (duplicatedPremises.vacant === "false") {
            return false
        } else {
            return true
        }

    }

    const onChangeVacantToggle = React.useCallback(
        (ev: React.MouseEvent<HTMLElement>, checked: boolean | undefined) => {
            if (duplicatedPremises.vacant === "false") {
                setDuplicatedPremises({ ...duplicatedPremises, vacant: "true" });

            } else {
                setDuplicatedPremises({ ...duplicatedPremises, vacant: "false" });
            }
        },
        [duplicatedPremises])

    const onSelectOccupationDate = React.useCallback(
        (date: Date | null | undefined) => {
            if (date !== undefined && date !== null)
                setDuplicatedPremises({ ...duplicatedPremises, occupation: date.toISOString() });
        },
        [duplicatedPremises])

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
            setDuplicatedPremises({ ...duplicatedPremises, premisesNotes: newValue || '' });
        },
        [duplicatedPremises],
    );

    const onChangeNetRental = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, netRental: parseFloat(newValue!) || 0 });
        },
        [duplicatedPremises],
    );

    const onChangeOpCosts = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, opCosts: parseFloat(newValue!) || 0 });
        },
        [duplicatedPremises],
    );

    const onChangeOther = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, other: parseFloat(newValue!) || 0 });
        },
        [duplicatedPremises],
    );

    const onChangeGrossRental = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, grossRental: parseFloat(newValue!) || 0 });
        },
        [duplicatedPremises],
    );

    const onChangeEsc = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, esc: parseFloat(newValue!) || 0 });
        },
        [duplicatedPremises],
    );

    const getOpenBays = (ratio: number) => {
        return (ratio * (duplicatedPremises.area / 100))
    }

    const getOpenRatio = (bays: number) => {
        return (bays / (duplicatedPremises.area / 100))
    }

    const getCoveredBays = (ratio: number) => {
        return (ratio * (duplicatedPremises.area / 100))
    }

    const getCoveredRatio = (bays: number) => {
        return (bays / (duplicatedPremises.area / 100))
    }

    const getShadedBays = (ratio: number) => {
        return (ratio * (duplicatedPremises.area / 100))
    }

    const getShadedRatio = (bays: number) => {
        return (bays / (duplicatedPremises.area / 100))
    }

    const onChangeOpenBays = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, openBays: parseFloat(newValue!) || 0, openRatio: getOpenRatio(parseFloat(newValue!)) });
        },
        [duplicatedPremises],
    );

    const onChangeOpenRate = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, openRate: parseFloat(newValue!) || 0 });
        },
        [duplicatedPremises],
    );


    const onChangeOpenRatio = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, openRatio: parseFloat(newValue!) || 0, openBays: getOpenBays(parseFloat(newValue!)) });
        },
        [duplicatedPremises],
    );

    const onChangeCoveredBays = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, coveredBays: parseFloat(newValue!) || 0, coveredRatio: getCoveredRatio(parseFloat(newValue!)) });
        },
        [duplicatedPremises],
    );

    const onChangeCoveredRate = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, coveredRate: parseFloat(newValue!) || 0 });
        },
        [duplicatedPremises],
    );

    const onChangeCoveredRatio = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, coveredRatio: parseFloat(newValue!) || 0, coveredBays: getCoveredBays(parseFloat(newValue!)) });
        },
        [duplicatedPremises],
    );

    const onChangeShadedBays = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, shadedBays: parseFloat(newValue!) || 0, shadedRatio: getShadedRatio(parseFloat(newValue!)) });
        },
        [duplicatedPremises],
    );

    const onChangeShadedRate = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, shadedRate: parseFloat(newValue!) || 0 });
        },
        [duplicatedPremises],
    );

    const onChangeShadedRatio = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, shadedRatio: parseFloat(newValue!) || 0, shadedBays: getShadedBays(parseFloat(newValue!)) });
        },
        [duplicatedPremises],
    );

    const onChangeParkingRatio = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, parkingRatio: parseFloat(newValue!) || 0 });
        },
        [duplicatedPremises],
    );

    const onChangeTenantName = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, tenantName: newValue || '' });
        },
        [duplicatedPremises],
    );

    const onSelectLeaseExpiry = React.useCallback(
        (date: Date | null | undefined) => {
            if (date !== undefined && date !== null)
                setDuplicatedPremises({ ...duplicatedPremises, leaseExpiry: date.toISOString() });
        },
        [duplicatedPremises])

    const onChangeTenantNotes = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, tenantNotes: newValue || '' });
        },
        [duplicatedPremises],
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



    const DuplicatePremisesTab = () => {

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
                                value={duplicatedPremises.floor}
                                onChange={onChangeFloor}
                                styles={textFieldFloorStyles}

                            />
                            <TextField
                                label="Area"
                                type="number"
                                value={duplicatedPremises.area === 0 ? "" : String(duplicatedPremises.area)}
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
                                value={new Date(duplicatedPremises.occupation)}
                                onSelectDate={onSelectOccupationDate}
                                formatDate={onFormatDate}
                                styles={datePickerStyles}

                            />

                        </Stack>

                        <Stack horizontal>

                            <TextField
                                label="Premises Notes"
                                value={duplicatedPremises.premisesNotes}
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
                                value={duplicatedPremises.netRental === 0 ? "" : String(duplicatedPremises.netRental)}
                                onChange={onChangeNetRental}
                                styles={textFieldFloorStyles}

                                prefix="R"
                                suffix="/m²/month"
                            />
                            <TextField
                                label="Op Costs"
                                type="number"
                                value={duplicatedPremises.opCosts === 0 ? "" : String(duplicatedPremises.opCosts)}
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
                                value={duplicatedPremises.other === 0 ? "" : String(duplicatedPremises.other)}
                                onChange={onChangeOther}
                                styles={textFieldFloorStyles}
                                prefix="R"
                                suffix="/m²/month"
                            />
                            <TextField
                                label="Gross Rental"
                                type="number"
                                value={duplicatedPremises.grossRental === 0 ? "" : String(duplicatedPremises.grossRental)}
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
                                value={duplicatedPremises.esc === 0 ? "" : String(duplicatedPremises.esc)}
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
                                value={duplicatedPremises.openBays === 0 ? "" : String(duplicatedPremises.openBays)}
                                onChange={onChangeOpenBays}
                                styles={textFieldParkingBaysStyles}
                                suffix="bays"
                            />
                            <TextField
                                label="Open Rate"
                                type="number"
                                value={duplicatedPremises.openRate === 0 ? "" : String(duplicatedPremises.openRate)}
                                onChange={onChangeOpenRate}
                                styles={textFieldParkingRateStyles}
                                prefix="R"
                                suffix="/bay/month"
                            />

                            <TextField
                                label="Open Ratio"
                                type="number"
                                value={duplicatedPremises.openRatio === 0 ? "" : String(duplicatedPremises.openRatio.toFixed(1).replace(/[.,]0$/, ""))}
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
                                value={duplicatedPremises.coveredBays === 0 ? "" : String(duplicatedPremises.coveredBays)}
                                onChange={onChangeCoveredBays}
                                styles={textFieldParkingBaysStyles}
                                suffix="bays"
                            />
                            <TextField
                                label="Covered Rate"
                                type="number"
                                value={duplicatedPremises.coveredRate === 0 ? "" : String(duplicatedPremises.coveredRate)}
                                onChange={onChangeCoveredRate}
                                styles={textFieldParkingRateStyles}
                                prefix="R"
                                suffix="/bay/month"
                            />

                            <TextField
                                label="Covered Ratio"
                                type="number"
                                value={duplicatedPremises.coveredRatio === 0 ? "" : String(duplicatedPremises.coveredRatio.toFixed(1).replace(/[.,]0$/, ""))}
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
                                value={duplicatedPremises.shadedBays === 0 ? "" : String(duplicatedPremises.shadedBays)}
                                onChange={onChangeShadedBays}
                                styles={textFieldParkingBaysStyles}
                                suffix="bays"
                            />
                            <TextField
                                label="Shaded Rate"
                                type="number"
                                value={duplicatedPremises.shadedRate === 0 ? "" : String(duplicatedPremises.shadedRate)}
                                onChange={onChangeShadedRate}
                                styles={textFieldParkingRateStyles}
                                prefix="R"
                                suffix="/bay/month"
                            />

                            <TextField
                                label="Shaded Ratio"
                                type="number"
                                value={duplicatedPremises.shadedRatio === 0 ? "" : String(duplicatedPremises.shadedRatio.toFixed(1).replace(/[.,]0$/, ""))}
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
                                value={duplicatedPremises.parkingRatio === 0 ? "" : String(duplicatedPremises.parkingRatio.toFixed(1).replace(/[.,]0$/, ""))}
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
                                value={duplicatedPremises.tenantName === "-" ? "" : duplicatedPremises.tenantName}
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
                                value={new Date(duplicatedPremises.leaseExpiry)}
                                onSelectDate={onSelectLeaseExpiry}
                                formatDate={onFormatDate}
                                styles={datePickerStyles}

                            />

                        </Stack>

                        <Stack horizontal>

                            <TextField
                                label="Tenant Notes"
                                value={duplicatedPremises.tenantNotes}
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
                isOpen={showDuplicatePremisesModal}
                /*  onDismiss={hideDuplicatePremisesModal} */
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
                            onClick={saveDuplicatedPremises}
                        />
                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={cancelIcon}
                            ariaLabel="Close popup modal"
                            onClick={hideDuplicatePremisesModal}
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

                        {DuplicatePremisesTab()}





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

export default DuplicatePremisesModal
