import * as React from 'react';
import { CommandBarButton, IButtonStyles, ILayerStyleProps, ILayerStyles, ILayerProps } from 'office-ui-fabric-react';
import { Panel, PanelType, IPanelProps, IPanelStyles, IPanelStyleProps, } from 'office-ui-fabric-react/lib/Panel';
import { IRenderFunction, IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { useBoolean } from '@uifabric/react-hooks';
import { GET_SELECTED_PROPERTIES, GET_NAV_STATE, GET_DISTINCT_SUBURBS, GET_DISTINCT_REGIONS, UPDATE_IMAGES, GET_MULTI_PROPERTY, GET_PDF_VARIABLES } from "../gql/gql"
import { useMutation, useQuery } from '@apollo/client';
import { Mutation, MutationUpdatePropertyArgs, Query, NavigationState, Premises, SelectedPropertyList, Property, Agent } from "../schematypes/schematypes"
import { navigationState as navigationStateVar, selectedPropertyList as selectedPropertyListVar } from "../reactivevariables/reactivevariables"
import { Icon } from '@fluentui/react/lib/Icon';


import SelectedPropertyListPDF from "./PDFOutput/SelectedPropertyListPDF"
import PropertyListLargeImagesPDF from "./PDFOutput/PropertyListLargeImagesPDF"
import { PDFViewer, PDFDownloadLink, Document, Page } from '@react-pdf/renderer';




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
    showPreviewPDFPanel: boolean
    enquiryName: string,
    agent: Agent
    propertyIdList: number[]
}

const PreviewPDFPanel: React.FunctionComponent<Props> = ({ showPreviewPDFPanel, enquiryName, agent, propertyIdList = [] }) => {

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
        variables: { propertyIdList: propertyIdList }, fetchPolicy: "network-only"
    });

    var selectedPropertyList: SelectedPropertyList = propertyListData?.multiProperty!

    var filteredPropertyList = selectedPropertyList?.map((property) => {
        if(pdfVariables?.pdfVariables?.onlyShowVacant === true) {
            let filteredPremises = property.premisesList!.filter((premises) => {
                return premises.vacant === "true"
            })
           let premisesFilteredProperty = {...property, premisesList: filteredPremises }
            return premisesFilteredProperty
        } else {
            return property
        }
    })



    const handlePanelDismiss = () => {
        navigationStateVar({ ...navigationStateVar(), showPreviewPDFPanel: false })

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



    const cancelIcon: IIconProps = { iconName: 'Cancel' };
    const addIcon: IIconProps = { iconName: 'Add' };
    const editIcon: IIconProps = { iconName: 'Edit' };
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







    const onRenderNavigationContent: IRenderFunction<IPanelProps> = React.useCallback(
        (props, defaultRender) => (
            <>
                <IconButton
                    styles={cancelIconStyles}
                    iconProps={cancelIcon}
                    ariaLabel="Close panel"
                    onClick={handlePanelDismiss}
                />
                {/* <IconButton
                    styles={editIconStyles}
                    iconProps={editIcon}
                    ariaLabel="Edit Property Details"
                    onClick={handleEditProperty}
                /> */}



            </>
        ),
        [],
    );









    return (
        <div >
            <Panel
                isOpen={showPreviewPDFPanel}
                onDismiss={handlePanelDismiss}
                type={PanelType.extraLarge}
                onRenderNavigationContent={onRenderNavigationContent}
                /* customWidth={panelType === PanelType.custom || panelType === PanelType.customNear ? '888px' : undefined} */
                closeButtonAriaLabel="Close"
                headerText="Preview PDF"
                styles={panelStyles}
                layerProps={layerProps}
                isBlocking={false}
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




                    {<div style={{ height: '85vh' }}>
                        <PDFViewer width="100%" height="100%">
                            {pdfVariables?.pdfVariables?.outputType === "Large Images" ?
                            <PropertyListLargeImagesPDF enquiryName={enquiryName} agent={agent} selectedPropertyList={filteredPropertyList} imageLimit={pdfVariables.pdfVariables.imageLimit} showImages={pdfVariables.pdfVariables.showImages}/>:
                            <SelectedPropertyListPDF enquiryName={enquiryName} agent={agent} selectedPropertyList={filteredPropertyList} imageLimit={pdfVariables!.pdfVariables!.imageLimit} showImages={pdfVariables!.pdfVariables!.showImages}/>
                            }
                        </PDFViewer>

                    </div>}


                </Stack>





            </Panel>


        </div>
    );
};

export default PreviewPDFPanel

