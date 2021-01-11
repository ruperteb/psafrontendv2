import * as React from 'react';
import { CommandBarButton, IButtonStyles, ILayerStyleProps, ILayerStyles, ILayerProps } from 'office-ui-fabric-react';
import { Panel, PanelType, IPanelProps, IPanelStyles, IPanelStyleProps, } from 'office-ui-fabric-react/lib/Panel';
import { IRenderFunction, IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { useBoolean } from '@uifabric/react-hooks';
import { GET_SELECTED_PROPERTIES, GET_NAV_STATE, GET_DISTINCT_SUBURBS, GET_DISTINCT_REGIONS, UPDATE_IMAGES } from "../gql/gql"
import { useMutation, useQuery } from '@apollo/client';
import { Mutation, MutationUpdatePropertyArgs, Query, NavigationState, Premises, SelectedPropertyList, Property } from "../schematypes/schematypes"
import { navigationState as navigationStateVar, selectedPropertyList as selectedPropertyListVar } from "../reactivevariables/reactivevariables"
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
    showSelectedPropertyListPanel: boolean

}

const SelectedPropertyListPanel: React.FunctionComponent<Props> = ({ showSelectedPropertyListPanel, }) => {


    const {
        data: propertyListData,
        loading: propertyLoading,
        error: propertyError
    } = useQuery<Query>(GET_SELECTED_PROPERTIES);





    const handlePanelDismiss = () => {
        navigationStateVar({ ...navigationStateVar(), showSelectedPropertyListPanel: false })

    }

    const handleRemoveProperty = (propertyId: number) => {
        var updatedPropertyList = propertyListData!.selectedPropertyList!.filter(property => {
            return property.propertyId !== propertyId
        })
        selectedPropertyListVar(updatedPropertyList)

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


    var selectedPropertyList: SelectedPropertyList = propertyListData?.selectedPropertyList!

    console.log(selectedPropertyList)

    const propertyList = selectedPropertyList.map(property => {
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


    if (propertyLoading) return <div>Loading</div>;

    return (
        <div>
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


                    {propertyList}


                </Stack>





            </Panel>


        </div>
    );
};

export default SelectedPropertyListPanel

