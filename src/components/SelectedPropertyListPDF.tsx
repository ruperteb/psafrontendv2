import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

import { Font } from '@react-pdf/renderer'
import SegoeUI from "../assets/fonts/SegoeUI.ttf"
import SegoeUIBold from "../assets/fonts/SegoeUIBold.ttf"

import { GET_SELECTED_PROPERTIES, GET_NAV_STATE, GET_DISTINCT_SUBURBS, GET_DISTINCT_REGIONS, UPDATE_IMAGES } from "../gql/gql"
import { useMutation, useQuery } from '@apollo/client';
import { Mutation, MutationUpdatePropertyArgs, Query, NavigationState, Premises, SelectedPropertyList, Property } from "../schematypes/schematypes"
import { navigationState as navigationStateVar, selectedPropertyList as selectedPropertyListVar } from "../reactivevariables/reactivevariables"
import { Cloudinary } from "cloudinary-core"
import { m } from 'framer-motion';

var cl = new Cloudinary({ cloud_name: "drlfedqyz", secure: true });
var image = cl.url("1567618101_fela1x", { width: 600, crop: "fit" })
console.log(image)
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
        /* borderStyle: "solid",
        borderWidth: 2, */
        /* margin: "10px" */

    },
    overallContainer: {
        fontFamily: 'SegoeUI',
        display: "flex",
        flexDirection: "column",
        width: "100%",

    },
    detailsSection: {
        fontFamily: 'SegoeUI',
        display: "flex",
        flexDirection: "row",
        margin: 5,
        marginLeft: "auto",
        marginRight: "auto",


        width: "100%",
        /*  borderStyle: "solid",
         borderWidth: 1, */
        /*    flexGrow: 1, */
    },
    imagesSection: {
        fontFamily: 'SegoeUI',
        display: "flex",
        flexDirection: "row",
        margin: 5,
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: 80,

        width: "100%",

        /*  borderStyle: "solid",
         borderWidth: 1, */
        /*    flexGrow: 1, */
    },
    headerSection: {
        display: "flex",
        flexDirection: "row",

    },
    headerImageSection: {
        display: "flex",
        flexDirection: "row",
        "backgroundColor": '#20314b',
        width: "100vw",
        height: "auto",


    },
    footerSection: {
        /* position: 'absolute',
        bottom: 0,
        left: 0, */
        display: "flex",
        flexDirection: "row",
        "backgroundColor": '#20314b',
        width: "100vw",
        height: "65px",
        marginBottom: 0,
        marginTop:"auto",
        marginLeft: 0,
    },
    headerImageStyles: {
        display: "flex",
        flexDirection: "row",
        marginLeft: "auto",
        marginRight: "auto",

    },
    pageNumbers: {
        marginRight: 20,
        marginLeft: "auto",
        marginTop: 15,
        fontSize: 8
    },
    enquiryHeading: {
        fontFamily: 'SegoeUI',
        margin: 10,
        marginLeft: 40,
        padding: 10,
    },
    propertyHeading: {
        fontSize: 12,
        fontFamily: "SegoeUI",
        fontWeight: "bold",
        color: "black",
        width: 125,
        /*  height: "20px", */
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 1.5,
        /* marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: 'auto',
        textAlign: 'center', */
    },
    propertyText: {
        fontSize: 10,
        color: "black",
        width: "100%",
        /*  height: "30px", */
        paddingLeft: 10,
        /* paddingTop: 1.5, */
    },
    propertyNumber: {

        fontSize: 12,
        borderStyle: "solid",
        height: 20,
        width: 20,
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft: 7,
        paddingTop: 1.5
    },
    propertyNumberColumn: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: 10,
        paddingTop: 4,
        /* width: "10%", */
        /* borderStyle: "solid",
        borderWidth: 1, */
        /*    flexGrow: 1, */
    },
    propertyDetails: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        width: 125,
        /* borderStyle: "solid",
        borderWidth: 1, */
        /*    flexGrow: 1, */
    },
    premisesDetailsContainer: {
        display: "flex",
        flexDirection: "column",
    },



    premisesHeadings: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        /*  width: "25%", */
        borderStyle: "solid",
        borderWidth: 1,
        /*    flexGrow: 1, */
    },
    premisesDetails: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        /*  width: "25%", */
        /*  borderStyle: "solid",
         borderWidth: 1, */
        /*    flexGrow: 1, */
    },
    premisesContainer: {
        /* width: "20%", */
        paddingLeft: 5,
        paddingRight: 5,
        display: "flex",
        flexDirection: "column",
        /* borderBottomWidth: 1,
        borderBottomStyle: "solid", */
        /*  height: 35, */
        /*  height: "30px", */
    },
    premisesHeadingText: {
        fontSize: 10,
        /*  height: 15, */
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: 'auto',
        textAlign: 'center',
    },
    premisesText: {
        fontSize: 8,
        /*  height: 15, */
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: 'auto',
        textAlign: 'center',
    },
    premisesHeadingSubText: {
        fontSize: 6,
        marginLeft: "auto",
        marginRight: 'auto',
        textAlign: 'center',
        height: 10,
    },
    imagesContainer: {
        display: "flex",
        flexDirection: "row",
        /*  marginLeft: 20, */
        marginRight: 40,


    },
    image: {
        width: 200,


    },


});

