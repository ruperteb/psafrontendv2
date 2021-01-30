import { gql } from '@apollo/client';

export const GET_PROPERTIES = gql`
    
    query{
  properties {
    propertyId
    propertyName
    address
      suburb
    coordinates
      earliestOccupation
      earliestExpiry
      erfExtent
      totalGLA
      vacantArea
      buildingType
      province
      region
      notes
      images
    premisesList{
      premisesId
      floor
      area
      vacant
      type
      premisesIndex
      occupation
      premisesNotes
      netRental
      opCosts
      other
      grossRental
      esc
      openBays
      openRate
      coveredBays
      coveredRate
      shadedBays
      shadedRate
      parkingRatio
      tenantName
      leaseExpiry
      tenantNotes
      yard
      height
      doors
      loading
      sprinklered
      canopies
      power
    }
    contact{
      name
      email
      mobileNo
      officeNo
      landlordName{
        landlordName
      }
    }
  }
}
    `

export const GET_SINGLE_PROPERTY = gql`
  query SingleProperty (
  $propertyId: Int!,
      ) {
        singleProperty (
  propertyId: $propertyId,
) {
  propertyId
    propertyName
    address
      suburb
    coordinates
      earliestOccupation
      earliestExpiry
      erfExtent
      totalGLA
      vacantArea
      buildingType
      province
      region
      notes
      images
    premisesList{
      premisesId
      floor
      area
      vacant
      type
      premisesIndex
      occupation
      premisesNotes
      netRental
      opCosts
      other
      grossRental
      esc
      openBays
      openRate
      coveredBays
      coveredRate
      shadedBays
      shadedRate
      parkingRatio
      tenantName
      leaseExpiry
      tenantNotes
      yard
      height
      doors
      loading
      sprinklered
      canopies
      power
    }
    contact{
      contactId
      name
      email
      mobileNo
      officeNo
      landlordName{
        landlordName
        landlordId
        contactsList{
          contactId
          name
          email
          mobileNo
          officeNo
        }

      }
    }
}
  }
`;

export const GET_MULTI_PROPERTY = gql`
  query MultiProperty (
  $propertyIdList: [Int],
      ) {
        multiProperty (
  propertyIdList: $propertyIdList,
) {
  propertyId
    propertyName
    address
      suburb
    coordinates
      earliestOccupation
      earliestExpiry
      erfExtent
      totalGLA
      vacantArea
      buildingType
      province
      region
      notes
      images
    premisesList{
      premisesId
      floor
      area
      vacant
      type
      premisesIndex
      occupation
      premisesNotes
      netRental
      opCosts
      other
      grossRental
      esc
      openBays
      openRate
      coveredBays
      coveredRate
      shadedBays
      shadedRate
      parkingRatio
      tenantName
      leaseExpiry
      tenantNotes
      yard
      height
      doors
      loading
      sprinklered
      canopies
      power
    }
    contact{
      name
      email
      mobileNo
      officeNo
      landlordName{
        landlordName
      }
    }
}
  }
`;

export const GET_NAV_STATE = gql`
  query GetNavigationState {
    navigationState @client { 
        showNewPropertyModal
        showUpdatePropertyModal
        showNewPremisesModal
        showUpdatePremisesModal
        showDuplicatePremisesModal
        showPremisesNotesModal
        showImageGalleryModal
        showPreviewPDFPanel
        showManageLandlordsPanel
        showSelectedPropertyPanel
  showFilterModal
  selectedPropertyType
  search
  showSelectedPropertyListPanel
  selectedPropertyId
  selectedPremisesId
    }
  }
  `

export const GET_SELECTED_PROPERTIES = gql`
query GetSelectedProperties {
  selectedPropertyList @client { 
    propertyId
    propertyName
    address
      suburb
    coordinates
      earliestOccupation
      earliestExpiry
      erfExtent
      totalGLA
      vacantArea
      buildingType
      province
      region
      notes
      images
    premisesList{
      premisesId
      floor
      area
      vacant
      type
      premisesIndex
      occupation
      premisesNotes
      netRental
      opCosts
      other
      grossRental
      esc
      openBays
      openRate
      coveredBays
      coveredRate
      shadedBays
      shadedRate
      parkingRatio
      tenantName
      leaseExpiry
      tenantNotes
      yard
      height
      doors
      loading
      sprinklered
      canopies
      power
    }
  }
}
`

export const NEW_PROPERTY = gql`
  mutation PostProperty (

 

  $propertyName: String!,
  $address: String,
  $suburb: String,
  $coordinates: String,
  $earliestOccupation: DateTime,
  $earliestExpiry: DateTime,
  $erfExtent: Float,
  $totalGLA: Float,
  $vacantArea: Float,
  $buildingType: String,
  $province: String,
  $region: String,
  $notes: String,

  $contactId: Int,
      ) {

    postProperty (

  

  propertyName: $propertyName,
  address: $address,
  suburb: $suburb,
  coordinates: $coordinates,
  earliestOccupation: $earliestOccupation,
  earliestExpiry: $earliestExpiry,
  erfExtent: $erfExtent,
  totalGLA: $totalGLA,
  vacantArea: $vacantArea,
  buildingType: $buildingType,
  province: $province,
  region: $region,
  notes: $notes,

  contactId: $contactId,

) {
  propertyId
}
  }
`;

