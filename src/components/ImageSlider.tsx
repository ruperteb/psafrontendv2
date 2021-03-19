import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Image, Video, Transformation, CloudinaryContext, } from 'cloudinary-react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_IMAGES, GET_SINGLE_PROPERTY, GET_NAV_STATE } from "../gql/gql"
import { Mutation, MutationUpdatePropertyArgs, Query } from "../schematypes/schematypes"
import { ContextualMenu, DefaultButton, IContextualMenuProps, IIconProps, IContextualMenuItem, DirectionalHint, IContextualMenuStyles, IStyleFunctionOrObject, IContextualMenuStyleProps, FocusTrapCallout, FocusZone, Stack, Text, PrimaryButton, FontWeights, mergeStyleSets } from 'office-ui-fabric-react';
import { useBoolean } from '@uifabric/react-hooks';
const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        };
    }
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME

type Maybe<T> = T /* | null */;

interface Props {
    propertyId: number,
    /*  imagesArray: Maybe<string>[] */
}

export const ImageSlider: React.FC<Props> = ({ propertyId }) => {


    var locality: Maybe<string> = ""
    var aerial: Maybe<string> = ""
    var imagesArray: Maybe<string>[] = []
    var combinedArray: Maybe<string>[] = []

    

    /* const {
        data: navigationStateData,
        loading: navigationLoading,
        error: navigationError
      } = useQuery<Query>(GET_NAV_STATE); */



    const {
        data: propertyData,
        loading: propertyLoading,
        error: propertyError
    } = useQuery<Query>(GET_SINGLE_PROPERTY, {
        variables: { propertyId: propertyId },
    });

    if (propertyData?.singleProperty) {
        locality = propertyData?.singleProperty?.locality!
        aerial = propertyData?.singleProperty?.aerial!
        imagesArray = propertyData?.singleProperty?.images!

        if (locality !== "" && locality !== null && locality !== undefined) {
            combinedArray = [locality]
        }
        if (aerial !== "" && aerial !== null && aerial !== undefined) {
            combinedArray = [...combinedArray, aerial]
        }
        combinedArray = [...combinedArray, ...imagesArray]
    }

    const [[page, direction], setPage] = useState([0, 0]);

    const imageIndex = wrap(0, combinedArray.length, page);

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);

    };



    const getContactId = () => {
        if (propertyData?.singleProperty?.contact?.contactId === undefined || propertyData?.singleProperty?.contact?.contactId === null) {
            return 45
        } else {
            return propertyData?.singleProperty?.contact?.contactId
        }
    }

    const [updateProperty, { data }] = useMutation<Mutation, MutationUpdatePropertyArgs>(UPDATE_IMAGES);

    const saveUpdatedImages = () => {

        updateProperty({
            variables: {
                propertyId: propertyId,
                locality: locality,
                aerial: aerial,
                images: imagesArray,
                contactId: getContactId()
            },

            update(cache, { data }) {

                if (!data) {
                    return null;
                }

                const getExistingProperty = cache.readQuery<Query>({ query: GET_SINGLE_PROPERTY, variables: { propertyId: propertyId } })

                const updatedProperty = data.updateProperty!;
                console.log(updatedProperty)
                if (getExistingProperty)
                    cache.writeQuery<Query>({
                        query: GET_SINGLE_PROPERTY,
                        variables: { propertyId: propertyId },
                        data: { singleProperty: updatedProperty }
                    });
            }
        })
        /* toggleIsDeleteCalloutVisible() */
    }

    const onChange = (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined, item?: IContextualMenuItem | undefined) => {
        /* setSelectedItem(item); */

        if (item?.key !== "Penultimate" && item?.key !== "Final") {
            var selectedImage = combinedArray[imageIndex]
            var rest = imagesArray.filter(image => {
                return image !== selectedImage
            })

            var beforeSelectedImage = rest.slice(0, parseInt(item?.key!) - 1)
            var afterSelectedImage = rest.slice(parseInt(item?.key!) - 1)
            imagesArray = [...beforeSelectedImage, selectedImage, ...afterSelectedImage]
        }

        if (item?.key === "Locality") {
            var selectedImage = combinedArray[imageIndex]
            var rest = imagesArray.filter(image => {
                return image !== selectedImage
            })
            imagesArray = rest
            locality = selectedImage
        }
        if (item?.key === "Aerial") {
            var selectedImage = combinedArray[imageIndex]
            var rest = imagesArray.filter(image => {
                return image !== selectedImage
            })
            imagesArray = rest
            aerial = selectedImage
        }
        if (item?.key === "Penultimate") {
            var penultimate = combinedArray[imageIndex]

            var rest = imagesArray.filter(image => {
                return image !== penultimate
            })
            var final = rest[rest.length - 1]
            var restLessFinal = rest.slice(0, rest.length - 1)

            imagesArray = [...restLessFinal, penultimate, final]
        }
        if (item?.key === "Final") {
            var final = combinedArray[imageIndex]

            var rest = imagesArray.filter(image => {
                return image !== final
            })


            imagesArray = [...rest, final]
        }
        saveUpdatedImages()
    };

    

    const deleteImage = () => {

        switch (getImageName()) {

            case "Aerial":

                updateProperty({
                    variables: {
                        propertyId: propertyId,
                        aerial: "",
                        contactId: getContactId()
                    },

                    update(cache, { data }) {

                        if (!data) {
                            return null;
                        }

                        const getExistingProperty = cache.readQuery<Query>({ query: GET_SINGLE_PROPERTY, variables: { propertyId: propertyId } })

                        const updatedProperty = data.updateProperty!;
                        console.log(updatedProperty)
                        if (getExistingProperty)
                            cache.writeQuery<Query>({
                                query: GET_SINGLE_PROPERTY,
                                variables: { propertyId: propertyId },
                                data: { singleProperty: updatedProperty }
                            });
                    }
                })

                break;
            case "Locality":

                updateProperty({
                    variables: {
                        propertyId: propertyId,
                        locality: "",
                        contactId: getContactId()
                    },

                    update(cache, { data }) {

                        if (!data) {
                            return null;
                        }

                        const getExistingProperty = cache.readQuery<Query>({ query: GET_SINGLE_PROPERTY, variables: { propertyId: propertyId } })

                        const updatedProperty = data.updateProperty!;
                        console.log(updatedProperty)
                        if (getExistingProperty)
                            cache.writeQuery<Query>({
                                query: GET_SINGLE_PROPERTY,
                                variables: { propertyId: propertyId },
                                data: { singleProperty: updatedProperty }
                            });
                    }
                })

                break;

            default:

                updateProperty({
                    variables: {
                        propertyId: propertyId,
                        images: imagesArray.filter(image => {
                            return image !== combinedArray[imageIndex]
                        }),
                        contactId: getContactId()
                    },

                    update(cache, { data }) {

                        if (!data) {
                            return null;
                        }

                        const getExistingProperty = cache.readQuery<Query>({ query: GET_SINGLE_PROPERTY, variables: { propertyId: propertyId } })

                        const updatedProperty = data.updateProperty!;
                        console.log(updatedProperty)
                        if (getExistingProperty)
                            cache.writeQuery<Query>({
                                query: GET_SINGLE_PROPERTY,
                                variables: { propertyId: propertyId },
                                data: { singleProperty: updatedProperty }
                            });
                    }
                })

        }
        toggleIsDeleteCalloutVisible()
    }

    const dropdownMenuStyles: IStyleFunctionOrObject<IContextualMenuStyleProps, IContextualMenuStyles> = { container: { width: 125 } };

    const menuProps: IContextualMenuProps = {
        styles: dropdownMenuStyles,
        // For example: disable dismiss if shift key is held down while dismissing
        directionalHint: DirectionalHint.topRightEdge,
        onDismiss: ev => {
            if (ev && ev.shiftKey) {
                ev.preventDefault();
            }
        },
        items: [
            {
                key: 'Locality',
                text: 'Locality',
                onClick: onChange
            },
            {
                key: 'Aerial',
                text: 'Aerial',
                onClick: onChange
            },
            {
                key: '1',
                text: '1',
                onClick: onChange
            },
            {
                key: '2',
                text: '2',
                onClick: onChange
            },
            {
                key: '3',
                text: '3',
                onClick: onChange
            },
            {
                key: '4',
                text: '4',
                onClick: onChange
            },
            {
                key: '5',
                text: '5',
                onClick: onChange
            },
            {
                key: '6',
                text: '6',
                onClick: onChange
            },
            {
                key: '7',
                text: '7',
                onClick: onChange
            },
            {
                key: '8',
                text: '8',
                onClick: onChange
            },
            {
                key: 'Penultimate',
                text: 'Penultimate',
                onClick: onChange
            },
            {
                key: 'Final',
                text: 'Final',
                onClick: onChange
            },
        ],
        directionalHintFixed: true,
    };

    const getImageName = () => {

        if (locality !== "" && locality !== null && locality !== undefined && aerial !== "" && aerial !== null && aerial !== undefined) {
            switch (imageIndex) {
                /* case 0:
                  return "Image 1"
                  break;
                case 1:
                    return "Image 2"
                  break;
                  case 2:
                    return "Tertiary"
                  break; */
                case 0:
                    return "Locality"
                    break;
                case 1:
                    return "Aerial"
                    break;
                case combinedArray.length - 2:
                    return "Penultimate"
                    break;
                case combinedArray.length - 1:
                    return "Final"
                    break;
                default:
                    return `Image ${imageIndex - 1}`
            }
        }

        if ((locality === "" || locality === null || locality === undefined) && (aerial === "" || aerial === null || aerial === undefined)) {
            switch (imageIndex) {
                /* case 0:
                  return "Image 1"
                  break;
                case 1:
                    return "Image 2"
                  break;
                  case 2:
                    return "Tertiary"
                  break; */

                case combinedArray.length - 2:
                    return "Penultimate"
                    break;
                case combinedArray.length - 1:
                    return "Final"
                    break;
                default:
                    return `Image ${imageIndex + 1}`
            }
        }

        if (locality === "" || locality === null || locality === undefined) {
            switch (imageIndex) {
                /* case 0:
                  return "Image 1"
                  break;
                case 1:
                    return "Image 2"
                  break;
                  case 2:
                    return "Tertiary"
                  break; */
                case 0:
                    return "Aerial"
                    break;
                case combinedArray.length - 2:
                    return "Penultimate"
                    break;
                case combinedArray.length - 1:
                    return "Final"
                    break;
                default:
                    return `Image ${imageIndex}`
            }
        }

        if (aerial === "" || aerial === null || aerial === undefined) {
            switch (imageIndex) {
                /* case 0:
                  return "Image 1"
                  break;
                case 1:
                    return "Image 2"
                  break;
                  case 2:
                    return "Tertiary"
                  break; */
                case 0:
                    return "Locality"
                    break;
                case combinedArray.length - 2:
                    return "Penultimate"
                    break;
                case combinedArray.length - 1:
                    return "Final"
                    break;
                default:
                    return `Image ${imageIndex}`
            }
        }
    }

    console.log(getImageName())

    function _getMenu(props: IContextualMenuProps): JSX.Element {
        // Customize contextual menu with menuAs
        return <ContextualMenu {...props} />;
    }

    function _onMenuClick(ev?: React.SyntheticEvent<any>) {
        console.log(ev);
    }


    const dropdownStyles: Partial<IContextualMenuStyles> = { root: { /* position: "absolute", bottom: 10, right: 10, zIndex: 5  */ marginRight: 5, marginLeft: 5 }, container: { width: 150 } };
    const deleteButtonStyles: Partial<IContextualMenuStyles> = { root: { /* position: "absolute", bottom: 10, right: 10, zIndex: 5  */marginLeft: "auto", marginRight: 5 }, container: { width: 150 } };
    const chevronUpIcon: IIconProps = { iconName: 'ChevronUp' };
    const deleteIcon: IIconProps = { iconName: 'Delete' };


    

    const sliderContainerClass: any = {
        "position": "relative",
        height: 500,
        width: 600,
        overflow: "hidden",
        padding: 0,
        margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }


    const chevronIconDivRight = mergeStyles({
        /* fontSize: 50, */
        height: 40,
        width: 40,
        lineHeight: 40,
        textAlign: "center",
        marginLeft: "auto",
        marginRight: 10,
        marginTop: "0px !important",
        zIndex: 2,
        /* padding: "5px", */
        selectors: {
            '&:hover': { backgroundColor: "rgb(208 209 230 / 81%)", borderRadius: 30, "transition": "all .2s ease-in-out", transform: "scale(1.2)" },
        },

    });

    const chevronIconDivLeft = mergeStyles({
        /* fontSize: 50, */
        height: 40,
        width: 40,
        lineHeight: 40,
        textAlign: "center",
        marginLeft: 10,
        marginRight: "auto",
        marginTop: "0px !important",
        zIndex: 2,
        /*  backgroundColor: "rgb(208 209 230 / 50%)",
         borderRadius: 30, */
        /* padding: "5px", */
        selectors: {
            '&:hover': { backgroundColor: "rgb(208 209 230 / 81%)", borderRadius: 30, "transition": "all .2s ease-in-out", transform: "scale(1.2)" },
        },

    });

    const chevronClassRight = mergeStyles({
        alignSelf: 'center',
        marginLeft: 2,
        color: "rgb(240 255 255)",
        marginTop: "0 !important",

        fontSize: 20,
        flexShrink: 0,
        cursor: "pointer",


    });

    const chevronClassLeft = mergeStyles({
        alignSelf: 'center',
        /* marginLeft: 2, */
        color: "rgb(240 255 255)",
        marginTop: "0 !important",

        fontSize: 20,
        flexShrink: 0,
        cursor: "pointer",
        transform: "scale(-1)",

    });

    const imgStyles: any = {
        "position": "absolute",
        maxWidth: 600,

    }

    const [isDeleteCalloutVisible, { toggle: toggleIsDeleteCalloutVisible }] = useBoolean(false);

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

    const boldStyle = { root: { fontWeight: FontWeights.semibold } };
    const textStyles = { alignSelf: "start", fontSize: "24px", paddingLeft: 10, paddingRight: 10, "white-space": "nowrap" }

    return (
        <div style={sliderContainerClass}>
            <AnimatePresence initial={false} custom={direction}>
                <motion.div

                    style={imgStyles}
                    key={page}
                    /*  src={images[imageIndex]} */
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                >

                    <Image cloudName={CLOUD_NAME} publicId={combinedArray[imageIndex]} width="600" height="400" crop="fill_pad" gravity="auto" />


                </motion.div>
            </AnimatePresence>



            <div className={chevronIconDivLeft} onClick={() => paginate(-1)}><Icon className={chevronClassLeft} iconName={'ChevronRight'} /></div>
            <div className={chevronIconDivRight} onClick={() => paginate(1)}><Icon className={chevronClassRight} iconName={'ChevronRight'} /></div>

            <div style={{ display: "flex", position: "absolute", bottom: 5, left: 20, zIndex: 5 }}>
                <Text styles={boldStyle} style={textStyles}> {getImageName()}</Text>
            </div>

            <div style={{ display: "flex", position: "absolute", bottom: 0, right: 0, zIndex: 5 }}>

                <DefaultButton
                    id={`deleteImageButton_${propertyId}_Image_${imageIndex}`}
                    styles={deleteButtonStyles}
                    text="Delete Image"
                    iconProps={deleteIcon}
                    onClick={toggleIsDeleteCalloutVisible}
                />
                {isDeleteCalloutVisible ? (
                    <div>
                        <FocusTrapCallout
                            role="alertdialog"
                            className={styles.callout}
                            gapSpace={0}
                            target={`#deleteImageButton_${propertyId}_Image_${imageIndex}`}
                            onDismiss={toggleIsDeleteCalloutVisible}
                            setInitialFocus
                        >
                            <div className={styles.header}>
                                <Text className={styles.title}>Delete Image</Text>
                            </div>
                            <div className={styles.inner}>
                                <div>
                                    <Text className={styles.subtext}>
                                        Are you sure you want to delete this image?
</Text>
                                </div>
                            </div>
                            <FocusZone>
                                <Stack className={styles.buttons} gap={8} horizontal>
                                    <PrimaryButton onClick={deleteImage}>Confirm</PrimaryButton>
                                    <DefaultButton onClick={toggleIsDeleteCalloutVisible}>Cancel</DefaultButton>
                                </Stack>
                            </FocusZone>
                        </FocusTrapCallout>
                    </div>
                ) : null}
                <DefaultButton
                    styles={dropdownStyles}
                    text="Set Image"
                    menuIconProps={chevronUpIcon}
                    menuProps={menuProps}
                    menuAs={_getMenu}
                    onMenuClick={_onMenuClick}
                />

            </div>


        </div>

    );
};

export default ImageSlider