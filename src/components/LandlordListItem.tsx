import * as React from 'react';
import { getTheme } from '@fluentui/react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Query, Mutation, MutationDeleteLandlordArgs, MutationUpdateLandlordArgs, MutationPostLandlordContactArgs, Landlord } from "../schematypes/schematypes"
import { DELETE_LANDLORD, GET_LANDLORDS, UPDATE_LANDLORD, NEW_LANDLORD_CONTACT } from "../gql/gql"
import { useMutation, } from '@apollo/client';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import {IContextualMenuProps, Stack, Text, FontWeights, IconButton, IIconProps, DefaultButton, FocusTrapCallout, FocusZone, PrimaryButton, mergeStyleSets, TextField, ITextFieldStyles } from 'office-ui-fabric-react';
import { useBoolean } from '@uifabric/react-hooks';
import { motion, AnimatePresence } from "framer-motion";
import ContactListItem from "./ContactListItem"


interface Props {
  landlord: Landlord
  key: any
  expanded: number | false
  setExpanded: React.Dispatch<React.SetStateAction<number | false>>
}

export const LandlordListItem: React.FunctionComponent<Props> = ({ landlord, expanded, setExpanded }) => {

  const [isOpen, setIsOpen] = React.useState(false)



  React.useEffect(() => {

    if (expanded === landlord.landlordId) {
      setIsOpen(true)
    } else { setIsOpen(false) }

  }, [expanded, landlord.landlordId])

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

  const handleExpand = (landlordId: number) => {
    if (isOpen === false) {
      setExpanded(landlordId)
    } else { setExpanded(false) }



  }

  const [deleteLandlord, { data: deleteLandlordData }] = useMutation<Mutation, MutationDeleteLandlordArgs>(DELETE_LANDLORD);

  const deleteLandlordButton = () => {

    deleteLandlord({
      variables: {
        landlordId: landlord.landlordId
      },
      update(cache, { data }) {

        if (!data) {
          return null;
        }

        const getExistingLandlords = cache.readQuery<Query>({ query: GET_LANDLORDS });

        const existingLandlords = getExistingLandlords ? getExistingLandlords.landlords : [];
        const newLandlords = existingLandlords!.filter(t => {

          return (t.landlordId !== landlord.landlordId)
        });
        if (existingLandlords)
          cache.writeQuery<Query>({
            query: GET_LANDLORDS,
            data: { landlords: newLandlords }
          });
      }

    })
    toggleIsDeleteCalloutVisible()
  }

  const [updateLandlord, { data: updateLandlordData }] = useMutation<Mutation, MutationUpdateLandlordArgs>(UPDATE_LANDLORD);

  const updateLandlordButton = () => {

    updateLandlord({
      variables: {
        landlordId: landlord.landlordId,
        landlordName: editLandlordName

      },

      update(cache, { data }) {

        if (!data) {
          return null;
        }

        const getExistingLandlords = cache.readQuery<Query>({ query: GET_LANDLORDS });

        const existingLandlords = getExistingLandlords ? getExistingLandlords.landlords : [];
        const updatedLandlord = data.updateLandlord!/* .returning[0] */;
        const otherLandlords = existingLandlords!.filter(t => {
          return t.landlordId !== landlord.landlordId
        })
        if (existingLandlords)
          cache.writeQuery<Query>({
            query: GET_LANDLORDS,
            data: { landlords: [updatedLandlord, ...otherLandlords] }
          });
      }

    })
    setEditLandlordName("")
    toggleIsEditCalloutVisible()
  }

  const [postContact, { data }] = useMutation<Mutation, MutationPostLandlordContactArgs>(NEW_LANDLORD_CONTACT);

  const saveNewContactButton = () => {

    postContact({
      variables: {
        landlordId: landlord.landlordId,
        name: addContact.name,
        email: addContact.email,
        mobileNo: addContact.mobileNo,
        officeNo: addContact.officeNo,

      },

      update(cache, { data }) {

        if (!data) {
          return null;
        }

        const getExistingLandlords = cache.readQuery<Query>({ query: GET_LANDLORDS });
        // Add the new todo to the cache
        const existingLandlords = getExistingLandlords ? getExistingLandlords.landlords : [];
        const selectedLandlord = existingLandlords!.find(t =>
          t.landlordId === landlord.landlordId
        )
        const otherLandlords = existingLandlords!.filter(t => {
          return t.landlordId !== landlord.landlordId
        })
        const existingContacts = selectedLandlord?.contactsList
        const newContact = data.postLandlordContact!/* .returning[0] */;
        const updatedLandlord = { landlordId: selectedLandlord!.landlordId, landlordName: selectedLandlord!.landlordName, contactsList: [...existingContacts!, newContact] }
        if (existingLandlords)
          cache.writeQuery<Query>({
            query: GET_LANDLORDS,
            data: { landlords: [updatedLandlord!, ...otherLandlords] }
          });
      }


    })

    setAddContact({
      name: "",
      email: "",
      mobileNo: "",
      officeNo: ""
    })
    toggleIsAddContactCalloutVisible()
    setIsOpen(true)
  }




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

  

  const chevronIconDiv = mergeStyles({
    /* fontSize: 50, */
    height: 40,
    width: 40,
    lineHeight: 40,
    textAlign: "center",
    /* marginLeft: "auto !important",
    marginRight: 15, */
    marginTop: "0px !important",
    marginBottom: "0px !important",
    /* padding: "5px", */
    selectors: {
      '&:hover': { backgroundColor: "rgb(0 13 255 / 14%)", borderRadius: 30, "transition": "all .2s ease-in-out", transform: "scale(1.2)" },
    },

  });

  const chevronDiv = mergeStyles({

    marginTop: "0px !important",
    marginRight: 15,
    marginLeft: "auto !important",
  });

  const boldStyle = { root: { fontWeight: FontWeights.semibold } };
  const propertyHeadingStyles = { alignSelf: "start", fontSize: "23px", padding: 5, paddingLeft: "25px" }
  
  const theme = getTheme();
 
  

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'Delete Landlord',
        text: 'Delete Landlord',
        iconProps: { iconName: 'Delete' },
        onClick: toggleIsDeleteCalloutVisible
      },
      {
        key: 'Edit Landlord',
        text: 'Edit Landlord',
        iconProps: { iconName: 'Edit' },
        onClick: toggleIsEditCalloutVisible
      },
      {
        key: 'Add Contact',
        text: 'Add Contact',
        iconProps: { iconName: 'Add' },
        onClick: toggleIsAddContactCalloutVisible
      },
    ],
    directionalHintFixed: false,
    styles: {container: {width: 150}}
  };

  const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: 5,
      marginTop: '0px !important',
      marginRight: 5,
      width: 35,
      height: 35,
      /*  visibility: isChecked() ? "visible" : "hidden", */

    },
    rootHovered: {
      color: theme.palette.neutralDark,
      backgroundColor: "rgb(3 122 212 / 16%);",
      /* borderRadius: 30, */
      "transition": "all .2s ease-in-out", transform: "scale(1.1)"

    },
    icon: {
      fontSize: "24px",
      marginLeft: 6

    }
  };

  
  const menuIcon: IIconProps = { iconName: 'SingleColumnEdit' };

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



        <IconButton
          styles={iconButtonStyles}
          id={`comboButton${landlord.landlordId}`}
          menuProps={menuProps}
          iconProps={menuIcon}
          ariaLabel="Combo Button"
        />

        <Stack styles={{ root: { paddingTop: 0, marginTop: "0 !important", marginBottom: "auto" } }} verticalFill>
          <Text styles={boldStyle} style={propertyHeadingStyles}>{landlord.landlordName}</Text>



        </Stack>


        {isDeleteCalloutVisible ? (
          <div>
            <FocusTrapCallout
              role="alertdialog"
              className={styles.callout}
              gapSpace={0}
              target={`#comboButton${landlord.landlordId}`}
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
                  <PrimaryButton onClick={deleteLandlordButton}>Confirm</PrimaryButton>
                  <DefaultButton onClick={toggleIsDeleteCalloutVisible}>Cancel</DefaultButton>
                </Stack>
              </FocusZone>
            </FocusTrapCallout>
          </div>
        ) : null}
       
        {isEditCalloutVisible ? (
          <div>
            <FocusTrapCallout
              role="alertdialog"
              className={styles.callout}
              gapSpace={0}
              target={`#comboButton${landlord.landlordId}`}
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
                  <PrimaryButton onClick={updateLandlordButton}>Confirm</PrimaryButton>
                  <DefaultButton onClick={toggleIsEditCalloutVisible}>Cancel</DefaultButton>
                </Stack>
              </FocusZone>
            </FocusTrapCallout>
          </div>
        ) : null}

        {isAddContactCalloutVisible ? (
          <div>
            <FocusTrapCallout
              role="alertdialog"
              className={styles.callout}
              gapSpace={0}
              target={`#comboButton${landlord.landlordId}`}
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
                  <PrimaryButton onClick={saveNewContactButton}>Confirm</PrimaryButton>
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
                return <ContactListItem landlordId={landlord.landlordId} contact={contact} key={contact.contactId}></ContactListItem>

              })}

            </Stack>
          </motion.section>
        )}
      </AnimatePresence>

    </Stack>



  );
};

export default LandlordListItem