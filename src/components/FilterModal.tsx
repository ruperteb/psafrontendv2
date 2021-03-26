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
import { navigationState, filterVariables as filterVariablesVar } from "../reactivevariables/reactivevariables"
import Select from 'react-select';

import "./NewPremisesModal.css"



const dragOptions: IDragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
};
const cancelIcon: IIconProps = { iconName: 'Cancel' };
const filterIcon: IIconProps = { iconName: 'Filter' };
const clearFilterIcon: IIconProps = { iconName: 'ClearFilter' };

type FilterFormattedOptions = {
    value: string;
    label: string;
}

type DistinctSuburbFilterOptions = {
    label: string,
    options: FilterFormattedOptions[],
}[]

type DistinctRegionFilterOptions = {
    label: string,
    options: FilterFormattedOptions[],
}[]

interface Props {
    showFilterModal: boolean
    distinctSuburbsFilterOptions: DistinctSuburbFilterOptions;
    distinctRegionFilterOptions: DistinctRegionFilterOptions
    landlordsFilterOptions: FilterFormattedOptions[];
}

export const FilterModal: React.FC<Props> = ({ showFilterModal, distinctSuburbsFilterOptions, distinctRegionFilterOptions, landlordsFilterOptions }) => {



    const {
        data: filterData,
        loading: filterLoading,
        error: filterError
    } = useQuery<Query>(GET_FILTER_VARIABLES);

    const [filterVariables, setFilterVariables] = React.useState<FilterVariables>(filterData?.filterVariables!);

    const applyFilter = () => {
        filterVariablesVar({
            suburb: filterVariables.suburb,
            region: filterVariables.region,
            province: filterVariables.province,
            buildingType: filterVariables.buildingType,
            erfExtentMin: filterVariables.erfExtentMin,
            erfExtentMax: filterVariables.erfExtentMax,
            totalGLAMin: filterVariables.totalGLAMin,
            totalGLAMax: filterVariables.totalGLAMax,
            vacantGLAMin: filterVariables.vacantGLAMin,
            vacantGLAMax: filterVariables.vacantGLAMax,
            earliestOccMin: filterVariables.earliestOccMin,
            earliestOccMax: filterVariables.earliestOccMax,
            earliestExpMin: filterVariables.earliestExpMin,
            earliestExpMax: filterVariables.earliestExpMax,
            landlord: filterVariables.landlord,
        })
    }

    const clearFilter = () => {
        suburbRef.current.select.clearValue();
        regionRef.current.select.clearValue();
        provinceRef.current.select.clearValue();
        buildingTypeRef.current.select.clearValue();
        landlordRef.current.select.clearValue();

        filterVariablesVar({
            suburb: [],
            region: [],
            province: [],
            buildingType: [],
            erfExtentMin: 0,
            erfExtentMax: 0,
            totalGLAMin: 0,
            totalGLAMax: 0,
            vacantGLAMin: 0,
            vacantGLAMax: 0,
            earliestOccMin: new Date("01/01/2020"),
            earliestOccMax: new Date("01/01/2020"),
            earliestExpMin: new Date("01/01/2020"),
            earliestExpMax: new Date("01/01/2020"),
            landlord: [],
        })

        setFilterVariables({
            suburb: [],
            region: [],
            province: [],
            buildingType: [],
            erfExtentMin: 0,
            erfExtentMax: 0,
            totalGLAMin: 0,
            totalGLAMax: 0,
            vacantGLAMin: 0,
            vacantGLAMax: 0,
            earliestOccMin: new Date("01/01/2020"),
            earliestOccMax: new Date("01/01/2020"),
            earliestExpMin: new Date("01/01/2020"),
            earliestExpMax: new Date("01/01/2020"),
            landlord: [],
        })


    }



    console.log(filterData)





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




    const onSelectSuburb = React.useCallback(
        (value: any) => {

            setFilterVariables({ ...filterVariables, suburb: value.map((suburb: any) => { return suburb.value }) });
        }, [filterVariables])

    const onSelectRegion = React.useCallback(
        (value: any) => {

            setFilterVariables({ ...filterVariables, region: value.map((region: any) => { return region.value }) });
        }, [filterVariables])

    const onSelectProvince = React.useCallback(
        (value: any) => {

            setFilterVariables({ ...filterVariables, province: value.map((province: any) => { return province.value }) });
        }, [filterVariables])

    const onSelectBuildingType = React.useCallback(
        (value: any) => {

            setFilterVariables({ ...filterVariables, buildingType: value.map((buildingType: any) => { return buildingType.value }) });
        }, [filterVariables])

    const onSelectLandlord = React.useCallback(
        (value: any) => {

            setFilterVariables({ ...filterVariables, landlord: value.map((landlord: any) => { return landlord.value }) });
        }, [filterVariables])


    const getSliderMinGLAValue = React.useCallback(
        () => {
            if (filterData !== undefined) {
                return filterVariables.vacantGLAMin
            } else return undefined

        }, [filterVariables, filterData])

    const getSliderMaxGLAValue = () => {
        if (filterData !== undefined) {
            return filterVariables.vacantGLAMax
        } else return undefined

    }

    const sliderMinGLAOnChange = React.useCallback(
        (value: number) => {
            setFilterVariables({ ...filterVariables, vacantGLAMin: value });
        }, [filterVariables])

    const sliderMaxGLAOnChange = React.useCallback(
        (value: number) => {
            setFilterVariables({ ...filterVariables, vacantGLAMax: value });
        }, [filterVariables])



    const sliderAriaValueText = (value: number) => `${value}m²`;
    const sliderValueFormat = (value: number) => `${value}m²`;

    const onSelectMinOccupationDate = React.useCallback(
        (date: Date | null | undefined) => {
            if (date !== undefined && date !== null)
                setFilterVariables({ ...filterVariables, earliestOccMin: date });
        },
        [filterVariables])

    const onSelectMaxOccupationDate = React.useCallback(
        (date: Date | null | undefined) => {
            if (date !== undefined && date !== null)
                setFilterVariables({ ...filterVariables, earliestOccMax: date });
        },
        [filterVariables])

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

    const checkDates = (first: Date | undefined, second: Date | undefined) => {
        if (first && second)
            if (first.getFullYear() === second.getFullYear() &&
                first.getMonth() === second.getMonth() &&
                first.getDate() === second.getDate()) {
                return true
            } else return false
    }

   

    var startDate = new Date("01/01/2020")




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

    const customStylesProvince = {
        menu: (provided: any, state: any) => ({
            ...provided,
            width: "100%",
            borderBottom: '1px dotted pink',
            color: state.selectProps.menuColor,
            padding: 5,
        }),
        menuList: (provided: any, state: any) => ({
            ...provided,
            height: "150px",
            width: "100%",
        }),
        container: (provided: any, state: any) => ({
            ...provided,
            width: "100%",
            height: "fit-content"
        }),
    }

    const customStylesBuildingType = {
        menu: (provided: any, state: any) => ({
            ...provided,
            width: "100%",
            borderBottom: '1px dotted pink',
            color: state.selectProps.menuColor,
            padding: 5,
        }),
        menuList: (provided: any, state: any) => ({
            ...provided,
            height: "150px",
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

    const provinceOptions = [

        { value: 'WC', label: 'Western Cape' },
        { value: 'GAU', label: 'Gauteng' },
        { value: 'KZN', label: 'KwaZulu Natal' },
        { value: 'Other', label: 'Other' },

    ];

    const buildingTypeOptions = [

        { value: 'Office', label: 'Office' },
        { value: 'Industrial', label: 'Industrial' },
        { value: 'Retail', label: 'Retail' },
        { value: 'Mixed Use', label: 'Mixed Use' },

    ];



    console.log(distinctSuburbsFilterOptions)

    const suburbRef: any = React.useRef()
    const regionRef: any = React.useRef()
    const provinceRef: any = React.useRef()
    const buildingTypeRef: any = React.useRef()
    const landlordRef: any = React.useRef()

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
                            ariaLabel="Apply Filter"
                            onClick={applyFilter}
                        />
                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={clearFilterIcon}
                            ariaLabel="Clear Filter"
                            onClick={clearFilter}
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
                                ref={suburbRef}
                                key="suburb"
                                isMulti
                                styles={customStyles}
                                /*  defaultValue={colourOptions[1]} */
                                options={distinctSuburbsFilterOptions}
                                formatGroupLabel={formatGroupLabel}
                                onChange={onSelectSuburb}
                                values={filterVariables.suburb!.map((suburb) => { return { value: suburb, label: suburb } })}
                                defaultValue={filterVariables.suburb!.map((suburb) => { return { value: suburb, label: suburb } })}

                            />
                        </Stack>

                        <Stack verticalFill
                            styles={{
                                root: {
                                    color: '#605e5c',
                                    marginLeft: "0px",
                                    marginTop: "5px !important"
                                }
                            }}>

                            <Label>Region</Label>

                            <Select
                                ref={regionRef}
                                key="region"
                                isMulti
                                styles={customStyles}
                                /*  defaultValue={colourOptions[1]} */
                                options={distinctRegionFilterOptions}
                                formatGroupLabel={formatGroupLabel}
                                onChange={onSelectRegion}
                                values={filterVariables.region!.map((region) => { return { value: region, label: region } })}
                                defaultValue={filterVariables.region!.map((region) => { return { value: region, label: region } })}
                            />
                        </Stack>

                        <Stack verticalFill
                            styles={{
                                root: {
                                    color: '#605e5c',
                                    marginLeft: "0px",
                                    marginTop: "5px !important"
                                }
                            }}>

                            <Label>Province</Label>

                            <Select
                                ref={provinceRef}
                                key="province"
                                isMulti
                                styles={customStylesProvince}
                                /*  defaultValue={colourOptions[1]} */
                                options={provinceOptions}
                                formatGroupLabel={formatGroupLabel}
                                onChange={onSelectProvince}
                                values={filterVariables.province!.map((province) => { return { value: province, label: province } })}
                                defaultValue={filterVariables.province!.map((province) => { return { value: province, label: province } })}
                            />
                        </Stack>

                        <Stack horizontal>

                            <Stack verticalFill
                                styles={{
                                    root: {
                                        color: '#605e5c',
                                        marginLeft: "0px",
                                        width: "60%",
                                        marginTop: "5px !important"
                                    }
                                }}>

                                <Label>Building Type</Label>

                                <Select
                                    ref={buildingTypeRef}
                                    key="buildingType"
                                    isMulti
                                    styles={customStylesBuildingType}
                                    /*  defaultValue={colourOptions[1]} */
                                    options={buildingTypeOptions}
                                    formatGroupLabel={formatGroupLabel}
                                    onChange={onSelectBuildingType}
                                    values={filterVariables.buildingType!.map((buildingType) => { return { value: buildingType, label: buildingType } })}
                                    defaultValue={filterVariables.buildingType!.map((buildingType) => { return { value: buildingType, label: buildingType } })}
                                />
                            </Stack>

                            <Stack verticalFill
                                styles={{
                                    root: {
                                        color: '#605e5c',
                                        marginLeft: "auto !important",
                                        marginRight: 0,
                                        width: "35%",
                                        marginTop: "5px !important"
                                    }
                                }}>

                                <Label>Landlord</Label>

                                <Select
                                    ref={landlordRef}
                                    key="landlord"
                                    isMulti
                                    styles={customStyles}
                                    /*  defaultValue={colourOptions[1]} */
                                    options={landlordsFilterOptions}
                                    formatGroupLabel={formatGroupLabel}
                                    onChange={onSelectLandlord}
                                    values={filterVariables.landlord!.map((landlord) => { return { value: landlord, label: landlord } })}
                                    defaultValue={filterVariables.landlord!.map((landlord) => { return { value: landlord, label: landlord } })}
                                />
                            </Stack>

                        </Stack>

                        <Stack styles={{ root: { marginTop: "10px !important" } }}>

                            <Slider
                                label="Minimum Vacant GLA"
                                max={20000}
                                value={getSliderMinGLAValue()}

                                showValue
                                step={20}
                                ariaValueText={sliderAriaValueText}
                                valueFormat={sliderValueFormat}
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange={sliderMinGLAOnChange}
                            />

                        </Stack>

                        <Stack styles={{ root: { marginTop: "5px !important" } }}>

                            <Slider
                                label="Maximum Vacant GLA"
                                max={20000}
                                value={getSliderMaxGLAValue()}
                                showValue
                                step={20}
                                ariaValueText={sliderAriaValueText}
                                valueFormat={sliderValueFormat}
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange={sliderMaxGLAOnChange}
                            />

                        </Stack>





                        <Stack horizontal styles={{
                            root: {
                                /* width: '400px', */
                                /*  margin: '10px', */

                                color: '#605e5c',

                                marginLeft: "0px",
                                marginRight: "auto",
                                marginBottom: 10,
                                marginTop: "5px !important"
                                /* display: "block" */

                            }

                        }}>



                            <DatePicker
                                label="Min Occupation Date"
                                className={controlClass.control}
                                firstDayOfWeek={DayOfWeek.Monday}
                                strings={DayPickerStrings}
                                placeholder="Select a date..."
                                ariaLabel="Select a date"
                                value={filterVariables === undefined || checkDates(filterVariables.earliestOccMin, startDate) ? undefined : filterVariables.earliestOccMin}
                                onSelectDate={onSelectMinOccupationDate}
                                formatDate={onFormatDate}
                                styles={datePickerStyles}

                            />

                            <DatePicker
                                label="Max Occupation Date"
                                className={controlClass.control}
                                firstDayOfWeek={DayOfWeek.Monday}
                                strings={DayPickerStrings}
                                placeholder="Select a date..."
                                ariaLabel="Select a date"
                                value={filterVariables === undefined || checkDates(filterVariables.earliestOccMax, startDate) ? undefined : filterVariables.earliestOccMax}
                                onSelectDate={onSelectMaxOccupationDate}
                                formatDate={onFormatDate}
                                styles={datePickerStyles}

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

export default FilterModal
