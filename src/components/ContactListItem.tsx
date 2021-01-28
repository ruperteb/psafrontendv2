import * as React from 'react';
import { getTheme } from '@fluentui/react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { Query, Property, Mutation, MutationDeletePropertyArgs, LandlordContact } from "../schematypes/schematypes"
import { GET_SELECTED_PROPERTIES, GET_PROPERTIES, DELETE_PROPERTY } from "../gql/gql"
import { gql, useMutation, useQuery } from '@apollo/client';
import { selectedPropertyList } from "../reactivevariables/reactivevariables"
import { mergeStyles, registerIcons } from 'office-ui-fabric-react/lib/Styling';
import { CommandBarButton, IContextualMenuProps, Stack, Text, FontWeights, IconButton, IIconProps, IStackStyles, initializeIcons, DefaultButton, FocusTrapCallout, FocusZone, PrimaryButton, mergeStyleSets, } from 'office-ui-fabric-react';
import { useBoolean } from '@uifabric/react-hooks';
import { IndustrialIcon, RetailIcon, OfficeIcon, MixedUseIcon } from "../assets/svgIcons.js"
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import {navigationState} from "../reactivevariables/reactivevariables"
import "./PropertyListItem.css"

import { motion, AnimatePresence } from "framer-motion";


interface Props {
  contact: LandlordContact
  key: any
  
}

export const ContactListItem: React.FunctionComponent<Props> = ({ contact}) => {

 


  const [isDeleteCalloutVisible, { toggle: toggleIsDeleteCalloutVisible }] = useBoolean(false);

  








  

  

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
    
   
    marginLeft:15,
    marginRight:15,
    marginTop: "-10px !important",
    padding: "5px",
    
    

});

const chevronIconDiv = mergeStyles({
  /* fontSize: 50, */
  height: 40,
  width: 40,
  lineHeight: 40,
  textAlign: "center",
  marginLeft:15,
  marginRight:15,
  marginTop: "0px !important",
  /* padding: "5px", */
  selectors: {
    '&:hover': { backgroundColor: "rgb(0 13 255 / 14%)" , borderRadius: 30, "transition": "all .2s ease-in-out", transform: "scale(1.2)" },
  },

});

  const boldStyle = { root: { fontWeight: FontWeights.semibold } };
  const propertyHeadingStyles = { alignSelf: "start", fontSize: "23px", padding: 5, paddingLeft: "25px" }
  const propertyAddressStyles = { alignSelf: "start", fontSize: "14px", padding: 5, paddingLeft: "25px" }
  const theme = getTheme();
  const iconButtonStyles = {
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


  return (

    

<Stack
      horizontalAlign="start"
      verticalAlign="start"
      id="card"

      styles={{
        root: {
          width: 700,
          marginBottom: 10,
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
        <Text styles={boldStyle} style={propertyHeadingStyles}>{contact.name}</Text>
        <Text styles={boldStyle} style={propertyHeadingStyles}>{contact.email}</Text>
        <Text styles={boldStyle} style={propertyHeadingStyles}>{contact.officeNo}</Text>
        <Text styles={boldStyle} style={propertyHeadingStyles}>{contact.mobileNo}</Text>
        


      </Stack>
      <IconButton
        styles={iconButtonStyles}
        id={`deleteButton${contact.contactId}`}
        iconProps={deleteIcon}
        ariaLabel="Delete Property"
        onClick={toggleIsDeleteCalloutVisible}
      />
      {isDeleteCalloutVisible ? (
        <div>
          <FocusTrapCallout
            role="alertdialog"
            className={styles.callout}
            gapSpace={0}
            target={`#deleteButton${contact.contactId}`}
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
                <PrimaryButton /* onClick={deletePropertyButton} */>Confirm</PrimaryButton>
                <DefaultButton onClick={toggleIsDeleteCalloutVisible}>Cancel</DefaultButton>
              </Stack>
            </FocusZone>
          </FocusTrapCallout>
        </div>
      ) : null}


    </Stack>


    

   

    

  );
};

export default ContactListItem