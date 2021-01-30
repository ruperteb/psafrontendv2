import * as React from 'react';
import { getTheme } from '@fluentui/react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { Query, Property, Mutation, MutationDeleteLandlordContactArgs, MutationUpdateLandlordContactArgs, LandlordContact } from "../schematypes/schematypes"
import { GET_SELECTED_PROPERTIES, GET_PROPERTIES, DELETE_PROPERTY, DELETE_LANDLORD_CONTACT, UPDATE_LANDLORD_CONTACT, GET_LANDLORDS } from "../gql/gql"
import { gql, useMutation, useQuery } from '@apollo/client';
import { selectedPropertyList } from "../reactivevariables/reactivevariables"
import { mergeStyles, registerIcons } from 'office-ui-fabric-react/lib/Styling';
import { CommandBarButton, IContextualMenuProps, Stack, Text, FontWeights, IconButton, IIconProps, IStackStyles, initializeIcons, DefaultButton, FocusTrapCallout, FocusZone, PrimaryButton, mergeStyleSets, ITextFieldStyles, DirectionalHint } from 'office-ui-fabric-react';
import { useBoolean } from '@uifabric/react-hooks';
import { IndustrialIcon, RetailIcon, OfficeIcon, MixedUseIcon } from "../assets/svgIcons.js"
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { navigationState } from "../reactivevariables/reactivevariables"
import "./PropertyListItem.css"

import { motion, AnimatePresence } from "framer-motion";


interface Props {
  contact: LandlordContact
  key: any
  landlordId: number

}

