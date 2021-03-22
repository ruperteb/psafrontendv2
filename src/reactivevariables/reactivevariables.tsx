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
    suburb: undefined,
    region: undefined,
    province: undefined,
    buildingType: undefined,
    erfExtentMin: undefined,
    erfExtentMax: undefined,
    totalGLAMin: undefined,
    totalGLAMax: undefined,
    vacantGLAMin: undefined,
    vacantGLAMax: undefined,
    earliestOccMin: undefined,
    earliestOccMax: undefined,
    earliestExpMin: undefined,
    earliestExpMax: undefined,
    landlord: undefined,
  }


// Create the todos var and initialize it with the initial value
export const filterVariables = makeVar<FilterVariables>(
  filterVariablesInitialValues
);