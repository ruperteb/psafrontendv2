import * as React from 'react';
import { CommandBarButton, IButtonStyles, ILayerStyleProps, ILayerStyles, ILayerProps } from 'office-ui-fabric-react';
import { Panel, PanelType, IPanelProps, IPanelStyles, IPanelStyleProps, } from 'office-ui-fabric-react/lib/Panel';
import { IRenderFunction, IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { useBoolean } from '@uifabric/react-hooks';
import { GET_SELECTED_PROPERTIES, GET_NAV_STATE, GET_DISTINCT_SUBURBS, GET_DISTINCT_REGIONS, UPDATE_IMAGES, GET_PDF_VARIABLES, GET_MULTI_PROPERTY, NEW_PROPERTY_LIST, GET_PROPERTY_LISTS } from "../gql/gql"
import { useMutation, useQuery } from '@apollo/client';
import { Mutation, QueryMultiPropertyArgs, Query, NavigationState, Premises, SelectedPropertyList, Property, Agent, MutationPostPropertyListArgs, PropertyList } from "../schematypes/schematypes"
import { navigationState as navigationStateVar, selectedPropertyList as selectedPropertyListVar, pdfVariables as pdfVariablesVar } from "../reactivevariables/reactivevariables"
import { PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';
import { Icon } from '@fluentui/react/lib/Icon';
import PreviewPDFPanel from "./PreviewPDFPanel"
import "./SelectedPropertyListPanel.css"




import {
    getTheme,
    mergeStyleSets,
    FontWeights,
    ContextualMenu,
    Toggle,
    IToggleStyles,
    DefaultButton,
    PrimaryButton,
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
    IStackStyles,
    TextField,
    ITextFieldStyles,
    IDropdownStyles,
    IContextualMenuProps,
    DirectionalHint,
    IContextualMenuStyleProps,
    IContextualMenuStyles,
    FocusTrapCallout,
    FocusZone,
    IContextualMenuItem,

} from 'office-ui-fabric-react';
import SelectedPropertyListPDF from './PDFOutput/SelectedPropertyListPDF';


interface Props {
    showSelectedPropertyListPanel: boolean
    propertyIdList: number[]

}

const SelectedPropertyListPanel: React.FunctionComponent<Props> = ({ showSelectedPropertyListPanel, propertyIdList = [] }) => {


    /* const {
        data: propertyIdListData,
        loading: propertyIdListLoading,
        error: propertyIdListError
    } = useQuery<Query>(GET_SELECTED_PROPERTIES);

    var propertyIdList = propertyIdListData?.selectedPropertyList?.map((property) => {
        return property.propertyId
    })

    console.log(propertyIdList) */

    const {
        data: pdfVariables,
        loading: pdfLoading,
        error: pdfError
    } = useQuery<Query>(GET_PDF_VARIABLES);

    const {
        data: propertyListData,
        loading: propertyListDataLoading,
        error: propertyListDataError
    } = useQuery<Query>(GET_MULTI_PROPERTY, {
        variables: { propertyIdList: propertyIdList },
    });

    const [postPropertyList, { data: postPropertyListData }] = useMutation<Mutation, MutationPostPropertyListArgs>(NEW_PROPERTY_LIST);

  const postPropertyListButton = () => {

    postPropertyList({
      variables: {
        
        enquiryName: enquiryName,
        enquiryDate: new Date(),
        propertyIdList: propertyIdList

      },

      update(cache, { data }) {

        if (!data) {
          return null;
        }

        const getExistingPropertyLists = cache.readQuery<Query>({ query: GET_PROPERTY_LISTS });

        const existingPropertyLists = getExistingPropertyLists ? getExistingPropertyLists.propertyLists : [];
        const newPropertyList = data.postPropertyList!/* .returning[0] */;
        
        if (existingPropertyLists)
          cache.writeQuery<Query>({
            query: GET_PROPERTY_LISTS,
            data: { propertyLists: [newPropertyList, ...existingPropertyLists] }
          });
      }

    })
    
    
  }



    const [enquiryName, setEnquiryName] = React.useState(pdfVariables?.pdfVariables?.enquiryName);

    const onChangeEnquiryName = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setEnquiryName(newValue || '');
            /* pdfVariablesVar({ ...pdfVariablesVar(), enquiryName: (newValue || '') }) */
        },
        [],
    );

    const [selectedAgent, setSelectedAgent] = React.useState<IDropdownOption>();
    /* const [selectedAgentDetails, setSelectedAgentDetails] = React.useState<Agent>(); */

    const agentOptions = [

        { key: 'Sean Ellis Brown', text: 'Sean Ellis Brown' },
        { key: 'Mark Ellis Brown', text: 'Mark Ellis Brown' },

    ]

    const [selectedOutputType, setSelectedOutputType] = React.useState<IDropdownOption>({ key: 'Large Images', text: 'Large Images' });
    /* const [selectedAgentDetails, setSelectedAgentDetails] = React.useState<Agent>(); */

    const outputTypeOptions = [

        { key: 'Large Images', text: 'Large Images' },
        { key: 'Schedule', text: 'Schedule' },

    ]

    const [selectedImageLimit, setSelectedImageLimit] = React.useState<IDropdownOption>({ key: 'All', text: 'All' });
    /* const [selectedAgentDetails, setSelectedAgentDetails] = React.useState<Agent>(); */

    const imageLimitOptions = [

        { key: 'All', text: 'All' },
        { key: "1", text: "1" },
        { key: "2", text: "2" },
        { key: "3", text: "3" },
        { key: "4", text: "4" },
        { key: "5", text: "5" },
        { key: "6", text: "6" },

    ]


    const onChangeAgent = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void => {
        if (item !== undefined && item.key === 'Sean Ellis Brown') {
            setSelectedAgent(item)
            /*  setSelectedAgentDetails({name: "Sean Ellis Brown", mobile: "082 4555 183", email: "sean@ellisbrown.co.za" });  */
            pdfVariablesVar({ ...pdfVariablesVar(), agent: { name: "Sean Ellis Brown", mobile: "082 4555 183", email: "sean@ellisbrown.co.za" } })
        }
        if (item !== undefined && item.key === 'Mark Ellis Brown') {
            setSelectedAgent(item)
            /*  setSelectedAgentDetails({name: "Mark Ellis Brown", mobile: "082 4555 183", email: "mark@ellisbrown.co.za" });  */
            pdfVariablesVar({ ...pdfVariablesVar(), agent: { name: "Mark Ellis Brown", mobile: "082 4555 183", email: "mark@ellisbrown.co.za" } })
        }
    };

    const onChangeOutputType = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void => {
        if (item !== undefined && item.key === 'Large Images') {
            setSelectedOutputType(item)
            /*  setSelectedAgentDetails({name: "Sean Ellis Brown", mobile: "082 4555 183", email: "sean@ellisbrown.co.za" });  */
            pdfVariablesVar({ ...pdfVariablesVar(), outputType: item.key })
        }
        if (item !== undefined && item.key === 'Schedule') {
            setSelectedOutputType(item)
            /*  setSelectedAgentDetails({name: "Mark Ellis Brown", mobile: "082 4555 183", email: "mark@ellisbrown.co.za" });  */
            pdfVariablesVar({ ...pdfVariablesVar(), outputType: item.key })
        }
    };

    const onChangeOnlyShowVacantToggle = React.useCallback((ev: React.MouseEvent<HTMLElement>, checked: boolean | undefined) => {
        if (pdfVariables?.pdfVariables?.onlyShowVacant === false) {
            pdfVariablesVar({ ...pdfVariablesVar(), onlyShowVacant: true })

        } else {
            pdfVariablesVar({ ...pdfVariablesVar(), onlyShowVacant: false })
        }

    }, [pdfVariables?.pdfVariables?.onlyShowVacant])

    const onChangeImageLimit = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption | undefined): void => {
        if (item !== undefined && item.key === 'All') {
            setSelectedImageLimit(item)
            /*  setSelectedAgentDetails({name: "Sean Ellis Brown", mobile: "082 4555 183", email: "sean@ellisbrown.co.za" });  */
            pdfVariablesVar({ ...pdfVariablesVar(), imageLimit: item.key })
        }
        if (item !== undefined && item.key === "1") {
            setSelectedImageLimit(item)
            /*  setSelectedAgentDetails({name: "Mark Ellis Brown", mobile: "082 4555 183", email: "mark@ellisbrown.co.za" });  */
            pdfVariablesVar({ ...pdfVariablesVar(), imageLimit: parseInt(item.key) })
        }
        if (item !== undefined && item.key === "2") {
            setSelectedImageLimit(item)
            /*  setSelectedAgentDetails({name: "Mark Ellis Brown", mobile: "082 4555 183", email: "mark@ellisbrown.co.za" });  */
            pdfVariablesVar({ ...pdfVariablesVar(), imageLimit: parseInt(item.key) })
        }
        if (item !== undefined && item.key === "3") {
            setSelectedImageLimit(item)
            /*  setSelectedAgentDetails({name: "Mark Ellis Brown", mobile: "082 4555 183", email: "mark@ellisbrown.co.za" });  */
            pdfVariablesVar({ ...pdfVariablesVar(), imageLimit: parseInt(item.key) })
        }
        if (item !== undefined && item.key === "4") {
            setSelectedImageLimit(item)
            /*  setSelectedAgentDetails({name: "Mark Ellis Brown", mobile: "082 4555 183", email: "mark@ellisbrown.co.za" });  */
            pdfVariablesVar({ ...pdfVariablesVar(), imageLimit: parseInt(item.key) })
        }
        if (item !== undefined && item.key === "5") {
            setSelectedImageLimit(item)
            /*  setSelectedAgentDetails({name: "Mark Ellis Brown", mobile: "082 4555 183", email: "mark@ellisbrown.co.za" });  */
            pdfVariablesVar({ ...pdfVariablesVar(), imageLimit: parseInt(item.key) })
        }
        if (item !== undefined && item.key === "6") {
            setSelectedImageLimit(item)
            /*  setSelectedAgentDetails({name: "Mark Ellis Brown", mobile: "082 4555 183", email: "mark@ellisbrown.co.za" });  */
            pdfVariablesVar({ ...pdfVariablesVar(), imageLimit: parseInt(item.key) })
        }
    };

    const onChangeShowImagesToggle = React.useCallback((ev: React.MouseEvent<HTMLElement>, checked: boolean | undefined) => {
        if (pdfVariables?.pdfVariables?.showImages === false) {
            pdfVariablesVar({ ...pdfVariablesVar(), showImages: true })

        } else {
            pdfVariablesVar({ ...pdfVariablesVar(), showImages: false })
        }

    }, [pdfVariables?.pdfVariables?.showImages])


    const handlePanelDismiss = () => {
        navigationStateVar({ ...navigationStateVar(), showSelectedPropertyListPanel: false })

    }

    const handleClearSelectedProperties = () => {
        selectedPropertyListVar([])

    }

    const handleRemoveProperty = (propertyId: number) => {
        var updatedPropertyList = propertyListData!.multiProperty!.filter(property => {
            return property.propertyId !== propertyId
        })
        selectedPropertyListVar(updatedPropertyList)

    }

    const handlePreviewPDF = () => {
        pdfVariablesVar({ ...pdfVariablesVar(), enquiryName: (enquiryName || '') })
        navigationStateVar({ ...navigationStateVar(), showPreviewPDFPanel: true })

    }

    const handlePDFDDownload = () => {
        pdfVariablesVar({ ...pdfVariablesVar(), enquiryName: (enquiryName || '') })
        navigationStateVar({ ...navigationStateVar(), showSelectedPropertyListPanel: false })

    }


    const handleManageLists = (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined, item?: IContextualMenuItem | undefined) => {
        
        navigationStateVar({ ...navigationStateVar(), showSavedListsPanel: true })

    }

    




    const theme = getTheme();
    const cancelIconStyles = {
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

    const clearIconStyles = {
        root: {
            color: theme.palette.neutralPrimary,
              marginLeft: "10px !important",
        },
        rootHovered: {
            color: theme.palette.neutralDark,
        },
        icon: {
            fontSize: "24px",
        }
    };

    const deleteIconStyles = {
        root: {
            color: theme.palette.neutralPrimary,
            marginLeft: "auto",
            marginRight: 30

        },
        rootHovered: {
            color: theme.palette.neutralDark,
        },
        icon: {
            fontSize: "14px",

        }
    };

    const cancelIcon: IIconProps = { iconName: 'Cancel' };
    const clearIcon: IIconProps = { iconName: 'RemoveFromShoppingList' };
    
    const deleteIcon: IIconProps = { iconName: 'Delete' };

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
        headerText: { fontSize: 24, marginLeft: 5 },
        

    }

    const layerStyles: IStyleFunctionOrObject<ILayerStyleProps, ILayerStyles> = {
        root: { zIndex: 50000 },
    }

    const layerProps: ILayerProps = {
        styles: layerStyles
    }


    const boldStyle = { root: { fontWeight: FontWeights.semibold } };
    const propertyDetailsStyles = { alignSelf: "start", fontSize: "18px", paddingLeft: "15px" }

    const boldStyle2 = { root: { fontWeight: FontWeights.bold } };
    const propertyDetailsHeadingStyles = { /* alignSelf: "start", */ fontSize: "20px", marginLeft: "auto", marginRight: "auto", marginTop: 10, marginBottom: 10 }
    const propertyNotesStyles = { alignSelf: "start", fontSize: "16px", paddingLeft: "15px", marginTop: 0 }

    const buttonStyles = { root: { marginRight: 8, marginBottom: 0, marginTop: "20px !important" }, };

    const saveListButtonStyles: IButtonStyles = {
        root: { marginBottom: 0, marginTop: "auto !important", },
        flexContainer: { marginBottom: 0, marginTop: "auto !important", },

        splitButtonMenuButton: { backgroundColor: 'rgb(0, 120, 212)', width: 28, border: 'none' },
        splitButtonMenuIcon: { fontSize: '7px' },
        splitButtonDivider: { backgroundColor: '#c8c8c8', width: 1, right: 26, position: 'absolute', top: 4, bottom: 4 },
        splitButtonContainer: {
            height: "fit-content",
            marginBottom: 0, marginTop: "auto !important",
        },
    }


    const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { marginRight: 20, /* marginBottom: 10, */ }, root: { width: "100%", } };

    const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 135, marginRight: 10 } };

    const toggleStyles: Partial<IToggleStyles> = { container: { marginTop: 5 }, label: { marginLeft: 4 } };

    const onRenderNavigationContent: IRenderFunction<IPanelProps> = React.useCallback(
        (props, defaultRender) => (
            <>
                <IconButton
                    styles={cancelIconStyles}
                    iconProps={cancelIcon}
                    ariaLabel="Close panel"
                    onClick={handlePanelDismiss}
                />
                {<IconButton
                    styles={clearIconStyles}
                    iconProps={clearIcon}
                    ariaLabel="Edit Property Details"
                    onClick={handleClearSelectedProperties}
                />}



            </>
        ),
        [],
    );

    const dropdownMenuStyles: IStyleFunctionOrObject<IContextualMenuStyleProps, IContextualMenuStyles> = { container: { width: 125 } };

    const menuPropsPDF: IContextualMenuProps = {
        styles: dropdownMenuStyles,
        // For example: disable dismiss if shift key is held down while dismissing
        directionalHint: DirectionalHint.topRightEdge,
        items: [
            {
                key: 'ManageLists',
                text: 'Manage Lists',
                iconProps: { iconName: 'List' },
                  onClick: handleManageLists
            },

        ],
    };

    const [isOutputOptionsCalloutVisible, { toggle: toggleIsOutputOptionsCalloutVisible }] = useBoolean(false);

    const outputOptionsStyles = mergeStyleSets({
        /*  buttonArea: {
           verticalAlign: 'top',
           display: 'inline-block',
           textAlign: 'center',
           margin: '0 100px',
           minWidth: 130,
           height: 32,
         }, */
        callout: {
            maxWidth: 600,
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



    const onRenderFooterContent = React.useCallback(
        () => (
            <Stack styles={{
                root: {
                    flexFlow: "row wrap",
                    marginBottom: 20
                }
            }
            }>
                <TextField
                    label="Enquiry Name"
                    value={pdfVariables?.pdfVariables?.enquiryName}
                    onChange={onChangeEnquiryName}

                    styles={textFieldStyles}
                />
                <Dropdown
                    label="Agent"
                    selectedKey={selectedAgent ? selectedAgent.key : undefined}
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange={onChangeAgent}
                    placeholder="Select Agent"
                    options={agentOptions}
                    styles={dropdownStyles}
                />
                <PrimaryButton
                    split
                    menuProps={menuPropsPDF}
                    onClick={postPropertyListButton} styles={saveListButtonStyles}>
                    Save List
            </PrimaryButton>


                <PrimaryButton
                    /* menuProps={menuPropsPDF} */
                    onClick={handlePreviewPDF} styles={buttonStyles}>
                    Preview PDF
            </PrimaryButton>

                <PrimaryButton
                    id="OutputOptionsButton"
                    /* menuProps={menuPropsPDF} */
                    onClick={toggleIsOutputOptionsCalloutVisible} styles={buttonStyles}>
                    Output Options
            </PrimaryButton>









            </Stack>
        ),
        [pdfVariables?.pdfVariables?.enquiryName],
    );


    var selectedPropertyList: SelectedPropertyList = propertyListData?.multiProperty!





    /* const propertyList = () =>  {

       

           var list=  selectedPropertyList.map(property => {
                return (
                    <Stack styles={{ root: { marginLeft: 10, marginTop: "10px !important", alignItems: "center" } }} horizontal>
                        {property.propertyName}
                        <IconButton
                            styles={deleteIconStyles}
                            iconProps={deleteIcon}
                            ariaLabel="Remove Property"
                            onClick={() => handleRemoveProperty(property.propertyId)}
                        />
        
                    </Stack>
                )
            })
            
       return list
    } */



    const propertyList = selectedPropertyList?.map(property => {
        return (
            <Stack styles={{ root: { marginLeft: 10, marginTop: "10px !important", alignItems: "center" } }} horizontal>
                {property.propertyName}
                <IconButton
                    styles={deleteIconStyles}
                    iconProps={deleteIcon}
                    ariaLabel="Remove Property"
                    onClick={() => handleRemoveProperty(property.propertyId)}
                />

            </Stack>
        )
    })


    /* if (propertyListDataLoading) return <div>Loading</div>; */








    return (
        <div >
            <Panel
                isOpen={showSelectedPropertyListPanel}
                onDismiss={handlePanelDismiss}
                type={PanelType.smallFixedFar}
                onRenderNavigationContent={onRenderNavigationContent}
                /* customWidth={panelType === PanelType.custom || panelType === PanelType.customNear ? '888px' : undefined} */
                closeButtonAriaLabel="Close"
                headerText="Selected Property List"
                styles={panelStyles}
                layerProps={layerProps}
                isBlocking={false}
                onRenderFooterContent={onRenderFooterContent}
                isFooterAtBottom={true}
                id="SelectedPropertyListPanel"
            >

                <Stack verticalFill styles={{
                    root: {
                        display: "flex",
                        flexFlow: "column",
                        paddingTop: 10
                        /* maxWidth: "fit-content" */
                        /*  marginTop: "0 !important" */
                    }
                }}>


                    {selectedPropertyList !== undefined ? propertyList : <div>loading</div>}


                </Stack>

                {isOutputOptionsCalloutVisible ? (
                    <div>
                        <FocusTrapCallout
                            role="alertdialog"
                            className={outputOptionsStyles.callout}
                            gapSpace={0}
                            target={`#OutputOptionsButton`}
                            onDismiss={toggleIsOutputOptionsCalloutVisible}
                            setInitialFocus
                        >
                            <div className={outputOptionsStyles.header}>
                                <Text className={outputOptionsStyles.title}>Output Options</Text>
                            </div>
                            <div className={outputOptionsStyles.inner}>
                                <div>

                                    <Stack>

                                        <Stack horizontal>

                                        <Dropdown
                                            label="Output Type"
                                            selectedKey={selectedOutputType ? selectedOutputType.key : undefined}
                                            // eslint-disable-next-line react/jsx-no-bind
                                            onChange={onChangeOutputType}
                                            placeholder="Output Type"
                                            options={outputTypeOptions}
                                            styles={dropdownStyles}
                                        />

                                        <Toggle
                                            onText="Vacant"
                                            offText="All"
                                            styles={toggleStyles}
                                            label="Display:"
                                            checked={pdfVariables?.pdfVariables?.onlyShowVacant}
                                            onChange={onChangeOnlyShowVacantToggle}
                                        />

                                        </Stack>

                                        <Stack horizontal>

                                        <Dropdown
                                            label="Image Limit"
                                            selectedKey={selectedImageLimit ? selectedImageLimit.key : undefined}
                                            // eslint-disable-next-line react/jsx-no-bind
                                            onChange={onChangeImageLimit}
                                            placeholder="Image Limit"
                                            options={imageLimitOptions}
                                            styles={dropdownStyles}
                                        />

                                        <Toggle
                                            onText="Yes"
                                            offText="No"
                                            styles={toggleStyles}
                                            label="Show Images?"
                                            checked={pdfVariables?.pdfVariables?.showImages}
                                            onChange={onChangeShowImagesToggle}
                                        />

                                        </Stack>

                                        


                                    </Stack>
                                    {/* <Text className={outputOptionsStyles.subtext}>
                                        Are you sure you want to delete this image?
</Text> */}
                                </div>
                            </div>
                            <FocusZone>
                                <Stack className={outputOptionsStyles.buttons} gap={8} horizontal>
                                    
                                    <DefaultButton style={{marginLeft:0, marginRight: "auto"}} onClick={toggleIsOutputOptionsCalloutVisible}>Close</DefaultButton>
                                </Stack>
                            </FocusZone>
                        </FocusTrapCallout>
                    </div>
                ) : null}





            </Panel>


        </div>
    );
};

export default SelectedPropertyListPanel

