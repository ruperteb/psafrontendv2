import { makeVar } from '@apollo/client';
import {NavigationState, SelectedPropertyList, PDFVariables, FilterVariables} from "../schematypes/schematypes"

// Create the initial value
const navigationStateInitialValues: NavigationState = 
  {
    showNewPropertyModal:  false,
    showUpdatePropertyModal:  false,
    showNewPremisesModal:  false,
    showUpdatePremisesModal:  false,
    showDuplicatePremisesModal: false,
    showPremisesNotesModal:  false,
    showImageGalleryModal: false,
    showPreviewPDFPanel: false,
    showManageLandlordsPanel: false,
    showSelectedPropertyPanel: false,
    showSavedListsPanel: false,
    showFilterModal: false,
    selectedPropertyType: "all",
    search: "",
    showSelectedPropertyListPanel: false,
    selectedPropertyId: 0,
    selectedPremisesId: 0,
  }


// Create the todos var and initialize it with the initial value
export const navigationState = makeVar<NavigationState>(
    navigationStateInitialValues
);

export const selectedPropertyList = makeVar<SelectedPropertyList>(
  []
);

const PDFVariablesInitiallState: PDFVariables = 
  {
    enquiryName: "",
    agent: {
      name: "",
      mobile: "",
      email: ""
    },
    customTitle: "",
    outputType: "Large Images",
    onlyShowVacant: true,
    showLocality: true,
    showAerial: true,
    showImages: true,
    imageLimit: "All",
  }


// Create the todos var and initialize it with the initial value
export const pdfVariables = makeVar<PDFVariables>(
  PDFVariablesInitiallState
);

const filterVariablesInitialValues: FilterVariables = 
  {
    suburb: [],
    region: [],
    province: [],
    buildingType: [],
    erfExtentMin: 0,
    erfExtentMax: 0,
    totalGLAMin: 0,
    totalGLAMax: 0,
    vacantGLAMin: 0,
    vacantGLAMax: 0,
    earliestOccMin: new Date("01/01/2020"),
    earliestOccMax: new Date("01/01/2020"),
    earliestExpMin: new Date("01/01/2020"),
    earliestExpMax: new Date("01/01/2020"),
    landlord: [],
  }


// Create the todos var and initialize it with the initial value
export const filterVariables = makeVar<FilterVariables>(
  filterVariablesInitialValues
);