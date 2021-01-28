import * as React from 'react';
import { CommandBarButton, IButtonStyles, ILayerStyleProps, ILayerStyles, ILayerProps } from 'office-ui-fabric-react';
import { Panel, PanelType, IPanelProps, IPanelStyles, IPanelStyleProps, } from 'office-ui-fabric-react/lib/Panel';
import { IRenderFunction, IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { useBoolean } from '@uifabric/react-hooks';
import { GET_SINGLE_PROPERTY, GET_NAV_STATE, GET_DISTINCT_SUBURBS, GET_DISTINCT_REGIONS, UPDATE_IMAGES } from "../gql/gql"
import { useMutation, useQuery } from '@apollo/client';
import { Mutation, MutationUpdatePropertyArgs, Query, NavigationState, Premises, Landlord } from "../schematypes/schematypes"
import { navigationState as navigationStateVar } from "../reactivevariables/reactivevariables"
import { Icon } from '@fluentui/react/lib/Icon';

import LandlordListItem from "./LandlordListItem"




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
    showManageLandlordsPanel: boolean
    landLordsList: Landlord[]

}

const ManageLandlordsPanel: React.FunctionComponent<Props> = ({showManageLandlordsPanel, landLordsList}) => {

   console.log(landLordsList)

    

    

    const handlePanelDismiss = () => {
        navigationStateVar({ ...navigationStateVar(), showManageLandlordsPanel: false })
       
    }

    



   

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
        root: { zIndex: 60000 },
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

    

    

   

    const onRenderNavigationContent: IRenderFunction<IPanelProps> = React.useCallback(
        (props, defaultRender) => (
            <>
                <IconButton
                    styles={deleteIconStyles}
                    iconProps={cancelIcon}
                    ariaLabel="Close panel"
                    onClick={handlePanelDismiss}
                />
               {/*  <IconButton
                    styles={editIconStyles}
                    iconProps={editIcon}
                    ariaLabel="Edit Property Details"
                    onClick={handleEditProperty}
                /> */}



            </>
        ),
        [],
    );

    






    

    

    const [expanded, setExpanded] = React.useState<false | number>(0);


    

    return (
        <div>
            <Panel
                isOpen={showManageLandlordsPanel}
                onDismiss={handlePanelDismiss}
                type={PanelType.extraLarge}
                onRenderNavigationContent={onRenderNavigationContent}
                /* customWidth={panelType === PanelType.custom || panelType === PanelType.customNear ? '888px' : undefined} */
                closeButtonAriaLabel="Close"
                headerText={"Manage Landlords"}
                styles={panelStyles}
                layerProps={layerProps}
            >

                <Stack id="Landlord List Container" styles={{
                    root: {
                        display: "flex",
                        flexFlow: "column",
                        /* maxWidth: "fit-content" */
                        /*  marginTop: "0 !important" */
                    }
                }}>

                  {landLordsList !== undefined ? landLordsList.map((landlord)=> {

return <LandlordListItem landlord={landlord} key={landlord.landlordId} expanded={expanded} setExpanded={setExpanded}></LandlordListItem>

                  }): <Text></Text>}



                



                </Stack>

                


            </Panel>


        </div>
    );
};

export default ManageLandlordsPanel

