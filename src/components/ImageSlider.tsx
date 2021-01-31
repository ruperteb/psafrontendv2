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

type Maybe<T> = T /* | null */;

interface Props {
    propertyId: number,
    /*  imagesArray: Maybe<string>[] */
}

export const ImageSlider: React.FC<Props> = ({ propertyId }) => {



    var imagesArray: Maybe<string>[] = []

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
        imagesArray = propertyData?.singleProperty?.images!
    }

    



    const [updateProperty, { data }] = useMutation<Mutation, MutationUpdatePropertyArgs>(UPDATE_IMAGES);

    const saveUpdatedImages = () => {

        updateProperty({
            variables: {
                propertyId: propertyId,
                images: imagesArray
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
        if (item?.key === "Primary") {
            var primary = imagesArray[imageIndex]
            var rest = imagesArray.filter(image => {
                return image !== primary
            })
            imagesArray = [primary, ...rest]
        }
        if (item?.key === "Secondary") {
            var secondary = imagesArray[imageIndex]
            var rest = imagesArray.filter(image => {
                return image !== secondary
            })
            var first = rest.slice(0, 1)
            var remaining = rest.slice(1)
            imagesArray = [...first, secondary, ...remaining]
        }
        if (item?.key === "Tertiary") {
            var tertiary = imagesArray[imageIndex]

            var rest = imagesArray.filter(image => {
                return image !== tertiary
            })

            var firstTwo = rest.slice(0, 2)
            var remaining = rest.slice(2)
            imagesArray = [...firstTwo, tertiary, ...remaining]
        }
        if (item?.key === "Penultimate") {
            var penultimate = imagesArray[imageIndex]
            
            var rest = imagesArray.filter(image => {
                return image !== penultimate 
            })
            var final = rest[rest.length - 1]
var restLessFinal = rest.slice(0, rest.length - 1)

            imagesArray = [...restLessFinal, penultimate  ,final]
        }
        if (item?.key === "Final") {
            var final = imagesArray[imageIndex]

            var rest = imagesArray.filter(image => {
                return image !== final
            })


            imagesArray = [...rest, final]
        }
        saveUpdatedImages()
    };

    const deleteImage = () => {

        updateProperty({
            variables: {
                propertyId: propertyId,
                images: imagesArray.filter(image => {
                    return image !== imagesArray[imageIndex]
                })
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
                key: 'Primary',
                text: 'Primary',
                onClick: onChange
            },
            {
                key: 'Secondary',
                text: 'Secondary',
                onClick: onChange
            },
            {
                key: 'Tertiary',
                text: 'Tertiary',
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


    const [[page, direction], setPage] = useState([0, 0]);

    // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
    // then wrap that within 0-2 to find our image ID in the array below. By passing an
    // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
    // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
    const imageIndex = wrap(0, imagesArray.length, page);

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);

    };

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
        /* padding: "5px", */
        selectors: {
            '&:hover': { backgroundColor: "rgb(208 209 230 / 81%)", borderRadius: 30, "transition": "all .2s ease-in-out", transform: "scale(1.2)" },
        },

    });

    const chevronClassRight = mergeStyles({
        alignSelf: 'center',
        marginLeft: 2,

        marginTop: "0 !important",

        fontSize: 20,
        flexShrink: 0,
        cursor: "pointer",


    });

    const chevronClassLeft = mergeStyles({
        alignSelf: 'center',
        marginLeft: 2,

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

                    <Image cloudName="drlfedqyz" publicId={imagesArray[imageIndex]} width="600" /* height="400" */ crop="fit" />

                    <div style={{ display: "flex" }}>

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


                </motion.div>
            </AnimatePresence>



            <div className={chevronIconDivLeft} onClick={() => paginate(1)}><Icon className={chevronClassLeft} iconName={'ChevronRight'} /></div>
            <div className={chevronIconDivRight} onClick={() => paginate(1)}><Icon className={chevronClassRight} iconName={'ChevronRight'} /></div>




        </div>

    );
};

export default ImageSlider