Font.registerHyphenationCallback(word => [word]);


Font.register({
    family: 'SegoeUI', fonts: [
        { src: SegoeUI }, { src: SegoeUIBold, fontStyle: 'normal', fontWeight: "bold" },
        /*  { src: source2, fontStyle: 'italic' },
         { src: source3, fontStyle: 'italic', fontWeight: 700 }, */
    ]
});

interface Props {

    selectedPropertyList: SelectedPropertyList,

    /* enquiryName: string */

}


const SelectedPropertyListPDF: React.FC<Props> = ({ selectedPropertyList }) => (







    <Document >
        <Page wrap orientation="landscape" size="A4" style={styles.page}>
            <View fixed style={styles.headerSection}>
                <View style={styles.headerImageSection}>
                    <Image style={styles.headerImageStyles} src="https://res.cloudinary.com/drlfedqyz/image/upload/v1610187102/EBLogoHeader_ypjyj5.jpg"></Image>
                </View>


                <Text style={styles.enquiryHeading} >Enquiry:  {/* {" " && enquiryName} */}</Text>
                <Text style={styles.pageNumbers} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />

            </View>






            {selectedPropertyList.map((property, index) => (

                <View minPresenceAhead={50} wrap={false} key={property.propertyId} style={styles.overallContainer}>

                    <View style={styles.detailsSection}>

                        <View style={styles.propertyNumberColumn}>
                            <Text style={styles.propertyNumber}>{index + 1}</Text>
                        </View>

                        <View style={styles.propertyDetails}>


                            <Text style={styles.propertyHeading}>{property.propertyName}</Text>
                            <Text style={styles.propertyText}>{property.address}</Text>
                            <Text style={styles.propertyText}>{property.suburb}</Text>
                            {/* <Text style={styles.propertyText}>{property.province}</Text> */}



                        </View>

                        <View style={styles.premisesDetailsContainer}>

                            <View style={styles.premisesHeadings}>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={styles.premisesHeadingText} >Floor/ Unit</Text>
                                    <Text style={styles.premisesHeadingSubText} ></Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 40 }]} >Area</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 40 }]}>m²</Text>
                                </View>
                                {/*  <View style={[styles.premisesContainer, {width: 40}]}>
                            <Text style={styles.premisesHeadingText} >Vacant?</Text>
                            <Text style={styles.premisesHeadingSubText} ></Text>
                        </View> */}
                                <View style={[styles.premisesContainer, { width: 30 }]}>
                                    <Text style={styles.premisesHeadingText} >Type</Text>
                                    <Text style={styles.premisesHeadingSubText} ></Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 55 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 55 }]} >Occupation Date</Text>
                                    <Text style={styles.premisesHeadingSubText} ></Text>
                                </View>

                                <View style={[styles.premisesContainer, { width: 45 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 45 }]} >Net Rental</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 45 }]}>R/m²/month</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 45 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 45 }]} >Op Costs</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 45 }]}>R/m²/month</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 45 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 45 }]} >Other</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 45 }]}>R/m²/month</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 45 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 45 }]} >Gross Rental</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 45 }]}>R/m²/month</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 30 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 30 }]} >Esc</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 30 }]}>%</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 40 }]} >Open Bays</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 40 }]}></Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 45 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 45 }]} >Open Rate</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 45 }]}>R/bay/month</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 40 }]} >Covered Bays</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 40 }]}></Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 45 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 45 }]} >Covered Rate</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 45 }]}>R/bay/month</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 40 }]} >Shaded Bays</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 40 }]}></Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 45 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 45 }]} >Shaded Rate</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 45 }]}>R/bay/month</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 50 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 50 }]} >Parking Ratio</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 50 }]}>bays/100m²</Text>
                                </View>
                            </View>
                            {selectedPropertyList[index].premisesList!.map((premises, index) => (

                                <View style={styles.premisesDetails}>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={styles.premisesText} >{premises.floor}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText, { width: 40 }]} >{premises.area}</Text>

                                    </View>
                                    {/*  <View style={[styles.premisesContainer, {width: 40}]}>
<Text style={styles.premisesHeadingText} >Vacant?</Text>
<Text style={styles.premisesHeadingSubText} ></Text>
</View> */}
                                    <View style={[styles.premisesContainer, { width: 30 }]}>
                                        <Text style={styles.premisesText} >{premises.type === "Warehouse" ? "W/H" : premises.type}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 55 }]}>
                                        <Text style={[styles.premisesText, { width: 55 }]} >
                                            {new Date(premises.occupation).toLocaleDateString(
                                                'en-gb',
                                                {
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                    day: 'numeric'
                                                }
                                            )}</Text>

                                    </View>

                                    <View style={[styles.premisesContainer, { width: 45 }]}>
                                        <Text style={[styles.premisesText, { width: 45 }]} >{premises.netRental}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 45 }]}>
                                        <Text style={[styles.premisesText, { width: 45 }]} >{premises.opCosts}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 45 }]}>
                                        <Text style={[styles.premisesText, { width: 45 }]} >{premises.other}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 45 }]}>
                                        <Text style={[styles.premisesText, { width: 45 }]} >{premises.grossRental}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 30 }]}>
                                        <Text style={[styles.premisesText, { width: 30 }]} >{premises.esc}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText, { width: 40 }]} >{premises.openBays}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 45 }]}>
                                        <Text style={[styles.premisesText, { width: 45 }]} >{premises.openRate}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText, { width: 40 }]} >{premises.coveredBays}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 45 }]}>
                                        <Text style={[styles.premisesText, { width: 45 }]} >{premises.coveredRate}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText, { width: 40 }]} >{premises.shadedBays}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 45 }]}>
                                        <Text style={[styles.premisesText, { width: 45 }]} >{premises.shadedRate}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 50 }]}>
                                        <Text style={[styles.premisesText, { width: 50 }]} >{premises.parkingRatio}</Text>

                                    </View>
                                </View>

                            ))}

                        </View>



                    </View>

                    <View style={styles.imagesSection}>

                        {selectedPropertyList[index].images!.slice(0,3).map((image, index) => (

                            <View style={styles.imagesContainer} >
                                <Image style={styles.image} src={cl.url(`${image}`, { width: 600, crop: "fit" })}></Image>
                            </View>

                        ))}



                    </View>




                </View>


            ))}

            <View fixed style={styles.footerSection}>

            </View>

        </Page>
    </Document>
);

export default SelectedPropertyListPDF