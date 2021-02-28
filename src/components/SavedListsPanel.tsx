import * as React from 'react';
import { CommandBarButton, IButtonStyles, ILayerStyleProps, ILayerStyles, ILayerProps, FocusTrapCallout, FocusZone, PrimaryButton, TextField, ITextFieldStyles } from 'office-ui-fabric-react';
import { Panel, PanelType, IPanelProps, IPanelStyles, IPanelStyleProps, } from 'office-ui-fabric-react/lib/Panel';
import { IRenderFunction, IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { useBoolean } from '@uifabric/react-hooks';
import { GET_SINGLE_PROPERTY, GET_NAV_STATE, GET_DISTINCT_SUBURBS, GET_DISTINCT_REGIONS, UPDATE_IMAGES, NEW_LANDLORD, GET_LANDLORDS } from "../gql/gql"
import { useMutation, useQuery } from '@apollo/client';
import { Mutation, MutationPostLandlordArgs, Query, NavigationState, Premises, Landlord, PropertyList, SelectedPropertyList } from "../schematypes/schematypes"
import { navigationState as navigationStateVar, selectedPropertyList as selectedPropertyListVar } from "../reactivevariables/reactivevariables"
import { Icon } from '@fluentui/react/lib/Icon';

import SavedListItem from "./SavedListItem"

import "./SavedListsPanel.css"

import { SearchBox, ISearchBoxStyles, } from 'office-ui-fabric-react/lib/SearchBox';

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
  showSavedListsPanel: boolean
  propertyLists: PropertyList[]
  propertyIdList: number[]
}

const SavedListsPanel: React.FunctionComponent<Props> = ({ showSavedListsPanel, propertyLists, propertyIdList }) => {


  const handlePanelDismiss = () => {
    navigationStateVar({ ...navigationStateVar(), showSavedListsPanel: false })

  }

  const handleClearSelectedProperties = () => {
    selectedPropertyListVar([])

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

  const addIconStyles = {
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
  const clearIcon: IIconProps = { iconName: 'RemoveFromShoppingList' };
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
    header: { marginBottom: 10 },
    headerText: { fontSize: 24, marginLeft: 15 },
    content: {
      paddingLeft: 12,
      paddingRight: 20,
      
    },
    /* scrollableContent: { overflowY: "hidden"} */

  }

  const layerStyles: IStyleFunctionOrObject<ILayerStyleProps, ILayerStyles> = {
    root: { zIndex: 100000 },
  }

  const layerProps: ILayerProps = {
    styles: layerStyles
  }


  const boldStyle = { root: { fontWeight: FontWeights.semibold } };
  const propertyDetailsStyles = { alignSelf: "start", fontSize: "18px", paddingLeft: "15px" }
  const propertyDetailsLandlordStyles = { alignSelf: "start", fontSize: "18px", paddingLeft: "15px", width: 125 }

  const boldStyle2 = { root: { fontWeight: FontWeights.bold } };
  const propertyDetailsHeadingStyles = { /* alignSelf: "start", */ fontSize: "20px", marginLeft: "auto", marginRight: "auto", marginTop: 10, marginBottom: 10 }
  const propertyNotesStyles = { alignSelf: "start", fontSize: "16px", paddingLeft: "15px", marginTop: 0 }

  const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };

  const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 300, height: 44 } };

  const styles = mergeStyleSets({

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

  const [propertyListSearch, setPropertyListSearch] = React.useState<string | undefined>("")


  const onChangeLandlordSearch = React.useCallback(
    (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {

      setPropertyListSearch(newValue)
    }, [setPropertyListSearch])


  console.log(propertyListSearch)

  const searchSortedPropertyLists = propertyLists?.filter(propertyList => {
    if (propertyList !== null && propertyList !== undefined) {
      if (propertyList?.enquiryName !== null && propertyList?.enquiryName !== undefined) {
        return propertyList?.enquiryName.toLowerCase().includes(propertyListSearch!.toLowerCase())
      }
    }
  })


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
          styles={clearIconStyles}
          iconProps={clearIcon}
          ariaLabel="Close panel"
          onClick={handleClearSelectedProperties}
        />

      </>
    ),
    [],
  );


  const [expanded, setExpanded] = React.useState<false | number>(0);




  return (
    <div>
      <Panel
        isOpen={showSavedListsPanel}
        onDismiss={handlePanelDismiss}
        isBlocking={false}
        type={PanelType.smallFixedFar}
        onRenderNavigationContent={onRenderNavigationContent}
        /* customWidth={panelType === PanelType.custom || panelType === PanelType.customNear ? '888px' : undefined} */
        closeButtonAriaLabel="Close"
        headerText={"Manage Saved Lists"}
        styles={panelStyles}
        layerProps={layerProps}
        className="savedListsPanel"
      >

        <Stack id="Property List Container" styles={{
          root: {
            display: "flex",
            flexFlow: "column",
            marginLeft: 10
            /* maxWidth: "fit-content" */
            /*  marginTop: "0 !important" */
          }
        }}>

          <SearchBox
            styles={searchBoxStyles}
            placeholder="Search"
            onEscape={ev => {
              console.log('Custom onEscape Called');
            }}
            onClear={ev => {
              console.log('Custom onClear Called');
            }}
            onChange={onChangeLandlordSearch}
            onSearch={newValue => console.log('SearchBox onSearch fired: ' + newValue)}
          />

          {searchSortedPropertyLists !== undefined ? searchSortedPropertyLists.map((propertyList) => {

            return <SavedListItem propertyList={propertyList} key={propertyList.propertyListId} expanded={expanded} setExpanded={setExpanded} propertyIdList={propertyIdList}></SavedListItem>

          }) : <Text></Text>}


        </Stack>
      </Panel>
    </div>
  );
};

export default SavedListsPanel

