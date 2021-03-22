import React, { CSSProperties, useState } from 'react';
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
    ICalendarProps,
    Label
} from 'office-ui-fabric-react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { defaultDataIdFromObject, gql, useMutation, useQuery } from '@apollo/client';
import { GET_SINGLE_PROPERTY, NEW_PREMISES, GET_NAV_STATE, GET_FILTER_VARIABLES } from "../gql/gql"
import { Mutation, MutationPostPremisesArgs, Query, Property, Premises, FilterVariables } from "../schematypes/schematypes"
import { navigationState, filterVariables } from "../reactivevariables/reactivevariables"
import Select from 'react-select';

import "./NewPremisesModal.css"




const dragOptions: IDragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
};
const cancelIcon: IIconProps = { iconName: 'Cancel' };
const filterIcon: IIconProps = { iconName: 'Filter' };

type FilterFormattedOptions = {
    value: string;
    label: string;
}

type DistinctSuburbFilterOptions = {
    label: string,
    options: FilterFormattedOptions[],
}[]

interface Props {
    showFilterModal: boolean
    distinctSuburbsFilterOptions: DistinctSuburbFilterOptions;
    distinctRegionsOptions: IComboBoxOption[];
    landlordsOptions: IComboBoxOption[];
}

export const FilterModal: React.FC<Props> = ({ showFilterModal, distinctSuburbsFilterOptions, distinctRegionsOptions, landlordsOptions }) => {



    const {
        data: filterData,
        loading: filterLoading,
        error: filterError
    } = useQuery<Query>(GET_FILTER_VARIABLES);







    const hideFilterModal = () => {

        navigationState({ ...navigationState(), showFilterModal: false })

    }

    const getNextMonth = () => {
        const date = new Date();
        const today = date.getDate();
        const currentMonth = date.getMonth() + 1;
        const currentYear = date.getFullYear();
        var newDate = new Date(currentYear, currentMonth, 1);
        return newDate.toISOString()

    }


    const [filterVariables, setFilterVariables] = React.useState<FilterVariables>(filterData?.filterVariables!);











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

    const groupStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };
    const groupBadgeStyles: CSSProperties = {
        backgroundColor: '#EBECF0',
        borderRadius: '2em',
        color: '#172B4D',
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 'normal',
        lineHeight: '1',
        minWidth: 1,
        padding: '0.16666666666667em 0.5em',
        textAlign: 'center',

    };

    const formatGroupLabel = (data: any) => {
        return (
            <div style={groupStyles}>
                <span>{data.label}</span>
                <span style={groupBadgeStyles}>{data.options.length}</span>
            </div>
        )
    };

    const customStyles = {
        menu: (provided: any, state: any) => ({
            ...provided,
            width: "100%",
            borderBottom: '1px dotted pink',
            color: state.selectProps.menuColor,
            padding: 5,


        }),
        menuList: (provided: any, state: any) => ({
            ...provided,
            height: "200px",
            width: "100%",

        }),
        container: (provided: any, state: any) => ({
            ...provided,
            width: "100%",
            height: "fit-content"


        }),


    }



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





    const [selectedPremisesType, setSelectedPremisesType] = React.useState<IDropdownOption>();
    const [selectedPremisesIndex, setSelectedPremisesIndex] = React.useState<IDropdownOption>();



    /* const onChangePremisesType = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void => {
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



    

    const onChangeNetRental = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setDuplicatedPremises({ ...duplicatedPremises, netRental: parseFloat(newValue!) || 0 });
        },
        [duplicatedPremises],
    );
 */

    console.log(distinctSuburbsFilterOptions)


    return (
        <div>


            <Modal
                styles={modalStyles}


                isOpen={showFilterModal}
                /*  onDismiss={hideDuplicatePremisesModal} */
                isBlocking={false}
                containerClassName={contentStyles.container}
            /* dragOptions={dragOptions} */
            >
                <div className={contentStyles.header}>
                    <span >Filter Properties</span>
                    <Stack horizontal
                        styles={headerIconStackStyles}
                    >

                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={filterIcon}
                            ariaLabel="Save Premises"
                        /*  onClick={filterProperties} */
                        />
                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={cancelIcon}
                            ariaLabel="Close popup modal"
                            onClick={hideFilterModal}
                        />

                    </Stack>

                </div>
                <div className={contentStyles.body} >

                    <Stack /* tokens={stackTokens} */>

                        <Stack verticalFill 
                            styles={{
                                root: {
                                    color: '#605e5c',
                                    marginLeft: "0px",
                                }
                            }}>

                                <Label>Suburb</Label>

                                <Select
                                    isMulti
                                    styles={customStyles}
                                    /*  defaultValue={colourOptions[1]} */
                                    options={distinctSuburbsFilterOptions}
                                    formatGroupLabel={formatGroupLabel}
                                />
                        </Stack>

                        <Stack verticalFill 
                            styles={{
                                root: {
                                    color: '#605e5c',
                                    marginLeft: "0px",
                                }
                            }}>

                                <Label>Region</Label>

                                <Select
                                    isMulti
                                    styles={customStyles}
                                    /*  defaultValue={colourOptions[1]} */
                                    options={distinctSuburbsFilterOptions}
                                    formatGroupLabel={formatGroupLabel}
                                />
                        </Stack>

                        <Stack verticalFill 
                            styles={{
                                root: {
                                    color: '#605e5c',
                                    marginLeft: "0px",
                                }
                            }}>

                                <Label>Province</Label>

                                <Select
                                    isMulti
                                    styles={customStyles}
                                    /*  defaultValue={colourOptions[1]} */
                                    options={distinctSuburbsFilterOptions}
                                    formatGroupLabel={formatGroupLabel}
                                />
                        </Stack>

                        <Stack horizontal>

                        <Stack verticalFill 
                            styles={{
                                root: {
                                    color: '#605e5c',
                                    marginLeft: "0px",
                                    width: "60%"
                                }
                            }}>

                                <Label>Building Type</Label>

                                <Select
                                    isMulti
                                    styles={customStyles}
                                    /*  defaultValue={colourOptions[1]} */
                                    options={distinctSuburbsFilterOptions}
                                    formatGroupLabel={formatGroupLabel}
                                />
                        </Stack>

                        <Stack verticalFill 
                            styles={{
                                root: {
                                    color: '#605e5c',
                                    marginLeft: "auto !important",
                                    marginRight: 0,
                                    width: "35%"
                                }
                            }}>

                                <Label>Landlord</Label>

                                <Select
                                    isMulti
                                    styles={customStyles}
                                    /*  defaultValue={colourOptions[1]} */
                                    options={distinctSuburbsFilterOptions}
                                    formatGroupLabel={formatGroupLabel}
                                />
                        </Stack>



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
                                /*  onChange={onChangePremisesType} */
                                placeholder="Select type"
                                options={premisesTypeOptions}
                                styles={dropdownStyles}
                            />

                            {/* <Dropdown
                                label="Premises Index"
                                selectedKey={selectedPremisesIndex ? selectedPremisesIndex.key : undefined}
                                // eslint-disable-next-line react/jsx-no-bind
                                 onChange={onChangePremisesIndex}
                                placeholder="Select index"
                                options={premisesIndexOptions}
                                styles={dropdownStyles}
                            /> */}

                            <DatePicker
                                label="Occupation Date"
                                className={controlClass.control}
                                firstDayOfWeek={DayOfWeek.Monday}
                                strings={DayPickerStrings}
                                placeholder="Select a date..."
                                ariaLabel="Select a date"
                                /*  value={new Date(duplicatedPremises.occupation)} */
                                /* onSelectDate={onSelectOccupationDate} */
                                /* formatDate={onFormatDate} */
                                styles={datePickerStyles}

                            />

                        </Stack>

                        <Stack horizontal>

                            <TextField
                                label="Premises Notes"
                                /* value={duplicatedPremises.premisesNotes} */
                                /*  onChange={onChangePremisesNotes} */
                                styles={textFieldNotesStyles}
                                multiline
                                autoAdjustHeight
                            />

                        </Stack>





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

export default FilterModal
