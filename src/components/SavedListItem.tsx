import * as React from 'react';
import { getTheme } from '@fluentui/react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Query, Mutation, MutationDeletePropertyListArgs, MutationUpdatePropertyListArgs, MutationPostPropertyListArgs, PropertyList, SelectedPropertyList } from "../schematypes/schematypes"
import { DELETE_PROPERTY_LIST, GET_PROPERTY_LISTS, UPDATE_PROPERTY_LIST, NEW_PROPERTY_LIST } from "../gql/gql"
import { useMutation, } from '@apollo/client';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { IContextualMenuProps, Stack, Text, FontWeights, IconButton, IIconProps, DefaultButton, FocusTrapCallout, FocusZone, PrimaryButton, mergeStyleSets, TextField, ITextFieldStyles, Checkbox, ICheckboxProps, ICheckboxStyles } from 'office-ui-fabric-react';
import { useBoolean } from '@uifabric/react-hooks';
import { motion, AnimatePresence } from "framer-motion";
import ContactListItem from "./ContactListItem"

import { selectedPropertyList as selectedPropertyListVar, pdfVariables } from "../reactivevariables/reactivevariables"


interface Props {
  propertyList: PropertyList
  key: any
  expanded: number | false
  setExpanded: React.Dispatch<React.SetStateAction<number | false>>
  propertyIdList: number[]
}

