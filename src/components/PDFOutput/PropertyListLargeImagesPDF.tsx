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
        /*  margin: 5, */
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
        marginTop: 0,
        marginBottom: "auto",
    },
    primaryImage: {
        width: 600,
        height: 400,
        marginTop: 30,
        marginBottom: "auto"
    },
    premisesDetailsContainer: {
        display: "flex",
        flexDirection: "column",
        marginTop: 30,
        marginBottom: "auto",
        marginLeft: 20
        /*  height: 500 */
        /* width: 120 */
    },
    propertyNumberColumn: {
        display: "flex",
        flexDirection: "row",

        /*  marginTop: 0,
         marginBottom: "auto", */
        /*  marginLeft: 10,
         paddingTop: 4, */
        /* width: "10%", */
        /* borderStyle: "solid",
        borderWidth: 1, */
        /*    flexGrow: 1, */
    },
    secondaryPageContainer: {
        fontFamily: 'SegoeUI',
        display: "flex",
        flexDirection: "row",
        margin: 5,
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
    },
    secondaryImageContainers: {
        display: "flex",
        flexDirection: "row",
        /*  marginLeft: 20, */
        marginRight: "auto",
        marginLeft: "auto",
        marginTop: "auto",
        marginBottom: "auto",
    },
    secondaryImage: {
        width: 660,
        height: 440,
        marginTop: 13,
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
        marginTop: 10,
        marginLeft: 5,
        marginRight: 0,
        alignItems: "flex-start",
        width: 175
    },
    premisesInfoHeadings: {

        fontSize: 12,
        fontFamily: "SegoeUI",
        fontWeight: "bold",
        color: "black",

    },
    premisesInfoText: {
        marginLeft: 5,
        fontSize: 10,
        fontFamily: "SegoeUI",
        color: "black",
        paddingTop: 2

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
        paddingLeft: 6.95,
        paddingTop: 1.35,
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
        paddingLeft: 4.75,
        paddingTop: 2.15,
        "backgroundColor": '#20314b',
        color: "white",
        fontFamily: "SegoeUI",
        fontWeight: "bold",
    },

    propertyDetails: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        width: 125,
        marginBottom: 10,
        marginTop: 5,
        /* borderStyle: "solid",
        borderWidth: 1, */
        /*    flexGrow: 1, */
    },

    premisesDetailsHeading: {
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: 12,
        fontFamily: "SegoeUI",
        fontWeight: "bold",
        color: "black",
        marginTop: 10,
        marginBottom: 5
    },
    parkingDetailsHeading: {
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: 12,
        fontFamily: "SegoeUI",
        fontWeight: "bold",
        color: "black",
        marginTop: 10,
        marginBottom: 5
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
      /*   paddingLeft: 5,
        paddingRight: 5, */
        display: "flex",
        flexDirection: "column",
        /* borderBottomWidth: 1,
        borderBottomStyle: "solid", */
        /*  height: 35, */
        /*  height: "30px", */
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

const getParkingRowsLength = (premises: Premises[]) => {
    var count = 0
    if(premises.reduce((acc, premises) => {
        return acc + premises.openRate!
    }, 0) > 0 ) {
        count += 1
    }

    if(premises.reduce((acc, premises) => {
        return acc + premises.coveredRate!
    }, 0) > 0 ) {
        count += 1
    }

    if(premises.reduce((acc, premises) => {
        return acc + premises.shadedRate!
    }, 0) > 0 ) {
        count += 1
    }
    return count
}

const getParkingRowsOrder = (premises: Premises[], rowType: string) => {
    var parking = {covered: false, shaded: false, open: false}
    

    if(premises.reduce((acc, premises) => {
        return acc + premises.coveredRate!
    }, 0) > 0 ) {
        parking.covered = true
    } else {parking.covered = false}

    if(premises.reduce((acc, premises) => {
        return acc + premises.shadedRate!
    }, 0) > 0 ) {
        parking.shaded = true
    } else {parking.shaded = false}

    if(premises.reduce((acc, premises) => {
        return acc + premises.openRate!
    }, 0) > 0 ) {
        parking.open = true
    } else {parking.open = false}

    //true true true

    if(parking.covered === true && parking.shaded === true && parking.open === true && rowType === "covered" )
    return true

    if(parking.covered === true && parking.shaded === true && parking.open === true && rowType === "shaded" )
    return false

    if(parking.covered === true && parking.shaded === true && parking.open === true && rowType === "open" )
    return true

    //false true true

    if(parking.covered === false && parking.shaded === true && parking.open === true && rowType === "covered" )
    return true

    if(parking.covered === false && parking.shaded === true && parking.open === true && rowType === "shaded" )
    return true

    if(parking.covered === false && parking.shaded === true && parking.open === true && rowType === "open" )
    return false

    //false false true

    if(parking.covered === false && parking.shaded === false && parking.open === true && rowType === "covered" )
    return false

    if(parking.covered === false && parking.shaded === false && parking.open === true && rowType === "shaded" )
    return false

    if(parking.covered === false && parking.shaded === false && parking.open === true && rowType === "open" )
    return true

    //true false true

    if(parking.covered === true && parking.shaded === false && parking.open === true && rowType === "covered" )
    return true

    if(parking.covered === true && parking.shaded === false && parking.open === true && rowType === "shaded" )
    return false

    if(parking.covered === true && parking.shaded === false && parking.open === true && rowType === "open" )
    return false

    //true true false

    if(parking.covered === true && parking.shaded === true && parking.open === false && rowType === "covered" )
    return true

    if(parking.covered === true && parking.shaded === true && parking.open === false && rowType === "shaded" )
    return false

    if(parking.covered === true && parking.shaded === true && parking.open === false && rowType === "open" )
    return false

    //false true false

    if(parking.covered === false && parking.shaded === true && parking.open === false && rowType === "covered" )
    return false

    if(parking.covered === false && parking.shaded === true && parking.open === false && rowType === "shaded" )
    return true

    if(parking.covered === false && parking.shaded === true && parking.open === false && rowType === "open" )
    return false

    //true false false

    if(parking.covered === true && parking.shaded === false && parking.open === false && rowType === "covered" )
    return true

    if(parking.covered === true && parking.shaded === false && parking.open === false && rowType === "shaded" )
    return false

    if(parking.covered === true && parking.shaded === false && parking.open === false && rowType === "open" )
    return false


}


const getEarliestOccDate = (premises: Premises[]) => {


    var premisesByOccDates: Premises[] = []
    var date: Date = new Date()
    if (premises !== undefined) {
        premisesByOccDates = premises.slice().sort((a, b) => {
            return Date.parse(a.occupation) - Date.parse(b.occupation)
        });
    }

    if (premisesByOccDates[0] !== undefined) {
        date = new Date(premisesByOccDates[0].occupation)
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

const getLowestHighestEsc = (premises: Premises[]) => {


    var premisesByEsc: Premises[] = []
    var escPair: number[] = []
    if (premises !== undefined) {
        premisesByEsc = premises.slice().sort((a, b) => {
            return a.esc! - b.esc!
        });
    }

    if (premisesByEsc[0] !== undefined) {
        escPair = [premisesByEsc[0].esc!, premisesByEsc[premisesByEsc.length - 1].esc!]
    }
    return escPair
}

const getLowestHighestYard = (premises: Premises[]) => {
    var filteredPremises: Premises[] = []
    var premisesByYard: Premises[] = []
    var yardPair: number[] = []
    if (premises !== undefined) {

        filteredPremises = premises.filter((premises)=> {
            return premises.area !== 0 && premises.yard !== 0 
        })

        premisesByYard = filteredPremises.slice().sort((a, b) => {
            return a.yard! - b.yard!
        });
    }

    if (premisesByYard[0] !== undefined ) {
       
            yardPair = [premisesByYard[0].yard!, premisesByYard[premisesByYard.length - 1].yard!]
          
    } 
    if(yardPair[0] !== undefined) {
        return yardPair
    } else return [0,0]
    
}

const getLowestHighestHeight = (premises: Premises[]) => {

    var filteredPremises: Premises[] = []
    var premisesByHeight: Premises[] = []
    var heightPair: number[] = []
    if (premises !== undefined) {

        filteredPremises = premises.filter((premises)=> {
            return premises.area !== 0 && premises.height !== 0
        })

        premisesByHeight = filteredPremises.slice().sort((a, b) => {
            return a.height! - b.height!
        });
    }

    if (premisesByHeight[0] !== undefined) {
        heightPair = [premisesByHeight[0].height!, premisesByHeight[premisesByHeight.length - 1].height!]
    }
    if(heightPair[0] !== undefined) {
        return heightPair
    } else return [0,0]
}

const getLowestHighestDoors = (premises: Premises[]) => {

    var filteredPremises: Premises[] = []
    var premisesByDoors: Premises[] = []
    var doorPair: number[] = []
    if (premises !== undefined) {

        filteredPremises = premises.filter((premises)=> {
            return premises.area !== 0 && premises.doors !== 0
        })

        premisesByDoors = filteredPremises.slice().sort((a, b) => {
            return a.doors! - b.doors!
        });
    }

    if (premisesByDoors[0] !== undefined) {
        doorPair = [premisesByDoors[0].doors!, premisesByDoors[premisesByDoors.length - 1].doors!]
    }
    if(doorPair[0] !== undefined) {
        return doorPair
    } else return [0,0]
}

const getLoading = (premises: Premises[]) => {
    var filteredPremises: Premises[] = []
    var premisesByArea: Premises[] = []
    
    if (premises !== undefined) {

        filteredPremises = premises.filter((premises)=> {
            return premises.area !== 0 && premises.loading !== "" && premises.loading !== undefined
        })
        premisesByArea = filteredPremises.slice().sort((a, b) => {
            return a.area! - b.area!
        });
    }

   if(premisesByArea[premisesByArea.length - 1] !== undefined) {
    return premisesByArea[premisesByArea.length - 1].loading!
   } else { return ""}
    
}

const getSprinklered = (premises: Premises[]) => {
    var filteredPremises: Premises[] = []
    var premisesByArea: Premises[] = []
    
    if (premises !== undefined) {
        filteredPremises = premises.filter((premises)=> {
            return premises.area !== 0 && premises.sprinklered !== "" && premises.sprinklered !== undefined
        })
        premisesByArea = filteredPremises.slice().sort((a, b) => {
            return a.area! - b.area!
        });
    }

    if(premisesByArea[premisesByArea.length - 1] !== undefined) {
        return premisesByArea[premisesByArea.length - 1].sprinklered!
    } else { return ""}
    
}

const getCanopies = (premises: Premises[]) => {
    var filteredPremises: Premises[] = []
    var premisesByArea: Premises[] = []
    
    if (premises !== undefined) {
        filteredPremises = premises.filter((premises)=> {
            return premises.area !== 0 && premises.canopies !== "" && premises.canopies !== undefined
        })
        premisesByArea = filteredPremises.slice().sort((a, b) => {
            return a.area! - b.area!
        });
    }

    if(premisesByArea[premisesByArea.length - 1] !== undefined) {
        return premisesByArea[premisesByArea.length - 1].canopies!
    } else {return ""}
    
}

const getPower = (premises: Premises[]) => {
    var filteredPremises: Premises[] = []
    var premisesByArea: Premises[] = []
    
    if (premises !== undefined) {
        filteredPremises = premises.filter((premises)=> {
            return premises.area !== 0 && premises.power !== "" && premises.power !== undefined
        })
        premisesByArea = filteredPremises.slice().sort((a, b) => {
            return a.area! - b.area!
        });
    }

    if(premisesByArea[premisesByArea.length - 1] !== undefined) {
        return premisesByArea[premisesByArea.length - 1].power!
    } else {return ""}
   
}

const getImageLimit = (imageLimit:any, showImages: boolean) => {
    if(showImages === true) {
        if(isNaN(imageLimit) === false )  {
            return imageLimit
        }
    } else return 1
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

const getPropertyImages = (property: Property, showLocality: boolean, showAerial: boolean) => {

   var locality = property.locality!
   var aerial = property.aerial!
   var imagesArray = property.images!
   var combinedArray: string[] = []

    if (locality !== "" && locality !== null && locality !== undefined && showLocality !== false) {
        combinedArray = [locality]
    }
    if (aerial !== "" && aerial !== null && aerial !== undefined && showAerial !== false) {
        combinedArray = [...combinedArray, aerial]
    }
    combinedArray = [...combinedArray, ...imagesArray]

    return combinedArray

}

const getCustomTitle = (customTitle: string | null) => {

    if (customTitle === "") {
        return "Schedule of Accomodation:"
    } else return customTitle

}

const getType = (type:string) => {

if(type === "Warehouse") {
    return "W/H"
} else return type

}

const showIndFeatures =(buildingType:string, premisesList: Premises[]) => {
var showFeatures = false
if(buildingType === "Industrial") {
    if (getLowestHighestYard(premisesList)[0] !==0 || getLowestHighestHeight(premisesList)[0] !==0 || getLowestHighestDoors(premisesList)[0] !==0 || getLoading(premisesList) !== "" || getSprinklered(premisesList) !== "" || getCanopies(premisesList) !== "" || getPower(premisesList) !== "" ) {
        showFeatures = true
    } 
}
return showFeatures
}

const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME

interface Props {

    selectedPropertyList: SelectedPropertyList,
    enquiryName: string,
    customTitle: null | string
    agent: Agent,
    imageLimit: number | string,
    showLocality: boolean,
    showAerial: boolean,
    showImages: boolean,

    /* enquiryName: string */

}



const PropertyListLargeImagesPDF: React.FC<Props> = ({ selectedPropertyList, enquiryName, customTitle, agent, imageLimit, showImages, showLocality, showAerial }) => (







    <Document >

        <Page orientation="landscape" size="A4" style={styles.frontPage}>

            <Image style={styles.frontPageBackground} src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1610358103/background_2_duzy8o.jpg`}></Image>

            <Text style={styles.frontPageText1} >{getCustomTitle(customTitle)}</Text>
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


                <View /* minPresenceAhead={50} */ /* wrap={false} */ key={property.propertyId} style={styles.overallContainer}>

                    <View style={styles.initialPageContainer}>

                        <View style={styles.primaryImageContainer} >
                            {selectedPropertyList[index].images!.length !== 0 ? <Image style={styles.primaryImage} src={cl.url(`${getPropertyImages(property, showLocality, showAerial)[0]}`)}></Image> : <Image style={styles.primaryImage} src={cl.url("https://res.cloudinary.com/drlfedqyz/image/upload/v1610357447/background_eocbnx.jpg")}></Image>}
                        </View>

                        <View wrap={false} style={styles.premisesDetailsContainer}>


                            <View style={styles.propertyNumberColumn}>
                                <Text style={index < 9 ? styles.propertyNumber : styles.propertyNumber10plus}>{index + 1}</Text>
                                <Text style={styles.propertyHeading}>{property.propertyName}</Text>
                            </View>



                            <Text style={[styles.propertyText, { marginLeft: 20 }]}>{`${property.address}, ${property.suburb} `}</Text>







                            <Text style={styles.premisesDetailsHeading} >Premises Details</Text>


                            <View style={styles.premisesHeadings}>
                                <View style={[styles.premisesContainer, { width: 60 }]}>
                                    <Text style={[styles.premisesHeadingText, { textAlign: "left", marginLeft: 5 }]} >Floor/ Unit</Text>
                                    <Text style={styles.premisesHeadingSubText} ></Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={[styles.premisesHeadingText, /* { textAlign: "left", marginLeft: 5 } */]} >Type</Text>
                                    <Text style={styles.premisesHeadingSubText} ></Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={styles.premisesHeadingText} >Area</Text>
                                    <Text style={[styles.premisesHeadingSubText]}>m²</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 50 }]}>
                                    <Text style={styles.premisesHeadingText} >Gross Rental</Text>
                                    <Text style={[styles.premisesHeadingSubText]}>R/m²/month</Text>
                                </View>

                            </View>


                            {sortPremises(selectedPropertyList[index].premisesList!).map((premises, index) => (
                                <View style={index % 2 !== 0 ? styles.premisesDetails : [styles.premisesDetails, { backgroundColor: "#ede6e6" }]}>
                                    <View style={[styles.premisesContainer, { width: 60 }]}>
                                        <Text style={[styles.premisesText, { textAlign: "left", marginLeft: 5 }]} >{premises.floor}</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText, /* { textAlign: "left", marginLeft: 5 } */]} >{getType(premises.type!)}</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText]} >{premises.area}</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 50 }]}>
                                        <Text style={[styles.premisesText]} >{premises.grossRental}</Text>
                                    </View>


                                </View>


                            ))}

                            {selectedPropertyList[index].premisesList!.length>1?
                            <View style={(selectedPropertyList[index].premisesList!.length) % 2 !== 0 ? [styles.premisesDetails, {borderTop: 0.5}] : [styles.premisesDetails, { backgroundColor: "#ede6e6" , borderTop: 0.5}]}>
                                <View style={[styles.premisesContainer, { width: 60 }]}>
                                    {/*  <Text style={styles.premisesText} >{premises.floor}</Text> */}
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    {/*  <Text style={styles.premisesText} >{premises.floor}</Text> */}
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={[styles.premisesText]} > {selectedPropertyList[index].premisesList!.length !== 0 ?
                                        selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                            return acc + premises.area!
                                        }, 0) : 0
                                    } </Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 50 }]}>
                                    {/*  <Text style={[styles.premisesText, { width: 50 }]} >{premises.grossRental}</Text> */}
                                </View>
                            </View>: <Text></Text>}

                            <Text style={styles.parkingDetailsHeading} >Parking Details</Text>

                            <View style={styles.premisesHeadings}>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={[styles.premisesHeadingText, { textAlign: "left", marginLeft: 5 }]} >Type</Text>
                                    {<Text style={[styles.premisesHeadingSubText]} ></Text>}
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={[styles.premisesHeadingText]} >Bays</Text>
                                    <Text style={[styles.premisesHeadingSubText]}></Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={[styles.premisesHeadingText]} >Ratio</Text>
                                    <Text style={[styles.premisesHeadingSubText]}>bays/100m²</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 50 }]}>
                                    <Text style={[styles.premisesHeadingText]} >Avg Rate</Text>
                                    <Text style={[styles.premisesHeadingSubText]}>R/bay/month</Text>
                                </View>

                            </View>

                            {selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                return acc + premises.coveredRate!
                            }, 0) > 0 && property.buildingType !== "Industrial" ?
                                <View style={getParkingRowsOrder(selectedPropertyList[index].premisesList!,"covered")?[styles.premisesDetails, { backgroundColor: "#ede6e6" }]:[styles.premisesDetails]}>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText, { textAlign: "left", marginLeft: 5  }]} >Covered</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText]} >{selectedPropertyList[index].premisesList!.length !== 0 && selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                            return acc + premises.coveredBays!
                                        }, 0) > 0 ?
                                            selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                return acc + premises.coveredBays!
                                            }, 0).toFixed(0) : "-"
                                        }</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText]} >{selectedPropertyList[index].premisesList!.length !== 0 && selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                            return acc + premises.coveredBays!
                                        }, 0) > 0 ?
                                            (selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                return acc + premises.coveredBays!
                                            }, 0) / selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                return acc + premises.area!
                                            }, 0) * 100).toFixed(1) : "-"
                                        }</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 50 }]}>
                                        <Text style={[styles.premisesText]} >{selectedPropertyList[index].premisesList!.length !== 0 ?
                                            (selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                if (premises.coveredBays! === 0) {
                                                    return acc + premises.coveredRate!
                                                } else {
                                                    return acc + (premises.coveredRate! * premises.coveredBays!)
                                                }
                                            }, 0) / selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                if (premises.coveredBays! === 0) {
                                                    return acc + 1
                                                } else {
                                                    return acc + premises.coveredBays!
                                                }
                                            }, 0)).toFixed(2) : 0
                                        }</Text>
                                    </View>
                                </View> : <Text></Text>}

                            {selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                return acc + premises.shadedRate!
                            }, 0) > 0 && property.buildingType !== "Industrial" ?
                            <View style={getParkingRowsOrder(selectedPropertyList[index].premisesList!,"shaded")?[styles.premisesDetails, { backgroundColor: "#ede6e6" }]:[styles.premisesDetails]}>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText, { textAlign: "left", marginLeft: 5  }]} >Shaded</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText]} >{selectedPropertyList[index].premisesList!.length !== 0 && selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                            return acc + premises.shadedBays!
                                        }, 0) > 0 ?
                                            selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                return acc + premises.shadedBays!
                                            }, 0).toFixed(0) : "-"
                                        }</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText]} >{selectedPropertyList[index].premisesList!.length !== 0 && selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                            return acc + premises.shadedBays!
                                        }, 0) > 0 ?
                                            (selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                return acc + premises.shadedBays!
                                            }, 0) / selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                return acc + premises.area!
                                            }, 0) * 100).toFixed(1) : "-"
                                        }</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 50 }]}>
                                        <Text style={[styles.premisesText]} >{selectedPropertyList[index].premisesList!.length !== 0 ?
                                            (selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                if (premises.shadedBays! === 0) {
                                                    return acc + premises.shadedRate!
                                                } else {
                                                    return acc + (premises.shadedRate! * premises.shadedBays!)
                                                }
                                            }, 0) / selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                if (premises.shadedBays! === 0) {
                                                    return acc + 1
                                                } else {
                                                    return acc + premises.shadedBays!
                                                }
                                            }, 0)).toFixed(2) : 0
                                        }</Text>
                                    </View>
                                </View> : <Text></Text>}

                            {selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                return acc + premises.openRate!
                            }, 0) > 0 && property.buildingType !== "Industrial" ?
                            <View style={getParkingRowsOrder(selectedPropertyList[index].premisesList!,"open")?[styles.premisesDetails, { backgroundColor: "#ede6e6" }]:[styles.premisesDetails]}>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText, { textAlign: "left", marginLeft: 5  }]} >Open</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText]} >
                                            {selectedPropertyList[index].premisesList!.length !== 0 && selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                return acc + premises.openBays!
                                            }, 0) > 0 ?
                                                selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                    return acc + premises.openBays!
                                                }, 0).toFixed(0) : "-"
                                            }</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 40 }]}>
                                        <Text style={[styles.premisesText]} >{selectedPropertyList[index].premisesList!.length !== 0 && selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                            return acc + premises.openBays!
                                        }, 0) > 0 ?
                                            (selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                return acc + premises.openBays!
                                            }, 0) / selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                return acc + premises.area!
                                            }, 0) * 100).toFixed(1) : "-"
                                        }</Text>
                                    </View>
                                    <View style={[styles.premisesContainer, { width: 50 }]}>
                                        <Text style={[styles.premisesText]} >{selectedPropertyList[index].premisesList!.length !== 0 ?
                                            (selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                if (premises.openBays! === 0) {
                                                    return acc + premises.openRate!
                                                } else {
                                                    return acc + (premises.openRate! * premises.openBays!)
                                                }
                                            }, 0) / selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                                if (premises.openBays! === 0) {
                                                    return acc + 1
                                                } else {
                                                    return acc + premises.openBays!
                                                }
                                            }, 0)).toFixed(2) : 0
                                        }</Text>
                                    </View>
                                </View> : <Text></Text>}

                            {getParkingRowsLength(selectedPropertyList[index].premisesList!)>1? <View style={getParkingRowsLength(selectedPropertyList[index].premisesList!)!==3?[styles.premisesDetails, { backgroundColor: "#ede6e6", borderTop: 0.5 }]: [styles.premisesDetails, {borderTop: 0.5}]}>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={[styles.premisesText, { textAlign: "left", marginLeft: 5  }]} >Overall</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={[styles.premisesText]} >{selectedPropertyList[index].premisesList!.length !== 0 ?
                                        selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                            if (premises.openBays! === 0 && premises.shadedBays! === 0 && premises.coveredBays! === 0) {
                                                return acc + premises.parkingRatio! * (premises.area! / 100)
                                            } else {
                                                return acc + premises.openBays! + premises.shadedBays! + premises.coveredBays!
                                            }
                                        }, 0).toFixed(0) : 0
                                    }</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 40 }]}>
                                    <Text style={[styles.premisesText]} >{selectedPropertyList[index].premisesList!.length !== 0 ?
                                        (selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                            if (premises.openBays! === 0 && premises.shadedBays! === 0 && premises.coveredBays! === 0) {
                                                return acc + premises.parkingRatio! * (premises.area! / 100)
                                            } else {
                                                return acc + premises.openBays! + premises.shadedBays! + premises.coveredBays!
                                            }

                                        }, 0) / selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                            return acc + premises.area!
                                        }, 0) * 100).toFixed(1) : 0
                                    }</Text>
                                </View>
                                <View style={[styles.premisesContainer, { width: 50 }]}>
                                    <Text style={[styles.premisesText]} >{selectedPropertyList[index].premisesList!.length !== 0 && selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                        return acc + premises.openBays! + premises.shadedBays! + premises.coveredBays!
                                    }, 0) > 0 ?
                                        (selectedPropertyList[index].premisesList!.reduce((acc, premises) => {

                                            return acc + (premises.openRate! * premises.openBays!) + (premises.shadedRate! * premises.shadedBays!) + (premises.coveredRate! * premises.coveredBays!)
                                        }, 0) / selectedPropertyList[index].premisesList!.reduce((acc, premises) => {
                                            return acc + premises.openBays! + premises.shadedBays! + premises.coveredBays!
                                        }, 0)).toFixed(2) : "-"
                                    }</Text>
                                </View>
                            </View> : <Text></Text>}





                            <View>

                                <View style={[styles.premisesInfo, { marginTop: 20 }]}>
                                    <Text style={[styles.premisesInfoHeadings, { width: 75 }]}>Occupation:</Text>
                                    <Text style={styles.premisesInfoText}>{`${getEarliestOccDate(selectedPropertyList[index].premisesList!)} +`}
                                    </Text>

                                </View>

                                <View style={styles.premisesInfo}>
                                    <Text style={[styles.premisesInfoHeadings, { width: 75 }]}>Escalation:</Text>
                                    {getLowestHighestEsc(selectedPropertyList[index].premisesList!)[0] !== undefined ?
                                        <Text style={styles.premisesInfoText}>{getLowestHighestEsc(selectedPropertyList[index].premisesList!)[0] !== getLowestHighestEsc(selectedPropertyList[index].premisesList!)[1] ?
                                            `${getLowestHighestEsc(selectedPropertyList[index].premisesList!)[0]}% to ${getLowestHighestEsc(selectedPropertyList[index].premisesList!)[1]}% `
                                            : `${getLowestHighestEsc(selectedPropertyList[index].premisesList!)[0]}%`}
                                        </Text> : <Text></Text>}

                                </View>

                                {showIndFeatures(property.buildingType!, property.premisesList!) ? <View style={[styles.premisesInfo, { flexDirection: "column" }]}>
                                    <Text style={[styles.premisesInfoHeadings, { width: 75, marginLeft: 0 }]}>Features:</Text>

                                    <Text style={[styles.premisesInfoText, { marginLeft: 0, fontSize: 8 }]}>
                                        {getLowestHighestYard(selectedPropertyList[index].premisesList!)[0] !== getLowestHighestYard(selectedPropertyList[index].premisesList!)[1] || getLowestHighestYard(selectedPropertyList[index].premisesList!)[1] !== 0  ? 
                                        `• Yard Size: ${getLowestHighestYard(selectedPropertyList[index].premisesList!)[0] !== getLowestHighestYard(selectedPropertyList[index].premisesList!)[1] ?
                                            `${getLowestHighestYard(selectedPropertyList[index].premisesList!)[0]}m² to ${getLowestHighestYard(selectedPropertyList[index].premisesList!)[1]}m²`
                                            : `${getLowestHighestYard(selectedPropertyList[index].premisesList!)[0]}m²`} `: ""} 

                                         {getLowestHighestHeight(selectedPropertyList[index].premisesList!)[0] !== getLowestHighestHeight(selectedPropertyList[index].premisesList!)[1] || getLowestHighestHeight(selectedPropertyList[index].premisesList!)[1] !== 0  ? 
                                         `• Floor to Eave Height:  ${getLowestHighestHeight(selectedPropertyList[index].premisesList!)[0] !== getLowestHighestHeight(selectedPropertyList[index].premisesList!)[1] ?
                                            `${getLowestHighestHeight(selectedPropertyList[index].premisesList!)[0]}m to ${getLowestHighestHeight(selectedPropertyList[index].premisesList!)[1]}m`
                                            : `${getLowestHighestHeight(selectedPropertyList[index].premisesList!)[0]}m`} `: ""} 
                                            
                                            {getLowestHighestDoors(selectedPropertyList[index].premisesList!)[0] !== getLowestHighestDoors(selectedPropertyList[index].premisesList!)[1] || getLowestHighestDoors(selectedPropertyList[index].premisesList!)[1] !== 0   ? 
                                            `• Doors: ${getLowestHighestDoors(selectedPropertyList[index].premisesList!)[0] !== getLowestHighestDoors(selectedPropertyList[index].premisesList!)[1] ?
                                            `${getLowestHighestDoors(selectedPropertyList[index].premisesList!)[0]} to ${getLowestHighestDoors(selectedPropertyList[index].premisesList!)[1]}`
                                            : `${getLowestHighestDoors(selectedPropertyList[index].premisesList!)[0]}`} ` : ""}

                                            {getLoading(property.premisesList!) !== "" ? `• Loading Type: ${getLoading(property.premisesList!)} `  : ""}

                                            {getSprinklered(property.premisesList!) !== "" ? `• Sprinkler Type: ${getSprinklered(property.premisesList!)} `  : ""}

                                            {getCanopies(property.premisesList!) !== "" ? `• Canopy Details: ${getCanopies(property.premisesList!)} `  : ""}

                                            {getPower(property.premisesList!) !== "" ? `• Power: ${getPower(property.premisesList!)}`  : ""}
                                            
                                            </Text>


                                </View> : <Text></Text>}

                               

                                {property.notes !== "" ? <View style={[styles.premisesInfo, { flexDirection: "column" }]}>
                                    <Text style={[styles.premisesInfoHeadings, { width: 75, marginLeft: 0 }]}>Notes:</Text>

                                    <Text style={[styles.premisesInfoText, { marginLeft: 0, fontSize: 8 }]}>{property.notes}</Text>


                                </View> : <Text></Text>}

                            </View>


                        </View>


                    </View>

                    {imageLimit === "Any" ? getPropertyImages(property, showLocality, showAerial).slice(1).map((image) => (

                        <View style={styles.secondaryImageContainers} >
                            {selectedPropertyList[index].images!.length !== 0 ? <Image style={styles.secondaryImage} src={cl.url(`${image}`, /* { width: 600, crop: "fit" } */)}></Image> : <Text></Text>}
                        </View>

                    )) : 
                    getPropertyImages(property, showLocality, showAerial).slice(1, getImageLimit(imageLimit, showImages)).map((image) => (

                        <View style={styles.secondaryImageContainers} >
                            {selectedPropertyList[index].images!.length !== 0 ? <Image style={styles.secondaryImage} src={cl.url(`${image}`, /* { width: 600, crop: "fit" } */)}></Image> : <Text></Text>}
                        </View>

                    ))
                    }

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