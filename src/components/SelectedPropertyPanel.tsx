import * as React from 'react';
import { CommandBarButton, IButtonStyles, ILayerStyleProps, ILayerStyles, ILayerProps } from 'office-ui-fabric-react';
import { Panel, PanelType, IPanelProps, IPanelStyles, IPanelStyleProps, } from 'office-ui-fabric-react/lib/Panel';
import { IRenderFunction, IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { useBoolean } from '@uifabric/react-hooks';
import { GET_SINGLE_PROPERTY, GET_NAV_STATE, GET_DISTINCT_SUBURBS, GET_DISTINCT_REGIONS, UPDATE_IMAGES } from "../gql/gql"
import { useMutation, useQuery } from '@apollo/client';
import { Mutation, MutationUpdatePropertyArgs, Query, NavigationState, Premises } from "../schematypes/schematypes"
import { navigationState as navigationStateVar } from "../reactivevariables/reactivevariables"
import { Icon } from '@fluentui/react/lib/Icon';
import Map from "./Map"
import ImageGalleryModal from "./ImageGalleryModal"
import PremisesList from "./PremisesList"
import NewPremisesModal from "./NewPremisesModal"
import PremisesNotesModal from "./PremisesNotesModal"
import UpdatePremisesModal from "./UpdatePremisesModal"
import DuplicatePremisesModal from "./DuplicatePremisesModal"
import UpdatePropertyModal from "./UpdatePropertyModal"




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
    Stack,
    Text,
    IStackStyles

} from 'office-ui-fabric-react';


interface Props {
    distinctSuburbsOptions: IComboBoxOption[];
    distinctRegionsOptions: IComboBoxOption[];

}

