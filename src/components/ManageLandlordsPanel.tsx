import * as React from 'react';
import { CommandBarButton, IButtonStyles, ILayerStyleProps, ILayerStyles, ILayerProps, FocusTrapCallout, FocusZone, PrimaryButton, TextField, ITextFieldStyles } from 'office-ui-fabric-react';
import { Panel, PanelType, IPanelProps, IPanelStyles, IPanelStyleProps, } from 'office-ui-fabric-react/lib/Panel';
import { IRenderFunction, IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { useBoolean } from '@uifabric/react-hooks';
import { GET_SINGLE_PROPERTY, GET_NAV_STATE, GET_DISTINCT_SUBURBS, GET_DISTINCT_REGIONS, UPDATE_IMAGES, NEW_LANDLORD, GET_LANDLORDS } from "../gql/gql"
import { useMutation, useQuery } from '@apollo/client';
import { Mutation, MutationPostLandlordArgs, Query, NavigationState, Premises, Landlord } from "../schematypes/schematypes"
import { navigationState as navigationStateVar } from "../reactivevariables/reactivevariables"
import { Icon } from '@fluentui/react/lib/Icon';

import LandlordListItem from "./LandlordListItem"

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
  showManageLandlordsPanel: boolean
  landLordsList: Landlord[]

}

const ManageLandlordsPanel: React.FunctionComponent<Props> = ({ showManageLandlordsPanel, landLordsList }) => {



  const [isAddCalloutVisible, { toggle: toggleIsAddCalloutVisible }] = useBoolean(false);

  const [addLandlordName, setAddLandlordName] = React.useState("")



  const handlePanelDismiss = () => {
    navigationStateVar({ ...navigationStateVar(), showManageLandlordsPanel: false })

  }


  const [postLandlord, { data }] = useMutation<Mutation, MutationPostLandlordArgs>(NEW_LANDLORD);

  const saveNewLandlord = () => {

    postLandlord({
      variables: {

        landlordName: addLandlordName

      },

      update(cache, { data }) {

        if (!data) {
          return null;
        }

        const getExistingLandlords = cache.readQuery<Query>({ query: GET_LANDLORDS });
        // Add the new todo to the cache
        const existingLandlords = getExistingLandlords ? getExistingLandlords.landlords : [];
        const newLandlord = data.postLandlord!/* .returning[0] */;
        if (existingLandlords)
          cache.writeQuery<Query>({
            query: GET_LANDLORDS,
            data: { landlords: [newLandlord, ...existingLandlords] }
          });
      }


    })

    setAddLandlordName("")
    toggleIsAddCalloutVisible()
  }



  const onChangeLandlordName = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setAddLandlordName(newValue!);
    },
    [addLandlordName],
  );





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

  const [landlordSearch, setLandlordSearch] = React.useState<string | undefined> ("")


  const onChangeLandlordSearch = React.useCallback(
    (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {

    setLandlordSearch(newValue)
  },[setLandlordSearch])

  console.log(landLordsList)
  console.log(landlordSearch)

  const searchSortedlandlords = landLordsList?.filter(landlord => {
    if (landlord !== null && landlord !== undefined) {
      if (landlord?.landlordName !== null && landlord?.landlordName !== undefined) {
        if (landlord?.contactsList !== null && landlord?.contactsList !== undefined) {

         /*  let item = landlord.contactsList.some((contact)=>  contact.name!.includes(landlordSearch!.toLowerCase()))
          return item */
          
              return landlord?.landlordName.toLowerCase().includes(landlordSearch!.toLowerCase()) /* || landlord?.contactsList.filter((contact)=> { return contact.name?.toLowerCase().includes(landlordSearch!.toLowerCase())} ) */
           
        }
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
          styles={addIconStyles}
          iconProps={addIcon}
          ariaLabel="Add Landlord"
          onClick={toggleIsAddCalloutVisible}
          id="addLandlordButton"
        />




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

        type={PanelType.medium}
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

          {searchSortedlandlords !== undefined ? searchSortedlandlords.map((landlord) => {

            return <LandlordListItem landlord={landlord} key={landlord.landlordId} expanded={expanded} setExpanded={setExpanded}></LandlordListItem>

          }) : <Text></Text>}







        </Stack>


        {isAddCalloutVisible ? (
          <div>
            <FocusTrapCallout
              role="alertdialog"
              className={styles.callout}
              gapSpace={0}
              target={`#addLandlordButton`}
              onDismiss={toggleIsAddCalloutVisible}
              setInitialFocus
            >
              <div className={styles.header}>
                <Text className={styles.title}>Add Landlord</Text>
              </div>
              <div className={styles.inner}>
                <div>

                  <TextField
                    styles={textFieldStyles}
                    label="Landlord Name"

                    value={addLandlordName}
                    onChange={onChangeLandlordName}></TextField>
                </div>
              </div>
              <FocusZone>
                <Stack className={styles.buttons} gap={8} horizontal>
                  <PrimaryButton onClick={saveNewLandlord}>Confirm</PrimaryButton>
                  <DefaultButton onClick={toggleIsAddCalloutVisible}>Cancel</DefaultButton>
                </Stack>
              </FocusZone>
            </FocusTrapCallout>
          </div>
        ) : null}

      </Panel>




    </div>
  );
};

export default ManageLandlordsPanel

