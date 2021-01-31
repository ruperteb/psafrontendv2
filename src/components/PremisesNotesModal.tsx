import * as React from 'react';
import { useId, useBoolean } from '@uifabric/react-hooks';
import {
    getTheme,
    mergeStyleSets,
    FontWeights,
    ContextualMenu,
    Toggle,
    DefaultButton,
    Modal,
    IDragOptions,
    IconButton,
    IIconProps,
    ILayerProps,
    IModalProps,
    Stack,
    Text,
    IStackStyles
} from 'office-ui-fabric-react';

import { GET_SINGLE_PROPERTY, } from "../gql/gql"
import { Query, NavigationState } from "../schematypes/schematypes"
import { useQuery, } from '@apollo/client';
import { navigationState as navigationStateVar } from "../reactivevariables/reactivevariables"





type Maybe<T> = T | null;
const cancelIcon: IIconProps = { iconName: 'Cancel' };

interface Props {
    propertyId: number
    premisesId: number
    showPremisesNotesModal: boolean;
    /* imagesArray: Maybe<string>[] */
}

const PremisesNotesModal: React.FC<Props> = ({ showPremisesNotesModal, propertyId, premisesId  }) => {

    

    const {
        data: propertyData,
        loading: propertyLoading,
        error: propertyError
    } = useQuery<Query>(GET_SINGLE_PROPERTY, {
        variables: { propertyId: propertyId },
    });

    const getPremises = propertyData?.singleProperty?.premisesList!.find(premises => premises?.premisesId === premisesId);


    /* const {
      data: navigationStateData,
      loading: navigationLoading,
      error: navigationError
    } = useQuery<Query>(GET_NAV_STATE);
  
    
  const navStateQuery =() => {
      const {
          data: navigationStateData,
          loading: navigationLoading,
          error: navigationError
        } = useQuery<Query>(GET_NAV_STATE);
  
  } */


    /* console.log(navigationStateData?.navigationState) */

    const hidePremisesNotesModal = () => {
        navigationStateVar({ ...navigationStateVar(), showPremisesNotesModal: false })
    }

    const modalProps: IModalProps = {
        isBlocking: false,
        styles: { main: { maxWidth: 450 } },
    };

    const boldStyle = { root: { fontWeight: FontWeights.semibold } };
    const propertyDetailsStyles = { alignSelf: "start", fontSize: "18px", paddingLeft: "15px" }

    /* const onLayerDidMount: ILayerProps ={
        onLayerDidMount: true
    } */

    // Use useId() to ensure that the IDs are unique on the page.
    // (It's also okay to use plain strings and manually ensure uniqueness.)
    const titleId = useId('ImageGallery');

    return (
        <div>

            <Modal
                titleAriaId={titleId}
                isOpen={showPremisesNotesModal}
                /* onDismiss={hideImageGalleryModal} */
                isBlocking={true}
                containerClassName={contentStyles.container}
            /* modalProps={modalProps} */
            /*  layerProps={onLayerDidMount} */

            >
                <div className={contentStyles.header}>
                    <span id={titleId}>Notes</span>
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        ariaLabel="Close image gallery"
                        onClick={hidePremisesNotesModal}
                    />
                </div>
                <div className={contentStyles.body}>

                    <Stack verticalFill styles={{
                        root: {
                            marginTop: "0 !important",
                            marginBottom: 20,
                        },
                    }}
                        gap={15}>
                        <Text styles={boldStyle} style={propertyDetailsStyles}>Premises Notes:</Text>
                        <Text /* styles={boldStyle} */ style={propertyDetailsStyles}>{getPremises?.premisesNotes}</Text>
                        
                        
                    </Stack>

                    <Stack verticalFill styles={{
                        root: {
                            marginTop: "0 !important"
                        },
                    }}
                        gap={15}>
                        <Text styles={boldStyle} style={propertyDetailsStyles}>Tenant Notes:</Text>
                        <Text /* styles={boldStyle} */ style={propertyDetailsStyles}>{getPremises?.tenantNotes}</Text>
                        
                        
                    </Stack>



                </div>
            </Modal>
        </div>
    );
};

const theme = getTheme();
const contentStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
        width: 500
    },
    header: [

        theme.fonts.xLargePlus,
        {
            flex: '1 1 auto',
            borderTop: `4px solid ${theme.palette.themePrimary}`,
            color: theme.palette.neutralPrimary,
            display: 'flex',
            alignItems: 'center',
            fontWeight: FontWeights.semibold,
            padding: '12px 12px 14px 24px',
        },
    ],
    body: {
        flex: '4 4 auto',
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        selectors: {
            p: { margin: '14px 0' },
            'p:first-child': { marginTop: 0 },
            'p:last-child': { marginBottom: 0 },
        },
    },
});
const toggleStyles = { root: { marginBottom: '20px' } };
const iconButtonStyles = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px',
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};

export default PremisesNotesModal