export const UPDATE_PROPERTY = gql`
  mutation UpdateProperty (
  $contactId: Int,

  $propertyId: Int!,
  $propertyName: String,
  $address: String,
  $suburb: String,
  $coordinates: String,
  $earliestOccupation: DateTime,
  $earliestExpiry: DateTime,
  $erfExtent: Float,
  $totalGLA: Float,
  $vacantArea: Float,
  $buildingType: String,
  $province: String,
  $region: String,
  $notes: String,
      ) {

    updateProperty (
  contactId: $contactId,

  propertyId: $propertyId,
  propertyName: $propertyName,
  address: $address,
  suburb: $suburb,
  coordinates: $coordinates,
  earliestOccupation: $earliestOccupation,
  earliestExpiry: $earliestExpiry,
  erfExtent: $erfExtent,
  totalGLA: $totalGLA,
  vacantArea: $vacantArea,
  buildingType: $buildingType,
  province: $province,
  region: $region,
  notes: $notes,

) {
  propertyId
}
  }
`;

export const UPDATE_COORDINATES = gql`
  mutation UpdateProperty (
  $propertyId: Int!,
  $coordinates: String,
  
      ) {

    updateProperty (
    propertyId: $propertyId,
    coordinates: $coordinates,
) {
  propertyId
}
  }
`;

export const UPDATE_IMAGES = gql`
  mutation UpdateProperty (
  $propertyId: Int!,
  $images: [String],
  
      ) {

    updateProperty (
    propertyId: $propertyId,
    images: $images,
) {
  propertyId
    propertyName
    address
      suburb
    coordinates
      earliestOccupation
      earliestExpiry
      erfExtent
      totalGLA
      vacantArea
      buildingType
      province
      region
      notes
      images
    premisesList{
      premisesId
      floor
      area
      vacant
      type
      premisesIndex
      occupation
      premisesNotes
      netRental
      opCosts
      other
      grossRental
      esc
      openBays
      openRate
      coveredBays
      coveredRate
      shadedBays
      shadedRate
      parkingRatio
      tenantName
      leaseExpiry
      tenantNotes
      yard
      height
      doors
      loading
      sprinklered
      canopies
      power
    }
}
  }
`;

export const DELETE_PROPERTY = gql`
  mutation DeleteProperty (
  $propertyId: Int!,
      ) {
    deleteProperty (
  propertyId: $propertyId,
) {
  propertyId
}
  }
`;

export const GET_DISTINCT_SUBURBS = gql`
    
    query{
  distinctSuburbs {
    suburb
    province
  }
}
    `

export const GET_DISTINCT_REGIONS = gql`
    
query{
distinctRegions {
region
province
}
}
`

export const DELETE_PREMISES = gql`
  mutation DeleteProperty (
  $premisesId: Int!,
      ) {
    deletePremises (
      premisesId: $premisesId,
) {
  premisesId
}
  }
`;

export const GET_PREMISES = gql`
    
    query{
  
    premisesList{
      premisesId
      floor
      area
      vacant
      type
      premisesIndex
      occupation
      premisesNotes
      netRental
      opCosts
      other
      grossRental
      esc
      openBays
      openRate
      coveredBays
      coveredRate
      shadedBays
      shadedRate
      parkingRatio
      tenantName
      leaseExpiry
      tenantNotes
      yard
      height
      doors
      loading
      sprinklered
      canopies
      power
    }
  }

    `

export const NEW_PREMISES = gql`
  mutation PostPremises (

  $propertyId: Int!,
  $floor: String,
  $area: Float,
  $vacant: String,
  $type: String,
  $premisesIndex: Int,
  $occupation: DateTime,
  $premisesNotes: String,
  $netRental: Float,
  $opCosts: Float,
  $other: Float,
  $grossRental: Float,
  $esc: Float,
  $openBays: Float,
  $openRate: Float,
  $coveredBays: Float,
  $coveredRate: Float,
  $shadedBays: Float,
  $shadedRate: Float,
  $parkingRatio: Float,
  $tenantName: String,
  $leaseExpiry: DateTime,
  $tenantNotes: String,
  $yard: Float,
  $height: Float,
  $doors: Float,
  $loading: String,
  $sprinklered: String,
  $canopies: String,
  $power: String,

      ) {

    postPremises (

  propertyId: $propertyId,
  floor: $floor,
  area: $area,
  vacant: $vacant,
  type: $type,
  premisesIndex: $premisesIndex,
  occupation: $occupation,
  premisesNotes: $premisesNotes,
  netRental: $netRental,
  opCosts: $opCosts,
  other: $other,
  grossRental: $grossRental,
  esc: $esc,
  openBays: $openBays,
  openRate: $openRate,
  coveredBays: $coveredBays,
  coveredRate: $coveredRate,
  shadedBays: $shadedBays,
  shadedRate: $shadedRate,
  parkingRatio: $parkingRatio,
  tenantName: $tenantName,
  leaseExpiry: $leaseExpiry,
  tenantNotes: $tenantNotes,
  yard: $yard,
  height: $height,
  doors: $doors,
  loading: $loading,
  sprinklered: $sprinklered,
  canopies: $canopies,
  power: $power,



) {
 
  premisesId
  floor
  area
}
  }
`;

