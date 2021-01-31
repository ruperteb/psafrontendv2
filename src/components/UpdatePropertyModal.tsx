import React, { useState } from 'react';
import { useId, useBoolean } from '@uifabric/react-hooks';
import { TextField, ITextFieldStyles } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { IStackStyles, Stack } from 'office-ui-fabric-react/lib/Stack';
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
    PrimaryButton,
} from 'office-ui-fabric-react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { gql, useMutation, useQuery } from '@apollo/client';
import { GET_PROPERTIES, NEW_PROPERTY, GET_NAV_STATE, UPDATE_PROPERTY, GET_SINGLE_PROPERTY } from "../gql/gql"
import { Mutation, MutationUpdatePropertyArgs, Query, Property, Landlord, LandlordContact } from "../schematypes/schematypes"
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
    showUpdatePropertyModal: boolean;
    distinctSuburbsOptions: IComboBoxOption[];
    distinctRegionsOptions: IComboBoxOption[];
    propertyId: number
    propertyData: Property
    landlordsOptions: IComboBoxOption[];
}

export const UpdatePropertyModal: React.FC<Props> = ({ showUpdatePropertyModal, distinctSuburbsOptions, distinctRegionsOptions, propertyId, propertyData, landlordsOptions }) => {

    const hideUpdatePropertyModal = () => {
        navigationState({ ...navigationState(), showUpdatePropertyModal: false })
    }

    


    const [updatedProperty, setUpdateProperty] = React.useState(propertyData);

    interface SelectedLandlord {
        landlordId: number
        landlordName: string
        landlordData: Landlord
    }

    const [selectedLandlord, setSelectedLandlord] = React.useState<SelectedLandlord>(
        {
            landlordId: propertyData.contact?.landlordName?.landlordId!,
            landlordName: propertyData.contact?.landlordName?.landlordName!,
            landlordData: { 
                landlordId: propertyData.contact?.landlordName?.landlordId!,
                landlordName: propertyData.contact?.landlordName?.landlordName!,
                contactsList: propertyData.contact?.landlordName?.contactsList!
            }

        });


    interface SelectedContact {
        contactId: number
        contactName: string
        contactData: LandlordContact
    }


    const [selectedContact, setSelectedContact] = React.useState<SelectedContact>(
        {
            contactId: propertyData.contact?.contactId! | 0,
            contactName: propertyData.contact?.name!,
            contactData: { 
                contactId: propertyData.contact?.contactId!,
                name: propertyData.contact?.name!, 
                email: propertyData.contact?.email!,
                mobileNo: propertyData.contact?.mobileNo!,
                officeNo: propertyData.contact?.officeNo!,
            }

        });


    const [updateProperty, { data }] = useMutation<Mutation, MutationUpdatePropertyArgs>(UPDATE_PROPERTY);

    const saveUpdateProperty = () => {

        updateProperty({
            variables: {
                contactId: selectedContact.contactId,
                propertyId: propertyId,
                propertyName: updatedProperty.propertyName,
                address: updatedProperty.address,
                suburb: updatedProperty.suburb,
                coordinates: updatedProperty.coordinates,
                /*  earliestOccupation: UpdateProperty.earliestOccupation,
                 earliestExpiry: UpdateProperty.earliestExpiry, */
                erfExtent: updatedProperty.erfExtent,
                totalGLA: updatedProperty.totalGLA,
                vacantArea: updatedProperty.vacantArea,
                buildingType: updatedProperty.buildingType,
                province: updatedProperty.province,
                region: updatedProperty.region,
                notes: updatedProperty.notes,
            },

            update(cache, { data }) {

                if (!data) {
                    return null;
                }

                const getExistingProperty = cache.readQuery<Query>({ query: GET_SINGLE_PROPERTY, variables: { propertyId: propertyId } })
                const existingProperty: Property = getExistingProperty ? getExistingProperty.singleProperty! : { propertyId: 1, propertyName: "" };

                const updatedProperty = {
                    ...existingProperty, propertyName: data.updateProperty.propertyName,
                    address: data.updateProperty.address,
                    suburb: data.updateProperty.suburb,
                    coordinates: data.updateProperty.coordinates,
                    /*  earliestOccupation: UpdateProperty.earliestOccupation,
                     earliestExpiry: UpdateProperty.earliestExpiry, */
                    erfExtent: data.updateProperty.erfExtent,
                    totalGLA: data.updateProperty.totalGLA,
                    vacantArea: data.updateProperty.vacantArea,
                    buildingType: data.updateProperty.buildingType,
                    province: data.updateProperty.province,
                    region: data.updateProperty.region,
                    notes: data.updateProperty.notes,
                    contact:  data.updateProperty.contact
                }




                if (existingProperty)
                    cache.writeQuery<Query>({
                        query: GET_SINGLE_PROPERTY,
                        variables: { propertyId: propertyId },
                        data: { singleProperty: updatedProperty }
                    });
            }


        })


        hideUpdatePropertyModal()
    }



    /* const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
    const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(false); */

    // Use useId() to ensure that the IDs are unique on the page.
    // (It's also okay to use plain strings and manually ensure uniqueness.)


    const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200, marginRight: 20 } };
    const textFieldPropertyNameStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300, marginRight: 20 } };
    const textFieldAddressStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300, marginRight: 20 } };
    const textFieldCoordinatesStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 150, marginRight: 20 } };
    const textFieldErfStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200, marginRight: 20 } };
    const textFieldNotesStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 500, marginRight: 20 } };
    const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 150, marginRight: 20 } };
    const dropdownSectorStyles: Partial<IDropdownStyles> = { dropdown: { width: 420, marginRight: 20 } };
    const dropdownProvinceStyles: Partial<IDropdownStyles> = { dropdown: { width: 140, marginRight: 20 } };
    const comboBoxStyles: Partial<IComboBoxStyles> = { root: { width: 140, marginRight: 20 } }

    const comboBoxLandlordStyles: Partial<IComboBoxStyles> = { root: { width: 220, marginRight: 20 } }
    const textFieldLandlordStyles: Partial<ITextFieldStyles> = { root: { width: "100%", marginRight: 20, marginTop: "20px !important" } };

    const textFieldLandlordEmailStyles: Partial<ITextFieldStyles> = { root: { width: "100%", marginRight: 20, marginTop: "20px !important" } };

    const modalStyles: Partial<IModalStyles> = { main: { position: "absolute", top: 150 }, layer: {zIndex: 55000} };

    const buttonStyles = { root: { width: 100, marginRight: "auto !important", marginBottom: "auto", marginTop: "60px !important", marginLeft: "auto !important", height: 40 } };

    const headerIconStackStyles: Partial<IStackStyles> = { root: { marginRight: 0, marginLeft: "auto", } }

    const buildingTypeOptions = [

        { key: 'Office', text: 'Office' },
        { key: 'Industrial', text: 'Industrial' },
        { key: 'Retail', text: 'Retail' },
        { key: 'Mixed Use', text: 'Mixed Use' },
    ];



    const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>({ key: updatedProperty.buildingType!, text: updatedProperty.buildingType! });



    const onChangeBuildingType = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void => {
        if (item !== undefined) {
            setSelectedItem(item);
            setUpdateProperty({ ...updatedProperty, buildingType: item.text });
        }
    };



    const propertyProvinceOptions = [

        { key: 'WC', text: 'WC' },
        { key: 'Gau', text: 'GAU' },
        { key: 'KZN', text: 'KZN' },
        { key: 'Other', text: 'Other Provinces' },

    ];

    const [selectedProvince, setSelectedProvince] = React.useState<IDropdownOption>({ key: updatedProperty.province!, text: updatedProperty.province! });

    const onChangePropertyProvince = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void => {
        if (item !== undefined) {
            setSelectedProvince(item);
            setUpdateProperty({ ...updatedProperty, province: item.text });
        }
    };

    const suburbComboOptions: IComboBoxOption[] = distinctSuburbsOptions


    /* [
        { key: 'Header1', text: 'First heading', itemType: SelectableOptionMenuItemType.Header },
        { key: 'A', text: 'Option A' },
        { key: 'B', text: 'Option B' },
        { key: 'C', text: 'Option C' },
        { key: 'D', text: 'Option D' },
        { key: 'divider', text: '-', itemType: SelectableOptionMenuItemType.Divider },
        { key: 'Header2', text: 'Second heading', itemType: SelectableOptionMenuItemType.Header },
        { key: 'E', text: 'Option E' },
        { key: 'F', text: 'Option F', disabled: true },
        { key: 'G', text: 'Option G' },
        { key: 'H', text: 'Option H' },
        { key: 'I', text: 'Option I' },
        { key: 'J', text: 'Option J' },
      ]; */

    const [selectedSuburb, setSelectedSuburb] = React.useState<string | number | undefined>(updatedProperty.suburb);

    const onChangePropertySuburb = React.useCallback(
        (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
            setSelectedSuburb(option?.key);
            if (option !== undefined) {
                setUpdateProperty({ ...updatedProperty, suburb: option!.text })
            } else {
                setUpdateProperty({ ...updatedProperty, suburb: value })
            }
        },
        [updatedProperty],
    );

    const regionComboOptions: IComboBoxOption[] = distinctRegionsOptions

    const [selectedRegion, setSelectedRegion] = React.useState<string | number | undefined>(updatedProperty.region);

    const onChangePropertyRegion = React.useCallback(
        (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
            setSelectedRegion(option?.key);
            if (option !== undefined) {
                setUpdateProperty({ ...updatedProperty, region: option!.text })
            } else {
                setUpdateProperty({ ...updatedProperty, region: value })
            }
        },
        [updatedProperty],
    );

    const landlordComboOptions: IComboBoxOption[] = landlordsOptions

    const onChangeLandlord = React.useCallback(
        (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
            setSelectedLandlord({
                landlordName: option?.text!,
                landlordId: option?.data.landlordId,
                landlordData: option?.data
            });
            setSelectedContact({
                contactName: "",
                contactId: 0,
                contactData: { contactId: 0 }
            });

        },
        [selectedLandlord],
    );

   

    const contactsFormatted = selectedLandlord.landlordData?.contactsList?.map((contact) => {
        return { key: contact.name!, text: contact.name!, data: contact }
    })
    var contactsOptions: IComboBoxOption[] = []

    if (contactsFormatted !== undefined) {
        contactsOptions = [...contactsFormatted]
    }

    const contactComboOptions: IComboBoxOption[] = contactsOptions

    const onChangeContact = React.useCallback(
        (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
            setSelectedContact({
                contactName: option?.text!,
                contactId: option?.data.contactId,
                contactData: option?.data
            });
           
        },
        [selectedLandlord],
    );


    const stackTokens = { childrenGap: 15 };



    const onChangePropertyName = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdateProperty({ ...updatedProperty, propertyName: newValue || '' });
        },
        [updatedProperty],
    );

    const onChangeAddress = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdateProperty({ ...updatedProperty, address: newValue || '' });
        },
        [updatedProperty],
    );
    const onChangeCoordinates = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdateProperty({ ...updatedProperty, coordinates: newValue || '' });
        },
        [updatedProperty],
    );
    const onChangeErfExtent = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdateProperty({ ...updatedProperty, erfExtent: parseFloat(newValue!) || 0 });
        },
        [updatedProperty],
    );
    const onChangeTotalGLA = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdateProperty({ ...updatedProperty, totalGLA: parseFloat(newValue!) || 0 });
        },
        [updatedProperty],
    );
    const onChangeNotes = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUpdateProperty({ ...updatedProperty, notes: newValue || '' });
        },
        [updatedProperty],
    );

    const handleManageLandlords = () => {

        navigationState({ ...navigationState(), showManageLandlordsPanel: true })

    }

    const [selectedKey, setSelectedKey] = React.useState('Property Details');

    const handleLinkClick = (item?: PivotItem, ev?: React.MouseEvent<HTMLElement>) => {

        setSelectedKey(item!.props.itemKey!);
    };

    const getTabId = (itemKey: string | undefined) => {
        return `NewPropertyPivot_${itemKey}`;
    };

    const titleId = useId('New Property');


    const newPropertyTab = () => {

        switch (selectedKey) {
            case "Property Details":
                return (
                    <>
                        <Stack horizontal
                            styles={{
                                root: {
                                    /* width: '400px', */
                                    /*  margin: '10px', */

                                    color: '#605e5c',

                                    marginLeft: "0",
                                    marginRight: "auto",
                                    /* display: "block" */

                                }
                            }}>


                            <TextField
                                label="Property Name"
                                value={updatedProperty.propertyName}
                                onChange={onChangePropertyName}
                                styles={textFieldPropertyNameStyles}

                            />

                            <Dropdown
                                label="Buidling Type"
                                selectedKey={selectedItem ? selectedItem.key : undefined}
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange={onChangeBuildingType}
                                placeholder="Select type"
                                options={buildingTypeOptions}
                                styles={dropdownStyles}
                            />



                        </Stack>

                        <Stack horizontal>

                            <TextField
                                label="Address"
                                value={updatedProperty.address}
                                onChange={onChangeAddress}
                                styles={textFieldAddressStyles}
                            />
                            <TextField
                                label="Coordinates"
                                value={updatedProperty.coordinates}
                                onChange={onChangeCoordinates}
                                styles={textFieldCoordinatesStyles}
                            />

                        </Stack>

                        <Stack horizontal>

                            <ComboBox
                                label="Suburb"
                                allowFreeform={true}
                                autoComplete={"on"}
                                options={suburbComboOptions}
                                selectedKey={selectedSuburb}
                                onChange={onChangePropertySuburb}
                                styles={comboBoxStyles}
                                text={updatedProperty.suburb}
                            />

                            <ComboBox
                                label="Region"
                                allowFreeform={true}
                                autoComplete={"on"}
                                options={regionComboOptions}
                                selectedKey={selectedRegion}
                                onChange={onChangePropertyRegion}
                                styles={comboBoxStyles}
                                text={updatedProperty.region}
                            />

                            <Dropdown
                                placeholder="Select Province"
                                label="Province"
                                selectedKey={selectedProvince ? selectedProvince.key : undefined}
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange={onChangePropertyProvince}
                                options={propertyProvinceOptions}
                                styles={dropdownProvinceStyles}
                            />

                        </Stack>


                        <Stack horizontal>



                            <TextField
                                label="Erf Extent"
                                type="number"
                                value={String(updatedProperty.erfExtent)}
                                onChange={onChangeErfExtent}
                                styles={textFieldErfStyles}
                                suffix="m²"
                            />
                            <TextField
                                label="Total GLA"
                                type="number"
                                value={String(updatedProperty.totalGLA)}
                                onChange={onChangeTotalGLA}
                                styles={textFieldErfStyles}
                                suffix="m²"
                            />

                        </Stack>




                    </>
                )

            case "Landlord Details":

                return (
                    <>
                        <Stack verticalFill>

                            <Stack horizontal>

                                <ComboBox
                                    label="Landlord"
                                    allowFreeform={true}
                                    autoComplete={"on"}
                                    options={landlordComboOptions}
                                    selectedKey={selectedLandlord.landlordId}
                                    onChange={onChangeLandlord}
                                    styles={comboBoxLandlordStyles}
                                    text={selectedLandlord.landlordName}
                                />

                                <ComboBox
                                    label="Contact"
                                    allowFreeform={true}
                                    autoComplete={"on"}
                                    options={contactComboOptions}
                                    selectedKey={selectedContact !== undefined ? selectedContact.contactId : ""}
                                    onChange={onChangeContact}
                                    styles={comboBoxLandlordStyles}
                                    text={selectedContact.contactName}
                                />

                            </Stack>






                            <Stack horizontal>

                                <Stack styles={{root: {width: "70%"}}} verticalFill>

                                    <TextField
                                        underlined
                                        label="Email"
                                        value={selectedContact.contactData !== undefined ? selectedContact.contactData.email : ""}

                                        styles={textFieldLandlordEmailStyles}

                                    />

                                    <TextField
                                        underlined
                                        label="Mobile No"
                                        value={selectedContact.contactData !== undefined ? selectedContact.contactData.mobileNo : ""}

                                        styles={textFieldLandlordStyles}
                                    />
                                    <TextField
                                        underlined
                                        label="Office No"
                                        value={selectedContact.contactData !== undefined ? selectedContact.contactData.officeNo : ""}

                                        styles={textFieldLandlordStyles}
                                    />

                                </Stack>


                                <PrimaryButton onClick={handleManageLandlords} styles={buttonStyles}>
                                    Manage Landlords
                                </PrimaryButton>

                            </Stack>









                        </Stack>
                    </>
                )

            case "Property Notes":

                return (
                    <>
                        <Stack horizontal>

                            <TextField
                                label="Notes"
                                value={updatedProperty.notes}
                                onChange={onChangeNotes}
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
                isOpen={showUpdatePropertyModal}
                onDismiss={hideUpdatePropertyModal}
               /*  isBlocking={true} */
                containerClassName={contentStyles.container}
            /* dragOptions={dragOptions} */
            >
                <div className={contentStyles.header}>
                    <span id={titleId}>Update Property</span>
                    <Stack horizontal
                        styles={headerIconStackStyles}
                    >

                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={saveIcon}
                            ariaLabel="Save Investor"
                            onClick={saveUpdateProperty}
                        />
                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={cancelIcon}
                            ariaLabel="Close popup modal"
                            onClick={hideUpdatePropertyModal}
                        />

                    </Stack>

                </div>
                <div className={contentStyles.body} >

                    <Stack style={{ width: 486 }} tokens={stackTokens}>

                        <Pivot
                            aria-label="Separately Rendered Content Pivot Example"
                            selectedKey={selectedKey}
                            // eslint-disable-next-line react/jsx-no-bind
                            onLinkClick={handleLinkClick}
                            headersOnly={true}
                            getTabId={getTabId}
                        >
                            <PivotItem headerText="Property Details" itemKey="Property Details" />
                            <PivotItem headerText="Landlord Details" itemKey="Landlord Details" />
                            <PivotItem headerText="Property Notes" itemKey="Property Notes" />

                        </Pivot>

                        {newPropertyTab()}





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

export default UpdatePropertyModal