export const SavedListItem: React.FunctionComponent<Props> = ({ propertyList, expanded, setExpanded, propertyIdList }) => {

 var sortedPropertyList = propertyList.properties?.slice().sort((a,b) => {return (a.propertyName < b.propertyName) ? -1 : (a.propertyName > b.propertyName) ? 1 : 0})

  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {

    if (expanded === propertyList.propertyListId) {
      setIsOpen(true)
    } else { setIsOpen(false) }

  }, [expanded, propertyList.propertyListId])

  const [isDeleteCalloutVisible, { toggle: toggleIsDeleteCalloutVisible }] = useBoolean(false);
  const [isEditCalloutVisible, { toggle: toggleIsEditCalloutVisible }] = useBoolean(false);
  /* const [isAddContactCalloutVisible, { toggle: toggleIsAddContactCalloutVisible }] = useBoolean(false); */

  console.log(propertyList)

  const [editPropertyList, setEditPropertyList] = React.useState<MutationUpdatePropertyListArgs>({
    propertyListId: propertyList.propertyListId,
    enquiryName: propertyList.enquiryName,
    customTitle: propertyList.customTitle,
    enquiryDate: propertyList.enquiryDate,
    propertyIdList: propertyList.properties?.map((property) => { return property.propertyId })
  })

  /* const [addContact, setAddContact] = React.useState({
    name: "",
    email: "",
    mobileNo: "",
    officeNo: ""
  }) */

  const handleExpand = (propertyListId: number) => {
    if (isOpen === false) {
      setExpanded(propertyListId)
    } else { setExpanded(false) }



  }

  const [deletePropertyList, { data: deletePropertyListData }] = useMutation<Mutation, MutationDeletePropertyListArgs>(DELETE_PROPERTY_LIST);

  const deletePropertyListButton = () => {

    deletePropertyList({
      variables: {
        propertyListId: propertyList.propertyListId
      },
      update(cache, { data }) {

        if (!data) {
          return null;
        }

        const getExistingPropertyLists = cache.readQuery<Query>({ query: GET_PROPERTY_LISTS });

        const existingPropertyLists = getExistingPropertyLists ? getExistingPropertyLists.propertyLists : [];
        const newPropertyLists = existingPropertyLists!.filter(t => {

          return (t.propertyListId !== propertyList.propertyListId)
        });
        if (existingPropertyLists)
          cache.writeQuery<Query>({
            query: GET_PROPERTY_LISTS,
            data: { propertyLists: newPropertyLists }
          });
      }

    })
    toggleIsDeleteCalloutVisible()
  }

  const [updatePropertyList, { data: updatePropertyListData }] = useMutation<Mutation, MutationUpdatePropertyListArgs>(UPDATE_PROPERTY_LIST);

  const updatePropertyListButton = () => {

    updatePropertyList({
      variables: {
        propertyListId: propertyList.propertyListId,
        enquiryName: editPropertyList.enquiryName,
        customTitle: editPropertyList.customTitle,
        enquiryDate: editPropertyList.enquiryDate,
        propertyIdList: editPropertyList.propertyIdList

      },

      update(cache, { data }) {

        if (!data) {
          return null;
        }

        const getExistingPropertyLists = cache.readQuery<Query>({ query: GET_PROPERTY_LISTS });

        const existingPropertyLists = getExistingPropertyLists ? getExistingPropertyLists.propertyLists : [];
        const updatedPropertyList = data.updatePropertyList!/* .returning[0] */;
        const otherPropertyLists = existingPropertyLists!.filter(t => {
          return t.propertyListId !== propertyList.propertyListId
        })
        if (existingPropertyLists)
          cache.writeQuery<Query>({
            query: GET_PROPERTY_LISTS,
            data: { propertyLists: [updatedPropertyList, ...otherPropertyLists] }
          });
      }

    })
    /* setEditLandlordName("") */
    toggleIsEditCalloutVisible()
  }

  /*  const [postContact, { data }] = useMutation<Mutation, MutationPostLandlordContactArgs>(NEW_LANDLORD_CONTACT);
 
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
         
         const existingLandlords = getExistingLandlords ? getExistingLandlords.landlords : [];
         const selectedLandlord = existingLandlords!.find(t =>
           t.landlordId === landlord.landlordId
         )
         const otherLandlords = existingLandlords!.filter(t => {
           return t.landlordId !== landlord.landlordId
         })
         const existingContacts = selectedLandlord?.contactsList
         const newContact = data.postLandlordContact!;
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
   } */




  const styles = mergeStyleSets({

    callout: {
      maxWidth: 300,
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
    marginLeft: "auto",
    marginRight: "auto",
    /*  marginRight: 5, */
    marginTop: "0 !important",
    /* color: palette.neutralTertiary, */
    fontSize: 16,
    flexShrink: 0,
    cursor: "pointer",
    /* selectors: {
      '&:hover': { "transition": "all .2s ease-in-out", transform: "scale(1.1)" },
    }, */

  });



  const chevronIconDiv = mergeStyles({
    /* fontSize: 50, */
    height: 30,
    width: 30,
    lineHeight: 30,
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
    marginRight: 5,
    marginLeft: "auto !important",
  });

  const boldStyle = { root: { fontWeight: FontWeights.semibold } };
  const propertyHeadingStyles = { alignSelf: "start", fontSize: "18px", paddingLeft: 5, paddingBottom: 2 }

  const checkboxStyles: Partial<ICheckboxStyles> = { root: { marginTop: 5, marginRight: 30, marginLeft: "auto", width: "fit-content" }, label: { marginLeft: 4 } };

  const theme = getTheme();



  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'Delete Property List',
        text: 'Delete Property List',
        iconProps: { iconName: 'Delete' },
        onClick: toggleIsDeleteCalloutVisible
      },
      {
        key: 'Edit Property List',
        text: 'Edit Property List',
        iconProps: { iconName: 'Edit' },
        onClick: toggleIsEditCalloutVisible
      },
      /* {
        key: 'Add Contact',
        text: 'Add Contact',
        iconProps: { iconName: 'Add' },
        onClick: toggleIsAddContactCalloutVisible
      }, */
    ],
    directionalHintFixed: false,
    styles: { container: { width: 175 } }
  };

  const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      /* marginLeft: 5, */
      marginTop: '0px !important',
      /* marginRight: 5, */
      /*  width: 35,
       height: 35, */
      /*  visibility: isChecked() ? "visible" : "hidden", */

    },
    rootHovered: {
      color: theme.palette.neutralDark,
      backgroundColor: "rgb(3 122 212 / 16%);",
      /* borderRadius: 30, */
      "transition": "all .2s ease-in-out", transform: "scale(1.1)"

    },
    icon: {
      fontSize: "20px",
      marginLeft: 2

    }
  };


  const menuIcon: IIconProps = { iconName: 'SingleColumnEdit' };

  const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200 } };
  const textFieldContactStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 250 } };

  const onChangeEnquiryName = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setEditPropertyList({ ...editPropertyList, enquiryName: newValue! });
    },
    [setEditPropertyList],
  );

  /* const onChangeContactName = React.useCallback(
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
  ); */


  const handleSetSelectedProperties = React.useCallback( () => {

    selectedPropertyListVar(propertyList.properties)
    pdfVariables({...pdfVariables(),
      enquiryName: editPropertyList.enquiryName!,
      
    })
    /* pdfVariables({...pdfVariables(),
      
      customTitle: editPropertyList.customTitle!,
    }) */

  },[editPropertyList.enquiryName, propertyList.properties, editPropertyList.customTitle ])

  const [isCurrentListChecked, setIsCurrentListChecked] = React.useState(false);

  const onChangeSetCurrentListToggle = React.useCallback((ev?: React.FormEvent<HTMLInputElement | HTMLElement> | undefined, checked?: boolean | undefined) => {
    if (isCurrentListChecked) {
      setIsCurrentListChecked(false)
      setEditPropertyList({ ...editPropertyList, propertyIdList: propertyList.properties?.map((property) => { return property.propertyId }) })
    } else {
      setIsCurrentListChecked(true)
      setEditPropertyList({ ...editPropertyList, propertyIdList: propertyIdList })
    }


  }, [editPropertyList, propertyIdList, isCurrentListChecked, setIsCurrentListChecked, propertyList.properties])

  const [isCurrentDateChecked, setIsCurrentDateChecked] = React.useState(false);

  const onChangeSetCurrentDateToggle = React.useCallback((ev?: React.FormEvent<HTMLInputElement | HTMLElement> | undefined, checked?: boolean | undefined) => {
    if (isCurrentDateChecked) {
      setIsCurrentDateChecked(false)
      setEditPropertyList({ ...editPropertyList, enquiryDate: propertyList.enquiryDate })
    } else {
      setIsCurrentDateChecked(true)
      setEditPropertyList({ ...editPropertyList, enquiryDate: new Date() })
    }


  }, [editPropertyList, isCurrentDateChecked, setIsCurrentDateChecked, propertyList.enquiryDate])

  const getPropertyListDate = () => {


    var date: Date = new Date()

    if (propertyList.enquiryDate !== undefined) {
      date = new Date(propertyList.enquiryDate)
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



  const [height, setHeight] = React.useState<number>()
console.log(height)

  const heightRef = React.useCallback((heightRef) => {

    setHeight(heightRef?.getBoundingClientRect().bottom - heightRef?.getBoundingClientRect().top -100);
  }, []);



  return (

    <Stack styles={{ root: { marginTop: 20 } }} verticalFill>

      <Stack
        horizontalAlign="start"
        verticalAlign="start"
        id="card"

        styles={{
          root: {
            /* width: 580, */
            marginBottom: 10,
            marginTop: 10,
            padding: '5px',
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

        <div className={chevronIconDiv} onClick={handleSetSelectedProperties}><Icon className={chevronClass} iconName={'ChevronLeft'} /></div>

        <IconButton
          styles={iconButtonStyles}
          id={`comboButton${propertyList.propertyListId}`}
          menuProps={menuProps}
          iconProps={menuIcon}
          ariaLabel="Combo Button"
        />

        <Stack styles={{ root: { paddingTop: 0, marginTop: "0 !important", marginBottom: "auto" } }} verticalFill>
          <Text styles={boldStyle} style={propertyHeadingStyles}>{propertyList.enquiryName} </Text>
          <Text style={{ paddingLeft: 5 }}>{getPropertyListDate()}</Text>


        </Stack>


        {isDeleteCalloutVisible ? (
          <div>
            <FocusTrapCallout
              role="alertdialog"
              className={styles.callout}
              gapSpace={0}
              target={`#comboButton${propertyList.propertyListId}`}
              onDismiss={toggleIsDeleteCalloutVisible}
              setInitialFocus
            >
              <div className={styles.header}>
                <Text className={styles.title}>Delete List</Text>
              </div>
              <div className={styles.inner}>
                <div>
                  <Text className={styles.subtext}>
                    Are you sure you want to delete this list?
                </Text>
                </div>
              </div>
              <FocusZone>
                <Stack className={styles.buttons} gap={8} horizontal>
                  <PrimaryButton onClick={deletePropertyListButton}>Confirm</PrimaryButton>
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
              target={`#comboButton${propertyList.propertyListId}`}
              onDismiss={toggleIsEditCalloutVisible}
              setInitialFocus
            >
              <div className={styles.header}>
                <Text className={styles.title}>Edit List</Text>
              </div>
              <div className={styles.inner}>
                <div>

                  <TextField
                    styles={textFieldStyles}
                    label="Enquiry Name"

                    value={editPropertyList.enquiryName}
                    onChange={onChangeEnquiryName}></TextField>
                  <Checkbox boxSide="end" styles={checkboxStyles} label="Set Current List?" checked={isCurrentListChecked} onChange={onChangeSetCurrentListToggle} />
                  <Checkbox boxSide="end" styles={checkboxStyles} label="Set Current Date?" checked={isCurrentDateChecked} onChange={onChangeSetCurrentDateToggle} />
                </div>
              </div>
              <FocusZone>
                <Stack className={styles.buttons} gap={8} horizontal>
                  <PrimaryButton onClick={updatePropertyListButton}>Confirm</PrimaryButton>
                  <DefaultButton onClick={toggleIsEditCalloutVisible}>Cancel</DefaultButton>
                </Stack>
              </FocusZone>
            </FocusTrapCallout>
          </div>
        ) : null}

        {/* {isAddContactCalloutVisible ? (
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
        ) : null} */}

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

          <div className={chevronIconDiv} onClick={() => handleExpand(propertyList.propertyListId)}><Icon className={chevronClass} iconName={'ChevronRight'} /></div>

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
            <div ref={heightRef} >
              <Stack verticalFill styles={{
                root: {
                  /* width: 580, */
                  display: "flex",
                  /* height: height, */
                  
                  /* overflowY: "auto" */
                  /*  flexFlow: "row wrap" */

                }
              }} >

                {sortedPropertyList?.map((property) => {
                  return (

                    <Stack styles={{ root: { marginLeft: 50, marginTop: "10px !important", alignItems: "center" } }} horizontal>

                      <Text styles={boldStyle} style={propertyHeadingStyles}>{property.propertyName} </Text>

                      {/* <IconButton
                        styles={deleteIconStyles}
                        iconProps={deleteIcon}
                        ariaLabel="Remove Property"
                        onClick={() => handleRemoveProperty(property.propertyId)}
                    /> */}

                    </Stack>


                  )

                })}

              </Stack>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

    </Stack>



  );
};

export default SavedListItem