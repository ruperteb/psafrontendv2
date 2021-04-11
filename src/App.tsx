import React from 'react';
import logo from './logo.svg';
import './App.css';


import {
  Stack, Text, Link, FontWeights, IComboBoxOption,
  IComboBox,
  SelectableOptionMenuItemType,
} from 'office-ui-fabric-react';
import { GET_PROPERTIES, GET_NAV_STATE, GET_DISTINCT_SUBURBS, GET_DISTINCT_REGIONS, GET_SELECTED_PROPERTIES , GET_PDF_VARIABLES, GET_LANDLORDS, GET_PROPERTY_LISTS, GET_FILTER_VARIABLES} from "./gql/gql"
import { Query, NavigationState, SelectedPropertyList, Landlord, PropertyList as SavedPropertyList } from "./schematypes/schematypes"
import { gql, useQuery, useApolloClient } from '@apollo/client';
import Loading from "./components/Loading"
import Navigation from "./components/Navigation"
import PropertyList from "./components/PropertyList"
import NewProperyModal from "./components/NewPropertyModal"
import SelectedPropertyPanel from "./components/SelectedPropertyPanel"
import SelectedPropertyListPanel from "./components/SelectedPropertyListPanel"
import PreviewPDFPanel from "./components/PreviewPDFPanel"
import ManageLandlordsPanel from "./components/ManageLandlordsPanel"
import SavedListsPanel from "./components/SavedListsPanel"
import FilterModal from "./components/FilterModal"
import {Cloudinary} from "cloudinary-core"
import { PDFViewer, PDFDownloadLink, Document, Page } from '@react-pdf/renderer';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;

