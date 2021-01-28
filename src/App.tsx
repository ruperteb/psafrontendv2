import React from 'react';
import logo from './logo.svg';
import './App.css';


import {
  Stack, Text, Link, FontWeights, IComboBoxOption,
  IComboBox,
  SelectableOptionMenuItemType,
} from 'office-ui-fabric-react';
import { GET_PROPERTIES, GET_NAV_STATE, GET_DISTINCT_SUBURBS, GET_DISTINCT_REGIONS, GET_SELECTED_PROPERTIES , GET_PDF_VARIABLES, GET_LANDLORDS} from "./gql/gql"
import { Query, NavigationState, SelectedPropertyList, Landlord } from "./schematypes/schematypes"
import { gql, useQuery, useApolloClient } from '@apollo/client';
import Loading from "./components/Loading"
import Navigation from "./components/Navigation"
import PropertyList from "./components/PropertyList"
import NewProperyModal from "./components/NewPropertyModal"
import SelectedPropertyPanel from "./components/SelectedPropertyPanel"
import SelectedPropertyListPanel from "./components/SelectedPropertyListPanel"
import PreviewPDFPanel from "./components/PreviewPDFPanel"
import ManageLandlordsPanel from "./components/ManageLandlordsPanel"
import {Cloudinary} from "cloudinary-core"
import { PDFViewer, PDFDownloadLink, Document, Page } from '@react-pdf/renderer';

function App() {

  var cl = new Cloudinary({cloud_name: "drlfedqyz", secure: true});

 var image = cl.url("1567618101_fela1x", { width:200 , crop:"fit"})
 console.log(image)

  const [search, setSearch] = React.useState<string | undefined>('');


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

var propertyIdList = propertyListData?.selectedPropertyList?.map((property) => {
  return property.propertyId
})

var selectedPropertyList: SelectedPropertyList = propertyListData?.selectedPropertyList!


  console.log(suburbData)
  console.log(regionData)
  console.log(propertyData)

  console.log(navigationStateData)

  /* if(suburbData !== undefined) */
  const suburbWC = suburbData?.distinctSuburbs!.filter((suburb) => {
    return (suburb.province === "WC")
  })

  const suburbWCFormatted = suburbWC?.map((suburb) => {
    return { key: `${suburb.suburb} ${suburb.province} `, text: suburb.suburb }
  })

  const suburbGau = suburbData?.distinctSuburbs!.filter((suburb) => {
    return (suburb.province === "Gau")
  })

  const suburbGauFormatted = suburbGau?.map((suburb) => {
    return { key: `${suburb.suburb} ${suburb.province} `, text: suburb.suburb }
  })

  const suburbKZN = suburbData?.distinctSuburbs!.filter((suburb) => {
    return (suburb.province === "KZN")
  })

  const suburbKZNFormatted = suburbKZN?.map((suburb) => {
    return { key: `${suburb.suburb} ${suburb.province} `, text: suburb.suburb }
  })

  const suburbOther = suburbData?.distinctSuburbs!.filter((suburb) => {
    return (suburb.province !== "KZN" && suburb.province !== "Gau" && suburb.province !== "WC")
  })

  const suburbOtherFormatted = suburbOther?.map((suburb) => {
    return { key: `${suburb.suburb} ${suburb.province} `, text: suburb.suburb }
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

  const regionWC = regionData?.distinctRegions!.filter((region) => {
    return (region.province === "WC")
  })

  const regionWCFormatted = regionWC?.map((region) => {
    return { key: `${region.region} ${region.province} `, text: region.region }
  })

  const regionGau = regionData?.distinctRegions!.filter((region) => {
    return (region.province === "Gau")
  })

  const regionGauFormatted = regionGau?.map((region) => {
    return { key: `${region.region} ${region.province} `, text: region.region }
  })

  const regionKZN = regionData?.distinctRegions!.filter((region) => {
    return (region.province === "KZN")
  })

  const regionKZNFormatted = regionKZN?.map((region) => {
    return { key: `${region.region} ${region.province} `, text: region.region }
  })

  const regionOther = regionData?.distinctRegions!.filter((region) => {
    return (region.province !== "KZN" && region.province !== "Gau" && region.province !== "WC")
  })

  const regionOtherFormatted = regionOther?.map((region) => {
    return { key: `${region.region} ${region.province} `, text: region.region }
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

  console.log(distinctRegionsOptions)

  const {
    data: landlordData,
    loading: landlordLoading,
    error: landlordError
} = useQuery<Query>(GET_LANDLORDS);

var landLordsList: Landlord[] = landlordData?.landlords!

const landlordsFormatted = landLordsList?.map((landlord) => {
  return { key: landlord.landlordName!, text: landlord.landlordName!, data: landlord }
})
var landlordsOptions: IComboBoxOption[] = []

if(landlordsFormatted !== undefined) {
  landlordsOptions = [...landlordsFormatted]
}


  


  if (propertyLoading) return <Loading></Loading>;
  if (navigationLoading) return <Loading></Loading>;
  if (propertyError) return <h1>ERROR</h1>;

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
    showManageLandlordsPanel: false,
    selectedPropertyId: 0,
    selectedPremisesId: 0,
  }

  if (navigationStateData !== undefined) {
    navigationState = navigationStateData!.navigationState!

  }

  





  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="start"
      verticalFill
      styles={{
        root: {
          /*  width: '960px', */
          margin: '0 auto',
          textAlign: 'center',
          color: '#605e5c',
          /*   backgroundColor: "#b18c481a;" */
          /* marginTop: "100px" */
        }
      }}
      gap={15}
    >
      <Navigation selectedPropertyType={navigationState.selectedPropertyType} setSearch={setSearch} showSelectedPropertyListPanel={navigationState.showSelectedPropertyListPanel}  > </Navigation>
      <PropertyList propertyData={propertyData}></PropertyList>
      <NewProperyModal showNewPropertyModal={navigationState.showNewPropertyModal} distinctSuburbsOptions={distinctSuburbsOptions} distinctRegionsOptions={distinctRegionsOptions} landlordsOptions={landlordsOptions}></NewProperyModal>
      <SelectedPropertyPanel distinctSuburbsOptions={distinctSuburbsOptions} distinctRegionsOptions={distinctRegionsOptions}></SelectedPropertyPanel>
      <SelectedPropertyListPanel showSelectedPropertyListPanel={navigationState.showSelectedPropertyListPanel } propertyIdList={propertyIdList!}></SelectedPropertyListPanel>
      <PreviewPDFPanel showPreviewPDFPanel={navigationState.showPreviewPDFPanel} enquiryName={pdfVariables?.pdfVariables?.enquiryName!} agent={pdfVariables?.pdfVariables?.agent!} propertyIdList={propertyIdList!}></PreviewPDFPanel>
      <ManageLandlordsPanel showManageLandlordsPanel={navigationState.showManageLandlordsPanel} landLordsList={landLordsList}></ManageLandlordsPanel>
    
    
    </Stack>


  );
}

export default App;