export const UPDATE_PREMISES = gql`
  mutation UpdatePremises (

  $premisesId: Int!,
  $floor: String,
  $area: Float,
  $vacant: String,
  $type: String,
  $premisesIndex: Int,
  $occupation: DateTime,
  $premisesNotes: String,
  $netRental: Float,
  $opCosts: Float,
  $other: Float,
  $grossRental: Float,
  $esc: Float,
  $openBays: Float,
  $openRate: Float,
  $coveredBays: Float,
  $coveredRate: Float,
  $shadedBays: Float,
  $shadedRate: Float,
  $parkingRatio: Float,
  $tenantName: String,
  $leaseExpiry: DateTime,
  $tenantNotes: String,
  $yard: Float,
  $height: Float,
  $doors: Float,
  $loading: String,
  $sprinklered: String,
  $canopies: String,
  $power: String,

      ) {

    updatePremises (

  premisesId: $premisesId,
  floor: $floor,
  area: $area,
  vacant: $vacant,
  type: $type,
  premisesIndex: $premisesIndex,
  occupation: $occupation,
  premisesNotes: $premisesNotes,
  netRental: $netRental,
  opCosts: $opCosts,
  other: $other,
  grossRental: $grossRental,
  esc: $esc,
  openBays: $openBays,
  openRate: $openRate,
  coveredBays: $coveredBays,
  coveredRate: $coveredRate,
  shadedBays: $shadedBays,
  shadedRate: $shadedRate,
  parkingRatio: $parkingRatio,
  tenantName: $tenantName,
  leaseExpiry: $leaseExpiry,
  tenantNotes: $tenantNotes,
  yard: $yard,
  height: $height,
  doors: $doors,
  loading: $loading,
  sprinklered: $sprinklered,
  canopies: $canopies,
  power: $power,



) {
  
  premisesId
  floor
  area
}
  }
`;

export const GET_PDF_VARIABLES = gql`
  query GetPDFVariables {
    pdfVariables @client { 
        enquiryName
        agent{
          name
          mobile
          email
        }
    }
  }
  `

export const GET_LANDLORDS = gql`
    
query{

landlords{
  landlordId
    landlordName
    contactsList{
      contactId
      name
      email
      officeNo
      mobileNo
      landlordName{
        landlordName
      }
      propertyList{
        propertyId
      }
    }
}
}

`

export const NEW_LANDLORD = gql`
  mutation PostLandlord (

  $landlordName: String,
  
      ) {

    postLandlord (

  landlordName: $landlordName,
  
) {
 
  landlordId
  landlordName
}
  }
`;

export const UPDATE_LANDLORD = gql`
  mutation UpdateLandlord (
  $landlordId: Int!,
  $landlordName: String,
  
      ) {

    updateLandlord (
  landlordId: $landlordId,
  landlordName: $landlordName,
  
) {
 
  landlordId
  landlordName
}
  }
`;


export const NEW_LANDLORD_CONTACT = gql`
  mutation PostLandlordContact (
  $landlordId: Int!,
  $name: String,
  $email: String,
  $mobileNo: String,
  $officeNo: String,
  
      ) {

    postLandlordContact (
  landlordId: $landlordId
  name: $name,
  email: $email,
  mobileNo: $mobileNo,
  officeNo: $officeNo,
  
) {
 
  contactId
  name 
  email
  mobileNo
  officeNo
}
  }
`;

export const UPDATE_LANDLORD_CONTACT = gql`
  mutation UpdateLandlordContact (
    $contactId: Int!,
  $name: String,
  $email: String,
  $mobileNo: String,
  $officeNo: String,
  
      ) {

    updateLandlordContact (
      contactId: $contactId
  name: $name,
  email: $email,
  mobileNo: $mobileNo,
  officeNo: $officeNo,
  
) {
 
  contactId
  name 
  email
  mobileNo
  officeNo
}
  }
`;

export const DELETE_LANDLORD = gql`
  mutation DeleteLandlord (
  $landlordId: Int!,
      ) {
    deleteLandlord (
      landlordId: $landlordId,
) {
  landlordId
}
  }
`;

export const DELETE_LANDLORD_CONTACT = gql`
  mutation DeleteLandlordContact (
  $contactId: Int!,
      ) {
    deleteLandlordContact (
      contactId: $contactId,
) {
  contactId
}
  }
`;