export const ContactListItem: React.FunctionComponent<Props> = ({ contact, landlordId }) => {




  const [isDeleteCalloutVisible, { toggle: toggleIsDeleteCalloutVisible }] = useBoolean(false);

  const [isEditContactCalloutVisible, { toggle: toggleIsEditContactCalloutVisible }] = useBoolean(false);

  const [editContact, setEditContact] = React.useState({
    name: contact?.name,
    email: contact?.email,
    mobileNo: contact?.mobileNo,
    officeNo: contact?.officeNo,
  })



  const [deleteLandlordContact, { data: deleteLandlordContactData }] = useMutation<Mutation, MutationDeleteLandlordContactArgs>(DELETE_LANDLORD_CONTACT);

  const deleteLandlordContactButton = () => {

    deleteLandlordContact({
      variables: {
        contactId: contact.contactId
      },
      update(cache, { data }) {

        if (!data) {
            return null;
        }

        const getExistingLandlords = cache.readQuery<Query>({ query: GET_LANDLORDS });
        // Add the new todo to the cache
        const existingLandlords = getExistingLandlords ? getExistingLandlords.landlords : [];
        const selectedLandlord = existingLandlords!.find(t => 
          t.landlordId === landlordId
        )
        const otherLandlords = existingLandlords!.filter (t => {
          return t.landlordId !== landlordId
        })
        const existingContacts = selectedLandlord?.contactsList
        const newContacts = existingContacts!.filter (t => {
          return t.contactId !== contact.contactId
        })
       const updatedLandlord = {landlordId: selectedLandlord!.landlordId, landlordName: selectedLandlord!.landlordName , contactsList: [...newContacts ]}
        if (existingLandlords)
            cache.writeQuery<Query>({
                query: GET_LANDLORDS,
                data: { landlords: [updatedLandlord!, ...otherLandlords] }
            });
    }

    })
    toggleIsDeleteCalloutVisible()
  }

  const [updateLandlordContact, { data: updateLandlordData }] = useMutation<Mutation, MutationUpdateLandlordContactArgs>(UPDATE_LANDLORD_CONTACT);

  const updateLandlordContactButton = () => {

      updateLandlordContact({
        variables: {
          contactId: contact.contactId,
          name: editContact.name,
          email: editContact.email,
          mobileNo: editContact.mobileNo,
          officeNo: editContact.officeNo,
        },

        update(cache, { data }) {

          if (!data) {
              return null;
          }
  
          const getExistingLandlords = cache.readQuery<Query>({ query: GET_LANDLORDS });
          // Add the new todo to the cache
          const existingLandlords = getExistingLandlords ? getExistingLandlords.landlords : [];
          const selectedLandlord = existingLandlords!.find(t => 
            t.landlordId === landlordId
          )
          const otherLandlords = existingLandlords!.filter (t => {
            return t.landlordId !== landlordId
          })
          const existingContacts = selectedLandlord?.contactsList
          const otherContacts = existingContacts!.filter (t => {
            return t.contactId !== contact.contactId
          })
          const newContact = data.updateLandlordContact
         const updatedLandlord = {landlordId: selectedLandlord!.landlordId, landlordName: selectedLandlord!.landlordName , contactsList: [...otherContacts, newContact ]}
          if (existingLandlords)
              cache.writeQuery<Query>({
                  query: GET_LANDLORDS,
                  data: { landlords: [updatedLandlord!, ...otherLandlords] }
              });
      }

    })
    setEditContact(
      {name: "",
    email: "",
    mobileNo: "",
    officeNo: ""}
    )
    toggleIsEditContactCalloutVisible()
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
    /*  buttonArea: {
       verticalAlign: 'top',
       display: 'inline-block',
       textAlign: 'center',
       margin: '0 100px',
       minWidth: 130,
       height: 32,
     }, */
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

  const boldStyle = { root: { fontWeight: FontWeights.semibold } };
  const propertyHeadingStyles = { alignSelf: "start", fontSize: "23px", padding: 5 }
  const contactDetailsStyles = { alignSelf: "start", fontSize: "14px", padding: 5, width: "100%", display: "flex", }
  const theme = getTheme();
  const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: "auto",
      marginTop: '0px !important',
      marginBottom:0,
      marginRight: 5,
      width: 30,
      height: 30,
      /* visibility: isChecked() ? "visible" : "hidden", */

    },
    rootHovered: {
      color: theme.palette.neutralDark,
      backgroundColor: "rgb(255 0 0 / 14%)",
      borderRadius: 30,
      "transition": "all .2s ease-in-out", transform: "scale(1.2)"

    },
    icon: {
      fontSize: "18px",
      marginLeft: 6

    }
  };

  const contactIconClass = mergeStyles({
    transform: "translateY(2px)",
    marginRight: 15,
    fontSize: "medium"

});

  const deleteIcon: IIconProps = { iconName: 'Delete' };
  const editIcon: IIconProps = { iconName: 'Edit' };

  const textFieldContactStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 250 } };


  const onChangeContactName = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setEditContact({ ...editContact, name: newValue! });
    },
    [editContact],
  );

  const onChangeContactEmail = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setEditContact({ ...editContact, email: newValue! });
    },
    [editContact],
  );

  const onChangeContactMobileNo = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setEditContact({ ...editContact, mobileNo: newValue! });
    },
    [editContact],
  );

  const onChangeContactOfficeNo = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setEditContact({ ...editContact, officeNo: newValue! });
    },
    [editContact],
  );

  return (



    <Stack
      horizontalAlign="start"
      verticalAlign="start"
      id="card"
verticalFill
      styles={{
        root: {
          width: "47%",
          marginBottom: 10,
          marginLeft: "auto !important",
          marginRight: "auto",
          marginTop: 10,
          padding: '10px',
          textAlign: 'center',
          color: '#605e5c',
         /*  alignItems: "center", */
          display: "flex",
         /*  flexFlow: "row", */
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



     

      <Stack styles={{ root: { paddingTop: 0, marginTop: "0 !important", marginBottom: "auto", width: "100%" } }} verticalFill>
        <Text block={true} nowrap={true} style={contactDetailsStyles}><Icon className={contactIconClass} iconName="Contact" /> {contact.name}</Text>
        <Text block={true} nowrap={true} style={contactDetailsStyles}><Icon className={contactIconClass} iconName="Mail" />{contact.email!.length <26? contact.email: `${contact.email?.slice(0,25)}...` }</Text>
        <Text  style={contactDetailsStyles}><Icon className={contactIconClass} iconName="Phone" />{contact.officeNo}</Text>
        <Text  style={contactDetailsStyles}> <Icon className={contactIconClass} iconName="CellPhone" />{contact.mobileNo}</Text>



      </Stack>

      <Stack styles={{root:{marginRight:5, marginLeft: "auto !important", marginTop:"-30px !important"}}} horizontal>

      <IconButton
        styles={iconButtonStyles}
        id={`contactDeleteButton${contact.contactId}`}
        iconProps={deleteIcon}
        ariaLabel="Delete Contact"
        onClick={toggleIsDeleteCalloutVisible}
      />
      {isDeleteCalloutVisible ? (
        <div>
          <FocusTrapCallout
            role="alertdialog"
            className={styles.callout}
            gapSpace={0}
            target={`#contactDeleteButton${contact.contactId}`}
            onDismiss={toggleIsDeleteCalloutVisible}
            setInitialFocus
          >
            <div className={styles.header}>
              <Text className={styles.title}>Delete Contact</Text>
            </div>
            <div className={styles.inner}>
              <div>
                <Text className={styles.subtext}>
                  Are you sure you want to delete this contact?
                </Text>
              </div>
            </div>
            <FocusZone>
              <Stack className={styles.buttons} gap={8} horizontal>
                <PrimaryButton onClick={deleteLandlordContactButton}>Confirm</PrimaryButton>
                <DefaultButton onClick={toggleIsDeleteCalloutVisible}>Cancel</DefaultButton>
              </Stack>
            </FocusZone>
          </FocusTrapCallout>
        </div>
      ) : null}

      <IconButton
        styles={iconButtonStyles}
        id={`editContactButton${contact.contactId}`}
        iconProps={editIcon}
        ariaLabel="Edit Contact"
        onClick={toggleIsEditContactCalloutVisible}
      />
      {isEditContactCalloutVisible ? (
          <div>
            <FocusTrapCallout
              role="alertdialog"
              className={styles.callout}
              gapSpace={0}
              target={`#editContactButton${contact.contactId}`}
              onDismiss={toggleIsEditContactCalloutVisible}
              setInitialFocus
              directionalHint={DirectionalHint.bottomCenter}
            >
              <div className={styles.header}>
                <Text className={styles.title}>Edit Contact</Text>
              </div>
              <div className={styles.inner}>
                <div>

                  <TextField
                    styles={textFieldContactStyles}
                    label="Name"
                    value={editContact.name}
                    onChange={onChangeContactName}>
                  </TextField>
                  <TextField
                    styles={textFieldContactStyles}
                    label="Email"
                    value={editContact.email}
                    onChange={onChangeContactEmail}>
                  </TextField>
                  <TextField
                    styles={textFieldContactStyles}
                    label="Mobile No"
                    value={editContact.mobileNo}
                    onChange={onChangeContactMobileNo}>
                  </TextField>
                  <TextField
                    styles={textFieldContactStyles}
                    label="Office No"
                    value={editContact.officeNo}
                    onChange={onChangeContactOfficeNo}>
                  </TextField>
                </div>
              </div>
              <FocusZone>
                <Stack className={styles.buttons} gap={8} horizontal>
                  <PrimaryButton onClick={updateLandlordContactButton}>Confirm</PrimaryButton>
                  <DefaultButton onClick={toggleIsEditContactCalloutVisible}>Cancel</DefaultButton>
                </Stack>
              </FocusZone>
            </FocusTrapCallout>
          </div>
        ) : null}


      </Stack>
      


    </Stack>








  );
};

export default ContactListItem