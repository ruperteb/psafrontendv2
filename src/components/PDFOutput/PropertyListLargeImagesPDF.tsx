import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

import { Font } from '@react-pdf/renderer'
import SegoeUI from "../../assets/fonts/SegoeUI.ttf"
import SegoeUIBold from "../../assets/fonts/SegoeUIBold.ttf"

import { GET_SELECTED_PROPERTIES, GET_NAV_STATE, GET_DISTINCT_SUBURBS, GET_DISTINCT_REGIONS, UPDATE_IMAGES } from "../../gql/gql"
import { useMutation, useQuery } from '@apollo/client';
import { Mutation, MutationUpdatePropertyArgs, Query, NavigationState, Premises, SelectedPropertyList, Property, Agent } from "../../schematypes/schematypes"
import { navigationState as navigationStateVar, selectedPropertyList as selectedPropertyListVar } from "../../reactivevariables/reactivevariables"
import { Cloudinary } from "cloudinary-core"



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
    frontPage: {
        flexDirection: 'column',
        backgroundColor: '#20314b',
        /* borderStyle: "solid",
        borderWidth: 2, */
        /* margin: "10px" */

    },
    contactPage: {
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

    initialPageContainer: {
        fontFamily: 'SegoeUI',
        display: "flex",
        flexDirection: "row",
        margin: 5,
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
    },
    primaryImageContainer: {
        display: "flex",
        flexDirection: "row",
        /*  marginLeft: 20, */
        marginRight: 0,
        marginLeft: 20,
        marginTop: "auto",
        marginBottom: "auto",
    },
    primaryImage: {
        width: 600,
        height: 400,
        marginTop: 25,
        marginBottom: "auto"
    },
    /*  detailsSection: {
         fontFamily: 'SegoeUI',
         display: "flex",
         flexDirection: "row",
         margin: 5,
         marginLeft: "auto",
         marginRight: "auto",
 
 
         width: "100%",
         
     }, */
    premisesInfo: {
        fontFamily: 'SegoeUI',
        display: "flex",
        flexDirection: "row",

        marginLeft: 10,
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
        /*  display: "flex",
         flexDirection: "row", */
        "backgroundColor": '#20314b',
        /* width: "100vw",
        height: "auto", */
    },
    frontPageBackground: {
        /*  display: "flex",
         flexDirection: "row", */
        /*  "backgroundColor": '#20314b', */

        position: "absolute",
        top: 0,
        left: 0,
        width: '100vw',
        height: 'auto',

        /*  marginTop: "auto",
         marginBottom: "auto", */
        /* "backgroundColor": '#20314b', */


    },
    contactPageBackground: {
        /*  display: "flex",
         flexDirection: "row", */
        /*  "backgroundColor": '#20314b', */

        position: "absolute",
        top: 88,
        left: 0,
        width: 245.7,
        height: 441,

        /*  marginTop: "auto",
         marginBottom: "auto", */
        /* "backgroundColor": '#20314b', */


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
        /* fontWeight: "bold", */
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
        /* fontWeight: "bold", */
        color: "black",
        marginLeft: "30%",
        marginRight: "10%",
        marginBottom: 10,
        marginTop: 100
    },
    headerSection: {
        /* position: 'absolute',
        bottom: 0,
        left: 0, */
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
        top: 20,
        right: 20,
        fontSize: 8,
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
        /*  width: 125, */
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
        paddingTop: 1.5,
        "backgroundColor": '#20314b',
        color: "white",
        fontFamily: "SegoeUI",
        fontWeight: "bold",
    },
    propertyNumberColumn: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        /*  marginLeft: 10,
         paddingTop: 4, */
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
        marginTop: 25,
        marginLeft: 10,
        /* width: 120 */
    },



    premisesHeadings: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        /*  width: "25%", */
        borderStyle: "solid",
        borderWidth: 1,
        /*    flexGrow: 1, */
        "backgroundColor": '#20314b',
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
        color: "white",
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
        color: "white",
    },
    imagesContainer: {
        display: "flex",
        flexDirection: "row",
        /*  marginLeft: 20, */
        marginRight: 40,


    },
    /*  image: {
         width: 200,
 
 
     }, */


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
    enquiryName: string,
    agent: Agent,

    /* enquiryName: string */

}



