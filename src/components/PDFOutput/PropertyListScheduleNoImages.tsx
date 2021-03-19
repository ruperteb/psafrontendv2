import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

import { Font } from '@react-pdf/renderer'
import SegoeUI from "../../assets/fonts/SegoeUI.ttf"
import SegoeUIBold from "../../assets/fonts/SegoeUIBold.ttf"

import { Premises, SelectedPropertyList, Agent } from "../../schematypes/schematypes"
import { Cloudinary } from "cloudinary-core"



var cl = new Cloudinary({ cloud_name: "drlfedqyz", secure: true });
var image = cl.url("1567618101_fela1x", { width: 600, crop: "fit" })
console.log(image)
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    frontPage: {
        flexDirection: 'column',
        backgroundColor: '#20314b',
    },
    contactPage: {
        flexDirection: 'column',
        backgroundColor: 'white',
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
    },
    footerSection: {
        display: "flex",
        flexDirection: "row",
        marginTop: "auto",
        marginBottom: 0

    },
    headerText: {
        margin: "auto",
        fontSize: 20,
        fontFamily: "SegoeUI",
        color: "white",
    },
    footerImageSection: {
        display: "flex",
        flexDirection: "row",
        "backgroundColor": '#1f304a',
        width: "100vw",
        height: "65px",
    },
    frontPageSection: {
        "backgroundColor": '#20314b',
    },
    frontPageBackground: {
        position: "absolute",
        top: 0,
        left: 0,
        width: '100vw',
        height: 'auto',
    },
    contactPageBackground: {
        position: "absolute",
        top: 88,
        left: 0,
        width: 245.7,
        height: 441,
    },
    frontPageText1: {
        fontSize: 30,
        fontFamily: "SegoeUI",
        fontWeight: "bold",
        color: "white",
        marginLeft: "40%",
        marginRight: "auto",
        marginTop: "20%",
    },
    frontPageText2: {
        fontSize: 30,
        fontFamily: "SegoeUI",
        fontWeight: "bold",
        color: "white",
        marginLeft: "40%",
        marginRight: "auto",
        marginTop: 10
    },
    contactPageText1: {
        fontSize: 18,
        fontFamily: "SegoeUI",
        color: "black",
        marginLeft: "40%",
        marginRight: "auto",
        marginTop: "15%",
        marginBottom: 10
    },
    contactPageText2: {
        fontSize: 24,
        fontFamily: "SegoeUI",
        fontWeight: "bold",
        color: "black",
        marginLeft: "40%",
        marginRight: "auto",
        marginTop: 10
    },
    contactPageText3: {
        fontSize: 12,
        fontFamily: "SegoeUI",
        color: "black",
        marginLeft: "30%",
        marginRight: "10%",
        marginBottom: 10,
        marginTop: 100
    },
    headerSection: {
        display: "flex",
        flexDirection: "row",
        "backgroundColor": '#20314b',
        width: "100vw",
        height: "65px",
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
    },
    footerImageStyles: {
        display: "flex",
        flexDirection: "row",
        marginLeft: "auto",
        marginRight: "auto",
    },
    pageNumbers: {
        position: "absolute",
        top: 15,
        right: 40,
        fontSize: 10,
        color: "white",
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
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 1.5,
    },
    propertyText: {
        fontSize: 10,
        color: "black",
        width: "100%",
        paddingLeft: 10,
    },
    propertyNumber: {

        fontSize: 12,
        borderStyle: "solid",
        height: 20,
        width: 20,
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft: 6.95,
        paddingTop: 1.4,
        "backgroundColor": '#20314b',
        color: "white",
        fontFamily: "SegoeUI",
        fontWeight: "bold",
    },
    propertyNumber10plus: {
        fontSize: 10,
        borderStyle: "solid",
        height: 20,
        width: 20,
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft: 4.65,
        paddingTop: 2.35,
        "backgroundColor": '#20314b',
        color: "white",
        fontFamily: "SegoeUI",
        fontWeight: "bold",
    },
    propertyNumberColumn: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: 10,
        paddingTop: 4,
    },
    propertyDetails: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        width: 110,
    },
    premisesDetailsContainer: {
        display: "flex",
        flexDirection: "column",
        marginLeft: 5
    },
    premisesHeadings: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        "backgroundColor": '#20314b',
    },
    premisesDetails: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    premisesContainer: {
        display: "flex",
        flexDirection: "column",
        borderLeft: 0.5,
        borderLeftStyle: "dotted",
        borderLeftColor: "black"
    },
    premisesContainerTotals: {
        display: "flex",
        flexDirection: "column",
    },
    premisesHeadingText: {
        fontSize: 10,
        marginTop: "auto",
        marginBottom: "auto",
        textAlign: 'center',
        color: "white",
    },
    premisesText: {
        fontSize: 8,
        marginTop: "auto",
        marginBottom: "auto",
        textAlign: 'center',
        height: 15,
        paddingTop:"2",
        paddingBottom: "2"
        
    },
    premisesHeadingSubText: {
        fontSize: 6,
        textAlign: 'center',
        height: 10,
        color: "white",
    },
    imagesContainer: {
        display: "flex",
        flexDirection: "row",
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

const getParkingRatio = (premises: Premises) => {

    var totalBays = premises.openBays! + premises.shadedBays! + premises.coveredBays!

    return (totalBays / (premises.area! / 100))
}

const getTotalArea = (premisesList: Premises[]) => {

    var totalArea = premisesList!.reduce((acc, premises) => {
        return acc + premises.area!
    }, 0)

    return totalArea
}

const getTotalOpenBays = (premisesList: Premises[]) => {

    var totalBays = premisesList!.reduce((acc, premises) => {
        return acc + premises.openBays!
    }, 0)

    return totalBays
}

const getTotalCoveredBays = (premisesList: Premises[]) => {

    var totalBays = premisesList!.reduce((acc, premises) => {
        return acc + premises.coveredBays!
    }, 0)

    return totalBays
}

const getTotalShadedBays = (premisesList: Premises[]) => {

    var totalBays = premisesList!.reduce((acc, premises) => {
        return acc + premises.shadedBays!
    }, 0)

    return totalBays
}

const getParkingRatioTotal = (premisesList: Premises[]) => {

    var totalBays = premisesList!.reduce((acc, premises) => {
        return acc + premises.openBays! + premises.shadedBays! + premises.coveredBays!
    }, 0)

    var totalArea = premisesList!.reduce((acc, premises) => {
        return acc + premises.area!
    }, 0)

    return (totalBays / (totalArea / 100))
}

const sortPremises = (premises: Premises[]) => {

    var indexSortedPremises = premises.slice().sort((a, b) => {
        return (a.premisesIndex!) - (b.premisesIndex!)
    });

    var floorSortedPremises = indexSortedPremises.slice().sort((a, b) => {
        var floorA = a.floor!.toUpperCase();
        var floorB = b.floor!.toUpperCase();
        if (floorA < floorB && a.premisesIndex=== b.premisesIndex) {
            return -1;
        }
        if (floorA > floorB && a.premisesIndex=== b.premisesIndex) {
            return 1;
        }
        return 0;
    });

    return floorSortedPremises
}

const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME

interface Props {

    selectedPropertyList: SelectedPropertyList,
    enquiryName: string,
    customTitle: null | string,
    agent: Agent,
    imageLimit: string | number,
    showImages: boolean

    /* enquiryName: string */

}


const PropertyListScheduleNoImages: React.FC<Props> = ({ selectedPropertyList, enquiryName, agent, imageLimit, showImages }) => (







    <Document >

        <Page orientation="landscape" size="A4" style={styles.frontPage}>

            <Image style={styles.frontPageBackground} src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1610358103/background_2_duzy8o.jpg`}></Image>

            <Text style={styles.frontPageText1} >Schedule of Accomodation:</Text>
            <Text style={styles.frontPageText2} >{enquiryName}</Text>



        </Page>
        <Page wrap orientation="landscape" size="A4" style={styles.page}>
            <View fixed style={styles.headerSection}>

                <Text style={styles.headerText}>Property Details</Text>




                <Text style={styles.pageNumbers} render={({ pageNumber, totalPages }) => (
                    `${pageNumber - 1} / ${totalPages - 2}`
                )} fixed />

            </View>
            <View fixed style={[styles.detailsSection, {marginTop: 10}]}>
                <View style={{width: 140}}>
                </View>
                <View style={styles.premisesDetailsContainer}>
                    <View style={styles.premisesHeadings}>
                        <View style={[styles.premisesContainer, { width: 40 }]}>
                            <Text style={styles.premisesHeadingText} >Floor/ Unit</Text>
                            <Text style={styles.premisesHeadingSubText} ></Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 40 }]}>
                            <Text style={[styles.premisesHeadingText]} >Area</Text>
                            <Text style={[styles.premisesHeadingSubText]}>m²</Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 30 }]}>
                            <Text style={styles.premisesHeadingText} >Type</Text>
                            <Text style={styles.premisesHeadingSubText} ></Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 55 }]}>
                            <Text style={[styles.premisesHeadingText]} >Occupation Date</Text>
                            <Text style={styles.premisesHeadingSubText} ></Text>
                        </View>

                        <View style={[styles.premisesContainer, { width: 45 }]}>
                            <Text style={[styles.premisesHeadingText]} >Net Rental</Text>
                            <Text style={[styles.premisesHeadingSubText]}>R/m²/month</Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 45 }]}>
                            <Text style={[styles.premisesHeadingText]} >Op Costs</Text>
                            <Text style={[styles.premisesHeadingSubText]}>R/m²/month</Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 45 }]}>
                            <Text style={[styles.premisesHeadingText]} >Other</Text>
                            <Text style={[styles.premisesHeadingSubText]}>R/m²/month</Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 45 }]}>
                            <Text style={[styles.premisesHeadingText]} >Gross Rental</Text>
                            <Text style={[styles.premisesHeadingSubText]}>R/m²/month</Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 30 }]}>
                            <Text style={[styles.premisesHeadingText]} >Esc</Text>
                            <Text style={[styles.premisesHeadingSubText]}>%</Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 40 }]}>
                            <Text style={[styles.premisesHeadingText]} >Open Bays</Text>
                            <Text style={[styles.premisesHeadingSubText]}></Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 45 }]}>
                            <Text style={[styles.premisesHeadingText]} >Open Rate</Text>
                            <Text style={[styles.premisesHeadingSubText]}>R/bay/month</Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 40 }]}>
                            <Text style={[styles.premisesHeadingText]} >Covered Bays</Text>
                            <Text style={[styles.premisesHeadingSubText]}></Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 45 }]}>
                            <Text style={[styles.premisesHeadingText]} >Covered Rate</Text>
                            <Text style={[styles.premisesHeadingSubText]}>R/bay/month</Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 40 }]}>
                            <Text style={[styles.premisesHeadingText]} >Shaded Bays</Text>
                            <Text style={[styles.premisesHeadingSubText]}></Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 45 }]}>
                            <Text style={[styles.premisesHeadingText]} >Shaded Rate</Text>
                            <Text style={[styles.premisesHeadingSubText]}>R/bay/month</Text>
                        </View>
                        <View style={[styles.premisesContainer, { width: 50, borderRight: 0.5, borderRightStyle: "dotted", borderRightColor: "black" }]}>
                            <Text style={[styles.premisesHeadingText]} >Parking Ratio</Text>
                            <Text style={[styles.premisesHeadingSubText]}>bays/100m²</Text>
                        </View>
                    </View>
                </View>
            </View>





            {selectedPropertyList.map((property, index) => (

                <View minPresenceAhead={60} wrap={false} key={property.propertyId} style={styles.overallContainer}>

                    <View style={styles.detailsSection}>

                        <View style={styles.propertyNumberColumn}>
                            <Text style={index < 9 ? styles.propertyNumber : styles.propertyNumber10plus}>{index + 1}</Text>
                        </View>

                        <View style={styles.propertyDetails}>
                            <Text style={styles.propertyHeading}>{property.propertyName}</Text>
                            <Text style={styles.propertyText}>{property.address}</Text>
                            <Text style={styles.propertyText}>{property.suburb}</Text>
                        </View>



                        <View style={styles.premisesDetailsContainer}>


                            {sortPremises(selectedPropertyList[index].premisesList!).map((premises, index) => (

                                <View style={index % 2 !== 0 ? styles.premisesDetails : [styles.premisesDetails, { backgroundColor: "#ede6e6" }]}>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText]} >{premises.floor}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText]} >{premises.area?.toFixed(2).replace(/[.,]00$/, "")}</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 30 }]}>
                                        <Text style={styles.premisesText} >{premises.type === "Warehouse" ? "W/H" : premises.type}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 55 }]}>
                                        <Text style={[styles.premisesText]} >
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
                                        <Text style={[styles.premisesText]} >{premises.netRental?.toFixed(2).replace(/[.,]00$/, "")}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 45 }]}>
                                        <Text style={[styles.premisesText]} >{premises.opCosts?.toFixed(2).replace(/[.,]00$/, "")}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 45 }]}>
                                        <Text style={[styles.premisesText]} >{premises.other?.toFixed(2).replace(/[.,]00$/, "")}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 45 }]}>
                                        <Text style={[styles.premisesText]} >{premises.grossRental?.toFixed(2).replace(/[.,]00$/, "")}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 30 }]}>
                                        <Text style={[styles.premisesText]} >{premises.esc?.toFixed(1).replace(/[.,]0$/, "")}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText]} >{premises.openBays?.toFixed(1).replace(/[.,]0$/, "")}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 45 }]}>
                                        <Text style={[styles.premisesText]} >{premises.openRate?.toFixed(2).replace(/[.,]00$/, "")}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText]} >{premises.coveredBays?.toFixed(1).replace(/[.,]0$/, "")}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 45 }]}>
                                        <Text style={[styles.premisesText]} >{premises.coveredRate?.toFixed(2).replace(/[.,]00$/, "")}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText]} >{premises.shadedBays?.toFixed(1).replace(/[.,]0$/, "")}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 45 }]}>
                                        <Text style={[styles.premisesText]} >{premises.shadedRate?.toFixed(2).replace(/[.,]00$/, "")}</Text>

                                    </View>
                                    <View style={[styles.premisesContainer, { width: 50, borderRight: 0.5, borderRightStyle: "dotted", borderRightColor: "black" }]}>
                                        <Text style={[styles.premisesText]} >{getParkingRatio(premises).toFixed(1).replace(/[.,]0$/, "")}</Text>

                                    </View>
                                </View>

                            ))}

                            {selectedPropertyList[index].premisesList!.length > 1 ? <View style={selectedPropertyList[index].premisesList!.length % 2 !== 0 ? [styles.premisesDetails, { borderTop: 0.5, borderTopColor: "black" }] : [styles.premisesDetails, { backgroundColor: "#ede6e6", borderTop: 0.5, borderTopColor: "black" }]}>
                                <View style={[styles.premisesContainerTotals, { width: 40 }]}>
                                    <Text style={[styles.premisesText]} ></Text>

                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 40 }]}>
                                    <Text style={[styles.premisesText, { borderLeft: 0.5, borderLeftStyle: "dotted", borderLeftColor: "black", borderRight: 0.5, borderRightStyle: "dotted", borderRightColor: "black" }]} >{getTotalArea(selectedPropertyList[index].premisesList!).toFixed(2).replace(/[.,]00$/, "")}</Text>
                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 30 }]}>
                                    <Text style={styles.premisesText} ></Text>

                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 55 }]}>
                                    <Text style={[styles.premisesText]} >
                                    </Text>

                                </View>

                                <View style={[styles.premisesContainerTotals, { width: 45 }]}>
                                    <Text style={[styles.premisesText]} ></Text>

                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 45 }]}>
                                    <Text style={[styles.premisesText]} ></Text>

                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 45 }]}>
                                    <Text style={[styles.premisesText]} ></Text>

                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 45 }]}>
                                    <Text style={[styles.premisesText]} ></Text>

                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 30 }]}>
                                    <Text style={[styles.premisesText]} ></Text>

                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 40 }]}>
                                    <Text style={[styles.premisesText, { borderLeft: 0.5, borderLeftStyle: "dotted", borderLeftColor: "black", borderRight: 0.5, borderRightStyle: "dotted", borderRightColor: "black" }]} >{getTotalOpenBays(selectedPropertyList[index].premisesList!).toFixed(1).replace(/[.,]0$/, "")}</Text>

                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 45 }]}>
                                    <Text style={[styles.premisesText]} ></Text>

                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 40 }]}>
                                    <Text style={[styles.premisesText, { borderLeft: 0.5, borderLeftStyle: "dotted", borderLeftColor: "black", borderRight: 0.5, borderRightStyle: "dotted", borderRightColor: "black" }]} >{getTotalCoveredBays(selectedPropertyList[index].premisesList!).toFixed(1).replace(/[.,]0$/, "")}</Text>

                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 45 }]}>
                                    <Text style={[styles.premisesText]} ></Text>

                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 40 }]}>
                                    <Text style={[styles.premisesText, { borderLeft: 0.5, borderLeftStyle: "dotted", borderLeftColor: "black", borderRight: 0.5, borderRightStyle: "dotted", borderRightColor: "black" }]} >{getTotalShadedBays(selectedPropertyList[index].premisesList!).toFixed(1).replace(/[.,]0$/, "")}</Text>

                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 45 }]}>
                                    <Text style={[styles.premisesText]} ></Text>

                                </View>
                                <View style={[styles.premisesContainerTotals, { width: 50 }]}>
                                    <Text style={[styles.premisesText, { borderLeft: 0.5, borderLeftStyle: "dotted", borderLeftColor: "black", borderRight: 0.5, borderRightStyle: "dotted", borderRightColor: "black" }]} >{getParkingRatioTotal(selectedPropertyList[index].premisesList!).toFixed(1).replace(/[.,]0$/, "")}</Text>

                                </View>
                            </View> : <Text></Text>}

                        </View>

                    </View>

                </View>
            ))}

            <View fixed style={styles.footerSection}>
                <View style={styles.footerImageSection}>
                    <Image style={styles.footerImageStyles} src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1610187102/EBLogoHeader_ypjyj5.jpg`}></Image>
                </View>
            </View>


        </Page>
        <Page orientation="landscape" size="A4" style={styles.contactPage}>
            <View fixed style={styles.headerSection}>

                <Text style={styles.headerText}>Contact</Text>


            </View>
            <Image style={styles.contactPageBackground} src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1610357459/lion_light_dptptx.jpg`}></Image>

            <Text style={styles.contactPageText1} >For further information, please contact:</Text>
            <Text style={styles.contactPageText2} >{agent !== undefined ? agent.name : ""}</Text>
            <Text style={styles.contactPageText2} >{agent !== undefined ? agent.mobile : ""}</Text>
            <Text style={styles.contactPageText2} >{agent !== undefined ? agent.email : ""}</Text>

            <Text style={styles.contactPageText3} >Whilst every effort has been made to ensure accuracy, no liability will be accepted for any errors or omissions and the prospective tenant/ purchaser is required to verify details prior to contract</Text>

            <View fixed style={styles.footerSection}>
                <View style={styles.footerImageSection}>
                    <Image style={styles.footerImageStyles} src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1610187102/EBLogoHeader_ypjyj5.jpg`}></Image>
                </View>
            </View>

        </Page>
    </Document>
);

export default PropertyListScheduleNoImages