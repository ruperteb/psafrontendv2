import * as React from 'react';
import { getTheme } from '@fluentui/react';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { Query, Property, Mutation, MutationDeletePropertyArgs, Landlord } from "../schematypes/schematypes"
import { GET_SELECTED_PROPERTIES, GET_PROPERTIES, DELETE_PROPERTY } from "../gql/gql"
import { gql, useMutation, useQuery } from '@apollo/client';
import { selectedPropertyList } from "../reactivevariables/reactivevariables"
import { mergeStyles, registerIcons } from 'office-ui-fabric-react/lib/Styling';
import { CommandBarButton, IContextualMenuProps, Stack, Text, FontWeights, IconButton, IIconProps, IStackStyles, initializeIcons, DefaultButton, FocusTrapCallout, FocusZone, PrimaryButton, mergeStyleSets, TextField, ITextFieldStyles } from 'office-ui-fabric-react';
import { useBoolean } from '@uifabric/react-hooks';
import { IndustrialIcon, RetailIcon, OfficeIcon, MixedUseIcon } from "../assets/svgIcons.js"
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { navigationState } from "../reactivevariables/reactivevariables"
import "./PropertyListItem.css"

import { motion, AnimatePresence } from "framer-motion";

import ContactListItem from "./ContactListItem"


interface Props {
  landlord: Landlord
  key: any
  expanded: number | false
  setExpanded: React.Dispatch<React.SetStateAction<number | false>>
}