const PropertyListLargeImagesPDF: React.FC<Props> = ({ selectedPropertyList, enquiryName, agent }) => (







    <Document >

        <Page orientation="landscape" size="A4" style={styles.frontPage}>

            <Image style={styles.frontPageBackground} src="https://res.cloudinary.com/drlfedqyz/image/upload/v1610358103/background_2_duzy8o.jpg"></Image>

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






            {selectedPropertyList.map((property, index) => (


                <View /* minPresenceAhead={50} */ wrap={false} key={property.propertyId} style={styles.overallContainer}>

                    <View style={styles.initialPageContainer}>

                        <View style={styles.primaryImageContainer} >
                            {selectedPropertyList[index].images!.length !== 0 ? <Image style={styles.primaryImage} src={cl.url(`${selectedPropertyList[index].images![0]}`, /* { width: 600, crop: "fit" } */)}></Image> : <Text></Text>}
                        </View>

                        <View style={styles.premisesDetailsContainer}>
                            <View>

                                <View style={styles.propertyNumberColumn}>
                                    <Text style={styles.propertyNumber}>{index + 1}</Text>
                                    <Text style={styles.propertyHeading}>{property.propertyName}</Text>
                                </View>

                                <View style={styles.propertyDetails}>



                                    <Text style={[styles.propertyText, { marginLeft: 20 }]}>{`${property.address}, ${property.suburb} `}</Text>



                                </View>

                            </View>


                            <View style={styles.premisesHeadings}>
                                <View style={[styles.premisesContainer, { width: 80 }]}>
                                    <Text style={[styles.premisesHeadingText, { width: 80, textAlign: "left" }]} >Floor/ Unit</Text>
                                    <Text style={styles.premisesHeadingSubText} ></Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={styles.premisesHeadingText} >Area</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 40 }]}>m²</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 50 }]}>
                                    <Text style={styles.premisesHeadingText} >Gross Rental</Text>
                                    <Text style={[styles.premisesHeadingSubText, { width: 50 }]}>R/m²/month</Text>
                                </View>



                            </View>


                            {selectedPropertyList[index].premisesList!.map((premises, index) => (
                                <View style={index % 2 !== 0 ? styles.premisesDetails : [styles.premisesDetails, { backgroundColor: "#ede6e6" }]}>
                                    <View style={[styles.premisesContainer, { width: 80 }]}>
                                        <Text style={styles.premisesText} >{premises.floor}</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText, { width: 40 }]} >{premises.area}</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 50 }]}>
                                        <Text style={[styles.premisesText, { width: 50 }]} >{premises.grossRental}</Text>
                                    </View>


                                </View>


                            ))}

                            <View style={selectedPropertyList.length % 2 === 0 ? styles.premisesDetails : [styles.premisesDetails, { backgroundColor: "#ede6e6" }]}>
                                <View style={[styles.premisesContainer, { width: 80 }]}>
                                    {/*  <Text style={styles.premisesText} >{premises.floor}</Text> */}
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={[styles.premisesText, { width: 40 }]} > {selectedPropertyList[index].premisesList!.length !== 0 ?
                                        selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                            return acc + premises.area!
                                        }, 0) : 0
                                    } </Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 50 }]}>
                                    {/*  <Text style={[styles.premisesText, { width: 50 }]} >{premises.grossRental}</Text> */}
                                </View>


                            </View>


                            <View>

                                <View style={styles.premisesInfo}>
                                    <Text>Occupation:</Text>
                                    <Text>sdadadaw</Text>

                                </View>

                            </View>


                        </View>


                    </View>










                </View>
















                /*   <View minPresenceAhead={50} wrap={false} key={property.propertyId} style={styles.overallContainer}>
  
                      <View style={styles.detailsSection}>
  
                          <View style={styles.propertyNumberColumn}>
                              <Text style={styles.propertyNumber}>{index + 1}</Text>
                          </View>
  
                          <View style={styles.propertyDetails}>
  
  
                              <Text style={styles.propertyHeading}>{property.propertyName}</Text>
                              <Text style={styles.propertyText}>{property.address}</Text>
                              <Text style={styles.propertyText}>{property.suburb}</Text>
                        
  
  
  
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
  
                                  <View style={index % 2 !== 0 ? styles.premisesDetails : [styles.premisesDetails, { backgroundColor: "#ede6e6" }]}>
                                      <View style={[styles.premisesContainer, { width: 40 }]}>
                                          <Text style={styles.premisesText} >{premises.floor}</Text>
  
                                      </View>
                                      <View style={[styles.premisesContainer, { width: 40 }]}>
                                          <Text style={[styles.premisesText, { width: 40 }]} >{premises.area}</Text>
  
                                      </View>
                                    
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
  
                          {selectedPropertyList[index].images!.slice(0, 3).map((image, index) => (
  
                              <View style={styles.imagesContainer} >
                                  <Image style={styles.image} src={cl.url(`${image}`, { width: 600, crop: "fit" })}></Image>
                              </View>
  
                          ))}
  
  
  
                      </View>
  
  
  
  
                  </View> */


            ))}
            <View fixed style={styles.footerSection}>
                <View style={styles.footerImageSection}>
                    <Image style={styles.footerImageStyles} src="https://res.cloudinary.com/drlfedqyz/image/upload/v1610187102/EBLogoHeader_ypjyj5.jpg"></Image>
                </View>
            </View>


        </Page>
        <Page orientation="landscape" size="A4" style={styles.contactPage}>
            <View fixed style={styles.headerSection}>

                <Text style={styles.headerText}>Contact</Text>


            </View>
            <Image style={styles.contactPageBackground} src="https://res.cloudinary.com/drlfedqyz/image/upload/v1610357459/lion_light_dptptx.jpg"></Image>

            <Text style={styles.contactPageText1} >For further information, please contact:</Text>
            <Text style={styles.contactPageText2} >{agent !== undefined ? agent.name : ""}</Text>
            <Text style={styles.contactPageText2} >{agent !== undefined ? agent.mobile : ""}</Text>
            <Text style={styles.contactPageText2} >{agent !== undefined ? agent.email : ""}</Text>

            <Text style={styles.contactPageText3} >Whilst every effort has been made to ensure accuracy, no liability will be accepted for any errors or omissions and the prospective tenant/ purchaser is required to verify details prior to contract</Text>

            <View fixed style={styles.footerSection}>
                <View style={styles.footerImageSection}>
                    <Image style={styles.footerImageStyles} src="https://res.cloudinary.com/drlfedqyz/image/upload/v1610187102/EBLogoHeader_ypjyj5.jpg"></Image>
                </View>
            </View>

        </Page>
    </Document>
);

export default PropertyListLargeImagesPDF