function App() {


  var cl = new Cloudinary({cloud_name: CLOUD_NAME, secure: true});

  const [search, setSearch] = React.useState<string | undefined>("");


  const {
    data: propertyData,
    loading: propertyLoading,
    error: propertyError
  } = useQuery<Query>(GET_PROPERTIES);
  
  const {
    data: suburbData,
    loading: suburbLoading,
    error: suburbError
  } = useQuery<Query>(GET_DISTINCT_SUBURBS);

  const {
    data: regionData,
    loading: regionLoading,
    error: regionError
  } = useQuery<Query>(GET_DISTINCT_REGIONS);

  const {
    data: navigationStateData,
    loading: navigationLoading,
    error: navigationError
  } = useQuery<Query>(GET_NAV_STATE);

  const {
    data: pdfVariables,
    loading: pdfLoading,
    error: pdfError
  } = useQuery<Query>(GET_PDF_VARIABLES);

  const {
    data: propertyListData,
    loading: propertyListLoading,
    error: propertyListError
} = useQuery<Query>(GET_SELECTED_PROPERTIES);

const {
  data: filterData,
  loading: filterLoading,
  error: filterError
} = useQuery<Query>(GET_FILTER_VARIABLES);


var propertyIdList = propertyListData?.selectedPropertyList?.map((property) => {
  return property.propertyId
})

  /* if(suburbData !== undefined) */
  const suburbWC = suburbData?.distinctSuburbs!.filter((suburb) => {
    return (suburb.province === "WC")
  })

  const suburbWCFormatted = suburbWC?.map((suburb) => {
    return { key: `${suburb.suburb} ${suburb.province} `, text: suburb.suburb }
  })

  const suburbWCFilterFormatted = suburbWC?.map((suburb) => {
    return { value: suburb.suburb, label: suburb.suburb }
  })

  const suburbGau = suburbData?.distinctSuburbs!.filter((suburb) => {
    return (suburb.province === "GAU")
  })

  const suburbGauFormatted = suburbGau?.map((suburb) => {
    return { key: `${suburb.suburb} ${suburb.province} `, text: suburb.suburb }
  })

  const suburbGauFilterFormatted = suburbGau?.map((suburb) => {
    return { value: suburb.suburb, label: suburb.suburb }
  })

  const suburbKZN = suburbData?.distinctSuburbs!.filter((suburb) => {
    return (suburb.province === "KZN")
  })

  const suburbKZNFormatted = suburbKZN?.map((suburb) => {
    return { key: `${suburb.suburb} ${suburb.province} `, text: suburb.suburb }
  })

  const suburbKZNFilterFormatted = suburbKZN?.map((suburb) => {
    return { value: suburb.suburb, label: suburb.suburb }
  })

  const suburbOther = suburbData?.distinctSuburbs!.filter((suburb) => {
    return (suburb.province !== "KZN" && suburb.province !== "GAU" && suburb.province !== "WC")
  })

  const suburbOtherFormatted = suburbOther?.map((suburb) => {
    return { key: `${suburb.suburb} ${suburb.province} `, text: suburb.suburb }
  })

  const suburbOtherFilterFormatted = suburbOther?.map((suburb) => {
    return { value: suburb.suburb, label: suburb.suburb }
  })

  var distinctSuburbsOptions: IComboBoxOption[] = []
  if (suburbWCFormatted !== undefined && suburbGauFormatted !== undefined && suburbKZNFormatted !== undefined && suburbOtherFormatted !== undefined) {
    distinctSuburbsOptions = [
      { key: 'Header1', text: 'Western Cape', itemType: SelectableOptionMenuItemType.Header },
      ...suburbWCFormatted,
      { key: 'divider1', text: '-', itemType: SelectableOptionMenuItemType.Divider },
      { key: 'Header2', text: 'Gauteng', itemType: SelectableOptionMenuItemType.Header },
      ...suburbGauFormatted,
      { key: 'divider2', text: '-', itemType: SelectableOptionMenuItemType.Divider },
      { key: 'Header3', text: 'KwaZulu Natal', itemType: SelectableOptionMenuItemType.Header },
      ...suburbKZNFormatted,
      { key: 'divider3', text: '-', itemType: SelectableOptionMenuItemType.Divider },
      { key: 'Header4', text: 'Other Provinces', itemType: SelectableOptionMenuItemType.Header },
      ...suburbOtherFormatted
    ]
  }

  type FilterFormattedOptions = {
    value: string;
    label: string;
  }

  type DistinctSuburbFilterOptions = {
    label: string,
    options: FilterFormattedOptions[],
  }[]

  var distinctSuburbsFilterOptions: DistinctSuburbFilterOptions  = []
  if (suburbWCFormatted !== undefined && suburbGauFormatted !== undefined && suburbKZNFormatted !== undefined && suburbOtherFormatted !== undefined) {
    distinctSuburbsFilterOptions = [
      {
        label: 'Western Cape',
        options: suburbWCFilterFormatted!,
      },
      {
        label: 'Gauteng',
        options: suburbGauFilterFormatted!,
      },
      {
        label: 'KwaZulu Natal',
        options: suburbKZNFilterFormatted!,
      },
      {
        label: 'Other',
        options: suburbOtherFilterFormatted!,
      },
    ]
  }

  const regionWC = regionData?.distinctRegions!.filter((region) => {
    return (region.province === "WC")
  })

  const regionWCFormatted = regionWC?.map((region) => {
    return { key: `${region.region} ${region.province} `, text: region.region }
  })

  const regionWCFilterFormatted = regionWC?.map((region) => {
    return { value: region.region, label: region.region }
  })

  const regionGau = regionData?.distinctRegions!.filter((region) => {
    return (region.province === "Gau")
  })

  const regionGauFormatted = regionGau?.map((region) => {
    return { key: `${region.region} ${region.province} `, text: region.region }
  })

  const regionGauFilterFormatted = regionGau?.map((region) => {
    return { value: region.region, label: region.region }
  })

  const regionKZN = regionData?.distinctRegions!.filter((region) => {
    return (region.province === "KZN")
  })

  const regionKZNFormatted = regionKZN?.map((region) => {
    return { key: `${region.region} ${region.province} `, text: region.region }
  })

  const regionKZNFilterFormatted = regionKZN?.map((region) => {
    return { value: region.region, label: region.region }
  })

  const regionOther = regionData?.distinctRegions!.filter((region) => {
    return (region.province !== "KZN" && region.province !== "Gau" && region.province !== "WC")
  })

  const regionOtherFormatted = regionOther?.map((region) => {
    return { key: `${region.region} ${region.province} `, text: region.region }
  })

  const regionOtherFilterFormatted = regionOther?.map((region) => {
    return { value: region.region, label: region.region }
  })

  var distinctRegionsOptions: IComboBoxOption[] = []
  if (regionWCFormatted !== undefined && regionGauFormatted !== undefined && regionKZNFormatted !== undefined && regionOtherFormatted !== undefined) {
    distinctRegionsOptions = [
      { key: 'Header1', text: 'Western Cape', itemType: SelectableOptionMenuItemType.Header },
      ...regionWCFormatted,
      { key: 'divider1', text: '-', itemType: SelectableOptionMenuItemType.Divider },
      { key: 'Header2', text: 'Gauteng', itemType: SelectableOptionMenuItemType.Header },
      ...regionGauFormatted,
      { key: 'divider2', text: '-', itemType: SelectableOptionMenuItemType.Divider },
      { key: 'Header3', text: 'KwaZulu Natal', itemType: SelectableOptionMenuItemType.Header },
      ...regionKZNFormatted,
      { key: 'divider3', text: '-', itemType: SelectableOptionMenuItemType.Divider },
      { key: 'Header4', text: 'Other Provinces', itemType: SelectableOptionMenuItemType.Header },
      ...regionOtherFormatted
    ]
  }


  type DistinctRegionFilterOptions = {
    label: string,
    options: FilterFormattedOptions[],
  }[]

  var distinctRegionFilterOptions: DistinctRegionFilterOptions  = []
  if (regionWCFilterFormatted !== undefined && regionGauFilterFormatted !== undefined && regionKZNFilterFormatted !== undefined && regionOtherFormatted !== undefined) {
    distinctRegionFilterOptions = [
      {
        label: 'Western Cape',
        options: regionWCFilterFormatted!,
      },
      {
        label: 'Gauteng',
        options: regionGauFilterFormatted!,
      },
      {
        label: 'KwaZulu Natal',
        options: regionKZNFilterFormatted!,
      },
      {
        label: 'Other',
        options: regionOtherFilterFormatted!,
      },
    ]
  }



  const {
    data: landlordData,
    loading: landlordLoading,
    error: landlordError
} = useQuery<Query>(GET_LANDLORDS);

var landLordsList: Landlord[] = landlordData?.landlords!

const landlordsFormatted = landLordsList?.map((landlord) => {
  return { key: landlord.landlordName!, text: landlord.landlordName!, data: landlord }
})

const landlordsFilterFormatted = landLordsList?.map((landlord) => {
  return { value: landlord.landlordName!, label: landlord.landlordName! }
})

var landlordsOptions: IComboBoxOption[] = []

if(landlordsFormatted !== undefined) {
  landlordsOptions = [...landlordsFormatted]
}

var landlordsFilterOptions: FilterFormattedOptions[] = []

if(landlordsFilterFormatted !== undefined) {
  landlordsFilterOptions = [...landlordsFilterFormatted]
}

const {
  data: propertyListsData,
  loading: propertyListsLoading,
  error: propertyListsError
} = useQuery<Query>(GET_PROPERTY_LISTS);

var propertyLists: SavedPropertyList[] = propertyListsData?.propertyLists!
  
  var navigationState: NavigationState = {
    showNewPropertyModal: false,
    showUpdatePropertyModal:  false,
    showNewPremisesModal: false,
    showUpdatePremisesModal:  false,
    showDuplicatePremisesModal: false,
    showPremisesNotesModal: false,
    showPreviewPDFPanel: false,
    showFilterModal: false,
    showImageGalleryModal: false,
    selectedPropertyType: "all",
    search: "",
    showSelectedPropertyListPanel: false,
    showSelectedPropertyPanel: false,
    showManageLandlordsPanel: false,
    showSavedListsPanel: false,
    selectedPropertyId: 0,
    selectedPremisesId: 0,
  }

  if (navigationStateData !== undefined) {
    navigationState = navigationStateData!.navigationState!

  }

  var scrollBarWidth = /* document.body.offsetWidth - document.body.clientWidth */ 17;
  
  React.useEffect(()  => {

    if(navigationState.showSelectedPropertyPanel === true || navigationState.showManageLandlordsPanel === true || navigationState.showSavedListsPanel === true /* || navigationState.showSelectedPropertyListPanel === true */ ) {
        document.body.classList.add('selectedPropertyModal')
        document.body.style.marginRight = `${scrollBarWidth}px`;
    } else {
      document.body.classList.remove('selectedPropertyModal')
      document.body.style.marginRight = `${0}px`;
   }
    
  
  },[navigationState.showSelectedPropertyPanel, navigationState.showManageLandlordsPanel, navigationState.showSavedListsPanel, /* navigationState.showSelectedPropertyListPanel, */ scrollBarWidth]);

  

  if (propertyLoading) return <Loading></Loading>;
  if (navigationLoading) return <Loading></Loading>;
  if (propertyError) return <Loading></Loading>;



  return (
    <Stack
    id="main_stack"
      horizontalAlign="center"
      verticalAlign="start"
      
      styles={{
        root: {
          /*  width: '960px', */
          margin: '0 auto',
          textAlign: 'center',
          color: '#605e5c',
          overflowY: "hidden"
          /*   backgroundColor: "#b18c481a;" */
          /* marginTop: "100px" */
        }
      }}
      gap={15}
    >
      <Navigation selectedPropertyType={navigationState.selectedPropertyType} setSearch={setSearch} showSelectedPropertyListPanel={navigationState.showSelectedPropertyListPanel} showSavedListsPanel={navigationState.showSavedListsPanel} > </Navigation>
      <PropertyList propertyData={propertyData} search={search}></PropertyList>
      <NewProperyModal showNewPropertyModal={navigationState.showNewPropertyModal} distinctSuburbsOptions={distinctSuburbsOptions} distinctRegionsOptions={distinctRegionsOptions} landlordsOptions={landlordsOptions}></NewProperyModal>
      <SelectedPropertyPanel distinctSuburbsOptions={distinctSuburbsOptions} distinctRegionsOptions={distinctRegionsOptions} landlordsOptions={landlordsOptions}></SelectedPropertyPanel>
      <SelectedPropertyListPanel showSelectedPropertyListPanel={navigationState.showSelectedPropertyListPanel } propertyIdList={propertyIdList!}></SelectedPropertyListPanel>
      <PreviewPDFPanel showPreviewPDFPanel={navigationState.showPreviewPDFPanel} enquiryName={pdfVariables?.pdfVariables?.enquiryName!} agent={pdfVariables?.pdfVariables?.agent!} propertyIdList={propertyIdList!}></PreviewPDFPanel>
      <ManageLandlordsPanel showManageLandlordsPanel={navigationState.showManageLandlordsPanel} landLordsList={landLordsList}></ManageLandlordsPanel>
      <SavedListsPanel showSavedListsPanel={navigationState.showSavedListsPanel} propertyLists={propertyLists} propertyIdList={propertyIdList!}></SavedListsPanel>
      <FilterModal showFilterModal={navigationState.showFilterModal} distinctSuburbsFilterOptions={distinctSuburbsFilterOptions} distinctRegionFilterOptions={distinctRegionFilterOptions} landlordsFilterOptions={landlordsFilterOptions}></FilterModal>
    </Stack>


  );
}

export default App;