export const LandlordListItem: React.FunctionComponent<Props> = ({ landlord, expanded, setExpanded, key }) => {

  var isOpen = false

  if (expanded === landlord.landlordId) {
    isOpen = true
  }


  const [isDeleteCalloutVisible, { toggle: toggleIsDeleteCalloutVisible }] = useBoolean(false);
  const [isEditCalloutVisible, { toggle: toggleIsEditCalloutVisible }] = useBoolean(false);
  const [isAddContactCalloutVisible, { toggle: toggleIsAddContactCalloutVisible }] = useBoolean(false);

  const [editLandlordName, setEditLandlordName] = React.useState("")

  const [addContact, setAddContact] = React.useState({
    name: "",
    email: "",
    mobileNo: "",
    officeNo: ""
  })

  console.log(expanded)



  const handleExpand = (landlordId: number) => {
    if (isOpen === false) {
      setExpanded(landlordId)
    } else { setExpanded(false) }



  }






  /* const [deleteProperty, { data: deletePropertyData }] = useMutation<Mutation, MutationDeletePropertyArgs>(DELETE_PROPERTY);

  const deletePropertyButton = () => {

    deleteProperty({
      variables: {
        propertyId: property.propertyId
      },
      update(cache, { data }) {

        if (!data) {
          return null;
        }

        const getExistingProperties = cache.readQuery<Query>({ query: GET_PROPERTIES });
        
        const existingProperties = getExistingProperties ? getExistingProperties.properties : [];
        const newProperties = existingProperties!.filter(t => {
          if (t)
            return (t.propertyId !== property.propertyId)
        });  
        if (existingProperties)
          cache.writeQuery<Query>({
            query: GET_PROPERTIES,
            data: { properties: newProperties }
          });
      }

    })

  } */






  const styles = mergeStyleSets({

    callout: {
      maxWidth: 400,
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






  const chevronClass = mergeStyles({
    alignSelf: 'center',
    marginLeft: 2,
    /*  marginRight: 5, */
    marginTop: "0 !important",
    /* color: palette.neutralTertiary, */
    fontSize: 20,
    flexShrink: 0,
    cursor: "pointer",
    /* selectors: {
      '&:hover': { "transition": "all .2s ease-in-out", transform: "scale(1.1)" },
    }, */

  });

  const iconClass = mergeStyles({
    fontSize: 50,
    height: 50,
    width: 50,


    marginLeft: 15,
    marginRight: 15,
    marginTop: "-10px !important",
    padding: "5px",



  });

  const chevronIconDiv = mergeStyles({
    /* fontSize: 50, */
    height: 40,
    width: 40,
    lineHeight: 40,
    textAlign: "center",
    marginLeft: 15,
    marginRight: 15,
    marginTop: "0px !important",
    /* padding: "5px", */
    selectors: {
      '&:hover': { backgroundColor: "rgb(0 13 255 / 14%)", borderRadius: 30, "transition": "all .2s ease-in-out", transform: "scale(1.2)" },
    },

  });

  const chevronDiv = mergeStyles({

    marginTop: "0px !important",


  });

  const boldStyle = { root: { fontWeight: FontWeights.semibold } };
  const propertyHeadingStyles = { alignSelf: "start", fontSize: "23px", padding: 5, paddingLeft: "25px" }
  const propertyAddressStyles = { alignSelf: "start", fontSize: "14px", padding: 5, paddingLeft: "25px" }
  const theme = getTheme();
  const iconButtonEditStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: "5px !important",
      marginTop: '0px !important',
      marginRight: 5,
      width: 40,
      height: 40,
      /* visibility: isChecked() ? "visible" : "hidden", */

    },
    rootHovered: {
      color: theme.palette.neutralDark,
      backgroundColor: "rgb(255 0 0 / 14%)",
      borderRadius: 30,
      "transition": "all .2s ease-in-out", transform: "scale(1.2)"

    },
    icon: {
      fontSize: "24px",
      marginLeft: 6

    }
  };
  const iconButtonDeleteStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: "auto",
      marginTop: '0px !important',
      marginRight: 5,
      width: 40,
      height: 40,
      /* visibility: isChecked() ? "visible" : "hidden", */

    },
    rootHovered: {
      color: theme.palette.neutralDark,
      backgroundColor: "rgb(255 0 0 / 14%)",
      borderRadius: 30,
      "transition": "all .2s ease-in-out", transform: "scale(1.2)"

    },
    icon: {
      fontSize: "24px",
      marginLeft: 6

    }
  };

  const deleteIcon: IIconProps = { iconName: 'Delete' };
  const editIcon: IIconProps = { iconName: 'Edit' };
  const addIcon: IIconProps = { iconName: 'Add' };


  const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };
  const textFieldContactStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 250 } };

  const onChangeLandlordName = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setEditLandlordName(newValue!);
    },
    [editLandlordName],
  );

  const onChangeContactName = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setAddContact({ ...addContact, name: newValue! });
    },
    [addContact],
  );

  const onChangeContactEmail = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setAddContact({ ...addContact, email: newValue! });
    },
    [addContact],
  );

  const onChangeContactMobileNo = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setAddContact({ ...addContact, mobileNo: newValue! });
    },
    [addContact],
  );

  const onChangeContactOfficeNo = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setAddContact({ ...addContact, officeNo: newValue! });
    },
    [addContact],
  );

  return (

    <Stack styles={{ root: { marginTop: 20 } }} verticalFill>

      <Stack
        horizontalAlign="start"
        verticalAlign="start"
        id="card"

        styles={{
          root: {
            width: 580,
            marginBottom: 10,
            marginTop: 10,
            padding: '10px',
            textAlign: 'center',
            color: '#605e5c',
            alignItems: "center",
            display: "flex",
            flexFlow: "row",
            /*  borderTop: "4px solid #2557a2;",
             borderBottom: "4px solid #2557a2;", */
            backgroundColor: "white",
            background: /* isChecked() ? "rgb(104 113 140 / 14%)" : */ "white",
            boxShadow: "-1px 1px 7px 2px #d4cece",
            selectors: {
              '&:hover': { background: /* palette.neutralLight */  "rgb(104 113 140 / 14%)" },
            },

          }
        }}
        gap={15}>





        <Stack styles={{ root: { paddingTop: 0, marginTop: "0 !important", marginBottom: "auto" } }} verticalFill>
          <Text styles={boldStyle} style={propertyHeadingStyles}>{landlord.landlordName}</Text>



        </Stack>
        <IconButton
          styles={iconButtonDeleteStyles}
          id={`deleteButton${landlord.landlordId}`}
          iconProps={deleteIcon}
          ariaLabel="Delete Landlord"
          onClick={toggleIsDeleteCalloutVisible}
        />
        {isDeleteCalloutVisible ? (
          <div>
            <FocusTrapCallout
              role="alertdialog"
              className={styles.callout}
              gapSpace={0}
              target={`#deleteButton${landlord.landlordId}`}
              onDismiss={toggleIsDeleteCalloutVisible}
              setInitialFocus
            >
              <div className={styles.header}>
                <Text className={styles.title}>Delete Landlord</Text>
              </div>
              <div className={styles.inner}>
                <div>
                  <Text className={styles.subtext}>
                    Are you sure you want to delete this landlord?
                </Text>
                </div>
              </div>
              <FocusZone>
                <Stack className={styles.buttons} gap={8} horizontal>
                  <PrimaryButton /* onClick={deletePropertyButton} */>Confirm</PrimaryButton>
                  <DefaultButton onClick={toggleIsDeleteCalloutVisible}>Cancel</DefaultButton>
                </Stack>
              </FocusZone>
            </FocusTrapCallout>
          </div>
        ) : null}
        <IconButton
          styles={iconButtonEditStyles}
          id={`editButton${landlord.landlordId}`}
          iconProps={editIcon}
          ariaLabel="Edit Landlord"
          onClick={toggleIsEditCalloutVisible}
        />
        {isEditCalloutVisible ? (
          <div>
            <FocusTrapCallout
              role="alertdialog"
              className={styles.callout}
              gapSpace={0}
              target={`#editButton${landlord.landlordId}`}
              onDismiss={toggleIsEditCalloutVisible}
              setInitialFocus
            >
              <div className={styles.header}>
                <Text className={styles.title}>Edit Landlord</Text>
              </div>
              <div className={styles.inner}>
                <div>

                  <TextField
                    styles={textFieldStyles}
                    label="Landlord Name"

                    value={editLandlordName}
                    onChange={onChangeLandlordName}></TextField>
                </div>
              </div>
              <FocusZone>
                <Stack className={styles.buttons} gap={8} horizontal>
                  <PrimaryButton /* onClick={deletePropertyButton} */>Confirm</PrimaryButton>
                  <DefaultButton onClick={toggleIsEditCalloutVisible}>Cancel</DefaultButton>
                </Stack>
              </FocusZone>
            </FocusTrapCallout>
          </div>
        ) : null}

        <IconButton
          styles={iconButtonEditStyles}
          id={`addButton${landlord.landlordId}`}
          iconProps={addIcon}
          ariaLabel="Add Contact"
          onClick={toggleIsAddContactCalloutVisible}
        />
        {isAddContactCalloutVisible ? (
          <div>
            <FocusTrapCallout
              role="alertdialog"
              className={styles.callout}
              gapSpace={0}
              target={`#addButton${landlord.landlordId}`}
              onDismiss={toggleIsAddContactCalloutVisible}
              setInitialFocus
            >
              <div className={styles.header}>
                <Text className={styles.title}>Add Contact</Text>
              </div>
              <div className={styles.inner}>
                <div>

                  <TextField
                    styles={textFieldContactStyles}
                    label="Name"
                    value={addContact.name}
                    onChange={onChangeContactName}>
                  </TextField>
                  <TextField
                    styles={textFieldContactStyles}
                    label="Email"
                    value={addContact.email}
                    onChange={onChangeContactEmail}>
                  </TextField>
                  <TextField
                    styles={textFieldContactStyles}
                    label="Mobile No"
                    value={addContact.mobileNo}
                    onChange={onChangeContactMobileNo}>
                  </TextField>
                  <TextField
                    styles={textFieldContactStyles}
                    label="Office No"
                    value={addContact.officeNo}
                    onChange={onChangeContactOfficeNo}>
                  </TextField>
                </div>
              </div>
              <FocusZone>
                <Stack className={styles.buttons} gap={8} horizontal>
                  <PrimaryButton /* onClick={deletePropertyButton} */>Confirm</PrimaryButton>
                  <DefaultButton onClick={toggleIsAddContactCalloutVisible}>Cancel</DefaultButton>
                </Stack>
              </FocusZone>
            </FocusTrapCallout>
          </div>
        ) : null}

        <motion.section
          className={chevronDiv}
          /*  key="chevron"
           initial="collapsed" */
          animate={isOpen ? "open" : "collapsed"}
          /*  exit="collapsed" */
          variants={{
            open: { transform: "rotate(270deg)" },
            collapsed: { transform: "rotate(90deg)" }
          }}
          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
        >

          <div className={chevronIconDiv} onClick={() => handleExpand(landlord.landlordId)}><Icon className={chevronClass} iconName={'ChevronRight'} /></div>

        </motion.section>




      </Stack>


      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <Stack horizontal styles={{
              root: {
                width: 580,
                display: "flex",
                flexFlow: "row wrap"

              }
            }} >

              {landlord.contactsList?.map((contact) => {
                return <ContactListItem contact={contact} key={contact.contactId}></ContactListItem>

              })}

            </Stack>
          </motion.section>
        )}
      </AnimatePresence>

    </Stack>



  );
};

export default LandlordListItem