const SelectedPropertyPanel: React.FunctionComponent<Props> = ({distinctSuburbsOptions, distinctRegionsOptions}) => {

    const {
        data: navigationStateData,
        loading: navigationLoading,
        error: navigationError
    } = useQuery<Query>(GET_NAV_STATE);

    var navigationState: NavigationState = {
        showNewPropertyModal: false,
        showUpdatePropertyModal: false,
        showNewPremisesModal: false,
        showUpdatePremisesModal: false,
        showDuplicatePremisesModal: false,
        showPremisesNotesModal: false,
        showPreviewPDFPanel: false,
        showFilterModal: false,
        showImageGalleryModal: false,
        selectedPropertyType: "all",
        search: "",
        showSelectedPropertyListPanel: false,
        selectedPropertyId: 0,
        selectedPremisesId: 0,
    }

    if (navigationStateData !== undefined) {
        navigationState = navigationStateData!.navigationState!
    }

    const {
        data: propertyData,
        loading: propertyLoading,
        error: propertyError
    } = useQuery<Query>(GET_SINGLE_PROPERTY, {
        variables: { propertyId: navigationState.selectedPropertyId },
    });

    console.log(propertyData)

    React.useEffect(() => {
        if (navigationState.selectedPropertyId !== 0) {
            openPanel()
        } else {
            dismissPanel()
        }

    }, [navigationState])

    const handlePanelDismiss = () => {
        navigationStateVar({ ...navigationStateVar(), selectedPropertyId: 0 })
        dismissPanel()
    }

    const handleEditProperty = () => {
        navigationStateVar({ ...navigationStateVar(), showUpdatePropertyModal: true })
        
    }



    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

    const theme = getTheme();
    const deleteIconStyles = {
        root: {
            color: theme.palette.neutralPrimary,
            /*   marginLeft: "10px !important",
              marginTop: '4px',
              marginRight: '2px', */

        },
        rootHovered: {
            color: theme.palette.neutralDark,
        },
        icon: {
            fontSize: "24px",

        }
    };

    const editIconStyles = {
        root: {
            color: theme.palette.neutralPrimary,
            marginLeft: 20

        },
        rootHovered: {
            color: theme.palette.neutralDark,
        },
        icon: {
            fontSize: "24px",

        }
    };

    const cancelIcon: IIconProps = { iconName: 'Cancel' };
    const addIcon: IIconProps = { iconName: 'Add' };
    const editIcon: IIconProps = { iconName: 'Edit' };
    const photoCollectionIcon: IIconProps = { iconName: 'PhotoCollection' };
    const commandBarStyles: Partial<IButtonStyles> = { root: { border: "1px solid rgb(161, 159, 157);", padding: 10 } };
    const panelStyles: IStyleFunctionOrObject<IPanelStyleProps, IPanelStyles> = {
        /*   root: {}, */
        navigation: {
            justifyContent: "flex-start",
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 20
        },
        header: {},
        headerText: { fontSize: 24, marginLeft: 75 },

    }

    const layerStyles: IStyleFunctionOrObject<ILayerStyleProps, ILayerStyles> = {
        root: { zIndex: 50000 },
    }

    const layerProps: ILayerProps = {
        styles: layerStyles
    }


    const boldStyle = { root: { fontWeight: FontWeights.semibold } };
    const propertyDetailsStyles = { alignSelf: "start", fontSize: "18px", paddingLeft: "15px" }
    const propertyDetailsLandlordStyles = { alignSelf: "start", fontSize: "18px", paddingLeft: "15px" , width: 125}

    const boldStyle2 = { root: { fontWeight: FontWeights.bold } };
    const propertyDetailsHeadingStyles = { /* alignSelf: "start", */ fontSize: "20px", marginLeft: "auto", marginRight: "auto", marginTop: 10, marginBottom: 10 }
    const propertyNotesStyles = { alignSelf: "start", fontSize: "16px", paddingLeft: "15px", marginTop: 0 }

    const getEarliestOccDate = () => {

        var premises = propertyData?.singleProperty?.premisesList
        var premisesByOccDates: Premises[] = []
        var date: Date = new Date()
        if (premises !== undefined) {
            premisesByOccDates = premises.slice().sort((a, b) => {
                return Date.parse(a.occupation) - Date.parse(b.occupation)
            });
        }

        if (premisesByOccDates[0] !== undefined) {
            date = new Date(premisesByOccDates[0].occupation)
        }
        return date.toLocaleDateString(
            'en-gb',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        );
    }

    const getEarliestExpDate = () => {

        var premises = propertyData?.singleProperty?.premisesList
        var premisesByOccDates: Premises[] = []
        var date: Date = new Date()
        if (premises !== undefined) {
            premisesByOccDates = premises.slice().sort((a, b) => {
                return Date.parse(a.leaseExpiry) - Date.parse(b.leaseExpiry)
            });
        }

        if (premisesByOccDates[0] !== undefined) {
            date = new Date(premisesByOccDates[0].leaseExpiry)
        }
        return date.toLocaleDateString(
            'en-gb',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        );
    }

    const getVacantGLA = () => {
        var vacantGLA = 0
        propertyData?.singleProperty?.premisesList!.map(premises => {
            if (premises.vacant === "true") {
                vacantGLA += premises.area!
            }
        })
        return vacantGLA
    }

    const onRenderNavigationContent: IRenderFunction<IPanelProps> = React.useCallback(
        (props, defaultRender) => (
            <>
                <IconButton
                    styles={deleteIconStyles}
                    iconProps={cancelIcon}
                    ariaLabel="Close panel"
                    onClick={handlePanelDismiss}
                />
                <IconButton
                    styles={editIconStyles}
                    iconProps={editIcon}
                    ariaLabel="Edit Property Details"
                    onClick={handleEditProperty}
                />



            </>
        ),
        [],
    );

    var coordinatesArray: string[] | undefined = []


    if (propertyData?.singleProperty?.coordinates !== null) {
        coordinatesArray = propertyData?.singleProperty?.coordinates!.split(',');
    }


    const getLatitude = () => {
        if (coordinatesArray !== undefined && coordinatesArray !== null)
            return Number(coordinatesArray[0]).toFixed(2)
        else return ""
    }

    const getLongitude = () => {
        if (coordinatesArray !== undefined && coordinatesArray !== null)
            return Number(coordinatesArray[1]).toFixed(2)
        else return ""
    }

    var checkUploadResult = (resultEvent: any) => {

        if (resultEvent.event === "success") {
            console.log(resultEvent.info.secure_url)
            console.log(resultEvent.info.public_id)
            saveNewImage(resultEvent.info.public_id)
        }
    }


    // @ts-ignore: Unreachable code error
    var widget = window.cloudinary.createUploadWidget({
        cloudName: "drlfedqyz", uploadPreset: "xblzxkc8"
    }, (error: any, result: any) => { checkUploadResult(result) });

    const showUploadWidget = () => {
        widget.open()

    }

    const [updateProperty, { data }] = useMutation<Mutation, MutationUpdatePropertyArgs>(UPDATE_IMAGES);

    const saveNewImage = (image: string) => {

        updateProperty({
            variables: {
                propertyId: navigationState.selectedPropertyId,
                images: propertyData?.singleProperty?.images?.concat(image)
            },

            update(cache, { data }) {

                if (!data) {
                    return null;
                }

                const getExistingProperty = cache.readQuery<Query>({ query: GET_SINGLE_PROPERTY, variables: { propertyId: navigationState.selectedPropertyId } })

                const updatedProperty = data.updateProperty!;
                console.log(updatedProperty)
                if (getExistingProperty)
                    cache.writeQuery<Query>({
                        query: GET_SINGLE_PROPERTY,
                        variables: { propertyId: navigationState.selectedPropertyId },
                        data: { singleProperty: updatedProperty }
                    });
            }
        })
    }

    if (navigationLoading) return <div>Loading</div>;
    if (propertyLoading) return <div>Loading</div>;

    return (
        <div>
            <Panel
                isOpen={isOpen}
                onDismiss={handlePanelDismiss}
                type={PanelType.extraLarge}
                onRenderNavigationContent={onRenderNavigationContent}
                /* customWidth={panelType === PanelType.custom || panelType === PanelType.customNear ? '888px' : undefined} */
                closeButtonAriaLabel="Close"
                headerText={propertyData?.singleProperty?.propertyName}
                styles={panelStyles}
                layerProps={layerProps}
            >

                <Stack id="Details to Maps Container" styles={{
                    root: {
                        display: "flex",
                        flexFlow: "row",
                        /* maxWidth: "fit-content" */
                        /*  marginTop: "0 !important" */
                    }
                }}>

                    <Stack id="Details, Landlord and Notes Container" styles={{
                        root: {
                            /*   display: "flex",
                              flexFlow: "row", */
                            maxWidth: "fit-content",
                            marginLeft: 25,
                            marginTop: 20
                            /*  marginTop: "0 !important" */
                        }
                    }}>

                        <Stack id="Details and Landlord Container" styles={{
                            root: {
                                display: "flex",
                                flexFlow: "row",
                                /* maxWidth: "fit-content" */
                                /*  marginTop: "0 !important" */
                            }
                        }}>

                            <Stack id="Property Details" styles={{
                                root: {
                                    /* width: 700, */
                                    marginTop: "20 !important",
                                    marginBottom: 10,
                                    marginRight: 20,
                                    padding: '10px',
                                    textAlign: 'left',
                                    color: '#605e5c',
                                    alignItems: "left",
                                    display: "flex",
                                    flexFlow: "column",
                                    /*  borderTop: "4px solid #2557a2;",
                                     borderBottom: "4px solid #2557a2;", */
                                    backgroundColor: "white",
                                    /*  background: isChecked() ? "rgb(104 113 140 / 14%)" : "white", */
                                    /*  boxShadow: "-1px 1px 7px 2px #d4cece",
                                     selectors: {
                                         '&:hover': { background: "rgb(104 113 140 / 14%)" },
                                     }, */
                                    /* maxWidth: "fit-content" */

                                }
                            }}
                                gap={15}>
                                <div style={{ display: "flex", borderTop: "3px solid rgb(204 171 124 / 42%)" }}>
                                    <Text styles={boldStyle2} style={propertyDetailsHeadingStyles}>Property Details:</Text>
                                </div>


                                <Stack styles={{
                                    root: {
                                        /* width: 700, */
                                        /*  marginTop: 20,
                                         marginBottom: 10, */
                                        /*   padding: '10px', */
                                        textAlign: 'left',
                                        color: '#605e5c',
                                        alignItems: "left",
                                        display: "flex",
                                        flexFlow: "row",
                                        /*  borderTop: "4px solid #2557a2;",
                                         borderBottom: "4px solid #2557a2;", */
                                        backgroundColor: "white",
                                        /*  background: isChecked() ? "rgb(104 113 140 / 14%)" : "white", */
                                        /*  boxShadow: "-1px 1px 7px 2px #d4cece",
                                         selectors: {
                                             '&:hover': { background: "rgb(104 113 140 / 14%)" },
                                         }, */
                                        marginTop: "0 !important",
                                        borderBottom: "3px solid rgb(204 171 124 / 42%)"


                                    }
                                }}
                                    gap={15}>

                                    <Stack styles={{
                                        root: {
                                            padding: '10px',
                                            textAlign: 'left',
                                            alignItems: "left",
                                            display: "flex",
                                            flexFlow: "row",

                                        }
                                    }}>

                                        <Stack verticalFill styles={{
                                            root: {
                                                marginTop: "0 !important"
                                            },
                                        }}
                                            gap={15}>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Address:</Text>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Suburb:</Text>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Region:</Text>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Province:</Text>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Building Type:</Text>

                                        </Stack>


                                        <Stack verticalFill styles={{
                                            root: {
                                                marginTop: "0 !important",
                                                marginLeft: 20
                                            },
                                        }}
                                            gap={15}>
                                            <Text style={propertyDetailsStyles}>{propertyData?.singleProperty?.address !== "" ? propertyData?.singleProperty?.address : "-"}</Text>
                                            <Text style={propertyDetailsStyles}>{propertyData?.singleProperty?.suburb !== "" ? propertyData?.singleProperty?.suburb : "-"}</Text>
                                            <Text style={propertyDetailsStyles}>{propertyData?.singleProperty?.region !== "" ? propertyData?.singleProperty?.region : "-"}</Text>
                                            <Text style={propertyDetailsStyles}>{propertyData?.singleProperty?.province !== "" ? propertyData?.singleProperty?.province : "-"}</Text>
                                            <Text style={propertyDetailsStyles}>{propertyData?.singleProperty?.buildingType !== "" ? propertyData?.singleProperty?.buildingType : "-"}</Text>
                                        </Stack>

                                    </Stack>

                                    <Stack styles={{
                                        root: {
                                            padding: '10px',
                                            textAlign: 'left',
                                            alignItems: "left",
                                            display: "flex",
                                            flexFlow: "row",
                                            marginTop: "0 !important"
                                        }
                                    }}>

                                        <Stack verticalFill styles={{
                                            root: {
                                                marginTop: "0 !important"
                                            },
                                        }}
                                            gap={15}>

                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Erf Extent:</Text>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Total GLA:</Text>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Vacant GLA:</Text>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Earliest Occupation:</Text>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Earliest Expiry:</Text>
                                        </Stack>


                                        <Stack verticalFill styles={{
                                            root: {
                                                marginTop: "0 !important",
                                                marginLeft: 20
                                            },
                                        }}
                                            gap={15}>

                                            <Text style={propertyDetailsStyles}>{`${propertyData?.singleProperty?.erfExtent} m²`}</Text>
                                            <Text style={propertyDetailsStyles}>{`${propertyData?.singleProperty?.totalGLA} m²`}</Text>
                                            <Text style={propertyDetailsStyles}>{`${getVacantGLA()} m²`}</Text>
                                            <Text style={propertyDetailsStyles}>{getEarliestOccDate()}</Text>
                                            <Text style={propertyDetailsStyles}>{getEarliestExpDate()}</Text>
                                        </Stack>

                                    </Stack>

                                </Stack>

                                <Stack id="Notes" styles={{
                                    root: {
                                        /* width: 700, */
                                        /*   marginTop: 10, */
                                        marginBottom: 10,
                                        /*  padding: '10px', */
                                        textAlign: 'left',
                                        color: '#605e5c',
                                        alignItems: "left",
                                        display: "flex",
                                        flexFlow: "column",
                                        /*  borderTop: "4px solid #2557a2;",
                                         borderBottom: "4px solid #2557a2;", */
                                        backgroundColor: "white",
                                        /*  borderBottom: "3px solid rgb(204 171 124 / 42%)" */
                                        /*  background: isChecked() ? "rgb(104 113 140 / 14%)" : "white", */
                                        /*  boxShadow: "-1px 1px 7px 2px #d4cece",
                                         selectors: {
                                             '&:hover': { background: "rgb(104 113 140 / 14%)" },
                                         }, */
                                        /* maxWidth: "fit-content" */

                                    }
                                }}
                                    gap={15}>

                                    <div style={{ display: "flex",  /* borderTop: "3px solid rgb(204 171 124 / 42%)" , */ marginTop: "0 !important" }}>
                                        <Text styles={boldStyle2} style={propertyDetailsHeadingStyles}>Notes:</Text>

                                    </div>
                                    <div style={{ display: "flex", /* borderBottom: "3px solid rgb(204 171 124 / 42%)", */ margin: 0, paddingBottom: 10 }}>
                                        <Text style={propertyNotesStyles}>{propertyData?.singleProperty?.notes}</Text>

                                    </div>


                                </Stack>

                            </Stack>

                            <Stack id="Landlord Details" styles={{
                                root: {
                                    /* width: 700, */
                                    marginTop: 20,
                                    marginBottom: 10,
                                    padding: '10px',
                                    textAlign: 'left',
                                    color: '#605e5c',
                                    alignItems: "left",
                                    display: "flex",
                                    flexFlow: "column",
                                    /*  borderTop: "4px solid #2557a2;",
                                     borderBottom: "4px solid #2557a2;", */
                                    backgroundColor: "white",
                                    /*  background: isChecked() ? "rgb(104 113 140 / 14%)" : "white", */
                                    /*  boxShadow: "-1px 1px 7px 2px #d4cece",
                                     selectors: {
                                         '&:hover': { background: "rgb(104 113 140 / 14%)" },
                                     }, */
                                    maxWidth: "fit-content"

                                }
                            }}
                                gap={15}>
                                <div style={{ display: "flex", borderTop: "3px solid rgb(204 171 124 / 42%)" }}>
                                    <Text styles={boldStyle2} style={propertyDetailsHeadingStyles}>Landlord Details:</Text>
                                </div>


                                <Stack styles={{
                                    root: {
                                        /* width: 700, */
                                        /*  marginTop: 20,
                                         marginBottom: 10, */
                                        /*   padding: '10px', */
                                        textAlign: 'left',
                                        color: '#605e5c',
                                        alignItems: "left",
                                        display: "flex",
                                        flexFlow: "row",
                                        /*  borderTop: "4px solid #2557a2;",
                                         borderBottom: "4px solid #2557a2;", */
                                        backgroundColor: "white",
                                        /*  background: isChecked() ? "rgb(104 113 140 / 14%)" : "white", */
                                        /*  boxShadow: "-1px 1px 7px 2px #d4cece",
                                         selectors: {
                                             '&:hover': { background: "rgb(104 113 140 / 14%)" },
                                         }, */
                                        marginTop: "0 !important",
                                        borderBottom: "3px solid rgb(204 171 124 / 42%)"


                                    }
                                }}
                                    gap={15}>

                                    <Stack styles={{
                                        root: {
                                            padding: '10px',
                                            textAlign: 'left',
                                            alignItems: "left",
                                            display: "flex",
                                            flexFlow: "row",

                                        }
                                    }}>

                                        <Stack verticalFill styles={{
                                            root: {
                                                marginTop: "0 !important"
                                            },
                                        }}
                                            gap={15}>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Landlord:</Text>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Contact:</Text>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Email:</Text>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Office:</Text>
                                            <Text styles={boldStyle} style={propertyDetailsStyles}>Mobile:</Text>
                                        </Stack>


                                        <Stack verticalFill styles={{
                                            root: {
                                                marginTop: "0 !important",
                                                marginLeft: 20
                                            },
                                        }}
                                            gap={15}>
                                            <Text style={propertyDetailsLandlordStyles}>{propertyData?.singleProperty?.contact?.landlordName?.landlordName !== "" ? propertyData?.singleProperty?.contact?.landlordName?.landlordName : "-"}</Text>
                                            <Text style={propertyDetailsLandlordStyles}>{propertyData?.singleProperty?.contact?.name !== "" ? propertyData?.singleProperty?.contact?.name : "-"}</Text>
                                            <Text style={propertyDetailsLandlordStyles}>{propertyData?.singleProperty?.contact?.email !== "" ? propertyData?.singleProperty?.contact?.email : "-"}</Text>
                                            <Text style={propertyDetailsLandlordStyles}>{propertyData?.singleProperty?.contact?.mobileNo !== "" ? propertyData?.singleProperty?.contact?.mobileNo : "-"}</Text>
                                            <Text style={propertyDetailsLandlordStyles}>{propertyData?.singleProperty?.contact?.officeNo !== "" ? propertyData?.singleProperty?.contact?.officeNo : "-"}</Text>
                                        </Stack>

                                    </Stack>
                                </Stack>

                                <Stack verticalFill styles={{
                                    root: {
                                        marginTop: "20px !important",
                                        padding: 10
                                    },
                                }}
                                    gap={15}>

                                    <CommandBarButton
                                        iconProps={photoCollectionIcon}
                                        text="Image Gallery"
                                        onClick={() => navigationStateVar({ ...navigationStateVar(), showImageGalleryModal: true })}
                                        styles={commandBarStyles}
                                    // Set split=true to render a SplitButton instead of a regular button with a menu
                                    // split={true}

                                    />

                                    <CommandBarButton
                                        iconProps={addIcon}
                                        text="Upload Images"
                                        onClick={() => showUploadWidget()}
                                        styles={commandBarStyles}
                                    // Set split=true to render a SplitButton instead of a regular button with a menu
                                    // split={true}

                                    />

                                </Stack>

                            </Stack>

                        </Stack>





                    </Stack>



                    <Stack styles={{
                        root: {
                            marginLeft: 30,
                            marginRight: "auto",
                            padding: '10px',

                        }
                    }}>

                        <Map coordinatesArray={coordinatesArray} propertyId={propertyData?.singleProperty?.propertyId!}></Map>

                    </Stack>



                </Stack>

                <ImageGalleryModal showImageGalleryModal={navigationStateData?.navigationState?.showImageGalleryModal!} propertyId={navigationStateData?.navigationState?.selectedPropertyId!}></ImageGalleryModal>



                <PremisesList singleProperty={propertyData?.singleProperty!}></PremisesList>

                <UpdatePropertyModal showUpdatePropertyModal={navigationStateData?.navigationState?.showUpdatePropertyModal!} distinctSuburbsOptions={distinctSuburbsOptions} distinctRegionsOptions={distinctRegionsOptions} propertyId={navigationStateData?.navigationState?.selectedPropertyId!} propertyData={propertyData?.singleProperty!} ></UpdatePropertyModal>

                <NewPremisesModal showNewPremisesModal={navigationStateData?.navigationState?.showNewPremisesModal!} propertyId={navigationStateData?.navigationState?.selectedPropertyId!}></NewPremisesModal>

                <PremisesNotesModal showPremisesNotesModal={navigationStateData?.navigationState?.showPremisesNotesModal!} propertyId={navigationStateData?.navigationState?.selectedPropertyId!} premisesId={navigationStateData?.navigationState?.selectedPremisesId!} ></PremisesNotesModal>

                <UpdatePremisesModal showUpdatePremisesModal={navigationStateData?.navigationState?.showUpdatePremisesModal!} propertyId={navigationStateData?.navigationState?.selectedPropertyId!} premisesId={navigationStateData?.navigationState?.selectedPremisesId!}></UpdatePremisesModal>

                <DuplicatePremisesModal showDuplicatePremisesModal={navigationStateData?.navigationState?.showDuplicatePremisesModal!} propertyId={navigationStateData?.navigationState?.selectedPropertyId!} premisesId={navigationStateData?.navigationState?.selectedPremisesId!}></DuplicatePremisesModal>



            </Panel>


        </div>
    );
};

export default SelectedPropertyPanel

