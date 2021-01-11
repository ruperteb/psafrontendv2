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
  IModalProps
} from 'office-ui-fabric-react';

import { GET_NAV_STATE, } from "../gql/gql"
import { Query, NavigationState } from "../schematypes/schematypes"
import { gql, useQuery, } from '@apollo/client';
import {navigationState as navigationStateVar} from "../reactivevariables/reactivevariables"
import ImageSlider from "./ImageSlider"

type Maybe<T> = T | null;
const cancelIcon: IIconProps = { iconName: 'Cancel' };

interface Props {
    propertyId: number;
    showImageGalleryModal: boolean;
    /* imagesArray: Maybe<string>[] */
}

const ImageGalleryModal: React.FC<Props> = ({showImageGalleryModal, propertyId}) => {
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
  
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

  const hideImageGalleryModal = () => {
    navigationStateVar({ ...navigationStateVar(), showImageGalleryModal: false })
}

const modalProps: IModalProps = {
    isBlocking: false,
    styles: { main: { maxWidth: 450 } },
  };

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
        isOpen={showImageGalleryModal}
        onDismiss={hideModal}
        isBlocking={true}
        containerClassName={contentStyles.container}
        /* modalProps={modalProps} */
       /*  layerProps={onLayerDidMount} */
        
      >
        <div className={contentStyles.header}>
          <span id={titleId}>Image Gallery</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close image gallery"
            onClick={hideImageGalleryModal}
          />
        </div>
        <div className={contentStyles.body}>
        <ImageSlider propertyId={propertyId} ></ImageSlider>
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

export default ImageGalleryModal