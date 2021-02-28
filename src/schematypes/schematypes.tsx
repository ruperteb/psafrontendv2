export type Maybe<T> = T /* | null */;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  properties?: Maybe<Array<Maybe<Property>>>;
  premisesList?: Maybe<Array<Maybe<Premises>>>;
  singleProperty?: Property;
  multiProperty?: Maybe<Array<Maybe<Property>>>;
  navigationState?: NavigationState;
  selectedPropertyList?: SelectedPropertyList;
  distinctSuburbs?: [Suburb];
  distinctRegions?: [Region];
  pdfVariables?: PDFVariables;
  landlords?: Maybe<Array<Maybe<Landlord>>>;
  landlordContacts?: Maybe<Array<Maybe<LandlordContact>>>;
  contactsByLandlord?: Maybe<Array<Maybe<LandlordContact>>>;
  propertyLists?: Maybe<Array<Maybe<PropertyList>>>;

};


export type QuerySinglePropertyArgs = {
  propertyId: Scalars['Int'];
};

export type QueryMultiPropertyArgs = {
  propertyIdList?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type Property = {
  __typename?: 'Property';
  propertyId: Scalars['Int'];
  propertyName: Scalars['String'];
  address?: Maybe<Scalars['String']>;
  suburb?: Maybe<Scalars['String']>;
  coordinates?: Maybe<Scalars['String']>;
  earliestOccupation?: Maybe<Scalars['DateTime']>;
  earliestExpiry?: Maybe<Scalars['DateTime']>;
  erfExtent?: Maybe<Scalars['Float']>;
  totalGLA?: Maybe<Scalars['Float']>;
  vacantArea?: Maybe<Scalars['Float']>;
  buildingType?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  premisesList?: Maybe<Array<Maybe<Premises>>>;

  locality?: Maybe<Scalars['String']>;
  aerial?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;

  contact?: Maybe<LandlordContact>;
};

export type Premises = {
  __typename?: 'Premises';
  premisesId?: Maybe<Scalars['Int']>;
  floor?: Maybe<Scalars['String']>;
  area?: Maybe<Scalars['Float']>;
  vacant?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  premisesIndex?: Maybe<Scalars['Int']>;
  occupation?: Maybe<Scalars['DateTime']>;
  premisesNotes?: Maybe<Scalars['String']>;
  netRental?: Maybe<Scalars['Float']>;
  opCosts?: Maybe<Scalars['Float']>;
  other?: Maybe<Scalars['Float']>;
  grossRental?: Maybe<Scalars['Float']>;
  esc?: Maybe<Scalars['Float']>;
  openBays?: Maybe<Scalars['Float']>;
  openRate?: Maybe<Scalars['Float']>;
  coveredBays?: Maybe<Scalars['Float']>;
  coveredRate?: Maybe<Scalars['Float']>;
  shadedBays?: Maybe<Scalars['Float']>;
  shadedRate?: Maybe<Scalars['Float']>;
  parkingRatio?: Maybe<Scalars['Float']>;
  tenantName?: Maybe<Scalars['String']>;
  leaseExpiry?: Maybe<Scalars['DateTime']>;
  tenantNotes?: Maybe<Scalars['String']>;
  yard?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  doors?: Maybe<Scalars['Float']>;
  loading?: Maybe<Scalars['String']>;
  sprinklered?: Maybe<Scalars['String']>;
  canopies?: Maybe<Scalars['String']>;
  power?: Maybe<Scalars['String']>;
  propertyName?: Maybe<Property>;
};


export type Mutation = {
  __typename?: 'Mutation';
  postProperty: Property;
  postPremises: Premises;
  deleteProperty: Property;
  deletePremises: Premises;
  updateProperty: Property;
  updatePremises: Premises;
  login?: Maybe<AuthPayload>;
  signup?: Maybe<AuthPayload>;
  postLandlord: Landlord;
  postLandlordContact: LandlordContact;
  updateLandlord: Landlord;
  updateLandlordContact: LandlordContact;
  deleteLandlord: Landlord;
  deleteLandlordContact: LandlordContact;
  postPropertyList: PropertyList;
  updatePropertyList: PropertyList;
  deletePropertyList: PropertyList;
};

export type MutationPostLandlordArgs = {
  landlordName?: Maybe<Scalars['String']>;
};


export type MutationPostLandlordContactArgs = {
  landlordId: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  officeNo?: Maybe<Scalars['String']>;
  mobileNo?: Maybe<Scalars['String']>;
};


export type MutationPostPropertyArgs = {
  contactId?: Maybe<Scalars['Int']>;
  propertyName: Scalars['String'];
  address?: Maybe<Scalars['String']>;
  suburb?: Maybe<Scalars['String']>;
  coordinates?: Maybe<Scalars['String']>;
  earliestOccupation?: Maybe<Scalars['DateTime']>;
  earliestExpiry?: Maybe<Scalars['DateTime']>;
  erfExtent?: Maybe<Scalars['Float']>;
  totalGLA?: Maybe<Scalars['Float']>;
  vacantArea?: Maybe<Scalars['Float']>;
  buildingType?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
};


export type MutationPostPremisesArgs = {
  propertyId: Scalars['Int'];
  floor?: Maybe<Scalars['String']>;
  area?: Maybe<Scalars['Float']>;
  vacant?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  premisesIndex?: Maybe<Scalars['Int']>;
  occupation?: Maybe<Scalars['DateTime']>;
  premisesNotes?: Maybe<Scalars['String']>;
  netRental?: Maybe<Scalars['Float']>;
  opCosts?: Maybe<Scalars['Float']>;
  other?: Maybe<Scalars['Float']>;
  grossRental?: Maybe<Scalars['Float']>;
  esc?: Maybe<Scalars['Float']>;
  openBays?: Maybe<Scalars['Float']>;
  openRate?: Maybe<Scalars['Float']>;
  coveredBays?: Maybe<Scalars['Float']>;
  coveredRate?: Maybe<Scalars['Float']>;
  shadedBays?: Maybe<Scalars['Float']>;
  shadedRate?: Maybe<Scalars['Float']>;
  parkingRatio?: Maybe<Scalars['Float']>;
  tenantName?: Maybe<Scalars['String']>;
  leaseExpiry?: Maybe<Scalars['DateTime']>;
  tenantNotes?: Maybe<Scalars['String']>;
  yard?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  doors?: Maybe<Scalars['Float']>;
  loading?: Maybe<Scalars['String']>;
  sprinklered?: Maybe<Scalars['String']>;
  canopies?: Maybe<Scalars['String']>;
  power?: Maybe<Scalars['String']>;
};


export type MutationDeletePropertyArgs = {
  propertyId?: Maybe<Scalars['Int']>;
};


export type MutationDeletePremisesArgs = {
  premisesId?: Maybe<Scalars['Int']>;
};

export type MutationDeleteLandlordArgs = {
  landlordId?: Maybe<Scalars['Int']>;
};


export type MutationDeleteLandlordContactArgs = {
  contactId?: Maybe<Scalars['Int']>;
};


export type MutationUpdatePropertyArgs = {
  contactId?: Maybe<Scalars['Int']>;
  propertyId: Scalars['Int'];
  propertyName?: Scalars['String'];
  address?: Maybe<Scalars['String']>;
  suburb?: Maybe<Scalars['String']>;
  coordinates?: Maybe<Scalars['String']>;
  earliestOccupation?: Maybe<Scalars['DateTime']>;
  earliestExpiry?: Maybe<Scalars['DateTime']>;
  erfExtent?: Maybe<Scalars['Float']>;
  totalGLA?: Maybe<Scalars['Float']>;
  vacantArea?: Maybe<Scalars['Float']>;
  buildingType?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;

  locality?: Maybe<Scalars['String']>;
  aerial?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type MutationUpdatePremisesArgs = {
  premisesId: Scalars['Int'];
  floor?: Maybe<Scalars['String']>;
  area?: Maybe<Scalars['Float']>;
  vacant?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  premisesIndex?: Maybe<Scalars['Int']>;
  occupation?: Maybe<Scalars['DateTime']>;
  premisesNotes?: Maybe<Scalars['String']>;
  netRental?: Maybe<Scalars['Float']>;
  opCosts?: Maybe<Scalars['Float']>;
  other?: Maybe<Scalars['Float']>;
  grossRental?: Maybe<Scalars['Float']>;
  esc?: Maybe<Scalars['Float']>;
  openBays?: Maybe<Scalars['Float']>;
  openRate?: Maybe<Scalars['Float']>;
  coveredBays?: Maybe<Scalars['Float']>;
  coveredRate?: Maybe<Scalars['Float']>;
  shadedBays?: Maybe<Scalars['Float']>;
  shadedRate?: Maybe<Scalars['Float']>;
  parkingRatio?: Maybe<Scalars['Float']>;
  tenantName?: Maybe<Scalars['String']>;
  leaseExpiry?: Maybe<Scalars['DateTime']>;
  tenantNotes?: Maybe<Scalars['String']>;
  yard?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  doors?: Maybe<Scalars['Float']>;
  loading?: Maybe<Scalars['String']>;
  sprinklered?: Maybe<Scalars['String']>;
  canopies?: Maybe<Scalars['String']>;
  power?: Maybe<Scalars['String']>;
};

export type MutationUpdateLandlordArgs = {
  landlordId: Scalars['Int'];
  landlordName?: Scalars['String'];
};

export type MutationUpdateLandlordContactArgs = {
  contactId: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  officeNo?: Maybe<Scalars['String']>;
  mobileNo?: Maybe<Scalars['String']>;
};

export type MutationPostPropertyListArgs = {
  enquiryName?: Maybe<Scalars['String']>;
  customTitle?: Maybe<Scalars['String']>;
  enquiryDate?: Maybe<Scalars['DateTime']>;
  propertyIdList?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


export type MutationUpdatePropertyListArgs = {
  propertyListId: Scalars['Int'];
  enquiryName?: Maybe<Scalars['String']>;
  customTitle?: Maybe<Scalars['String']>;
  enquiryDate?: Maybe<Scalars['DateTime']>;
  propertyIdList?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type MutationDeletePropertyListArgs = {
  propertyListId?: Maybe<Scalars['Int']>;
};

export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignupArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
};


export type NavigationState = {
    showNewPropertyModal:  boolean,
    showUpdatePropertyModal:  boolean,
    showNewPremisesModal:  boolean,
    showUpdatePremisesModal:  boolean,
    showDuplicatePremisesModal: boolean,
    showImageGalleryModal: boolean,
    showPremisesNotesModal: boolean,
    showPreviewPDFPanel: boolean,
    showManageLandlordsPanel: boolean,
    showSelectedPropertyPanel: boolean,
    showSavedListsPanel: boolean,
    showFilterModal: boolean,
    selectedPropertyType: string | undefined,
    search: string | undefined,
    showSelectedPropertyListPanel: boolean,
    selectedPropertyId: number,
    selectedPremisesId: number,
 
  }

 /*  export type SelectedPropertyList = {
propertyIds: Scalars['Int'][]

  } */

  export type SelectedPropertyList = Property[]

 export type Suburb = {
    suburb: string
    province: string
   }
  
  export type Region = {
    region: string
    province: string
   }

   export type Agent = {
     name: string,
     mobile: string,
     email: string,
   }

   export type PDFVariables = {
    enquiryName: string,
    customTitle: null | string,
    agent: Agent,
    outputType: string,
    onlyShowVacant: boolean,
    showLocality: boolean,
    showAerial: boolean,
    showImages: boolean,
    imageLimit: number | string,

  }

  export type Landlord = {
    __typename?: 'Landlord';
    landlordId: Scalars['Int'];
    landlordName?: Maybe<Scalars['String']>;
    contactsList?: Maybe<Array<Maybe<LandlordContact>>>;
  };
  
  export type LandlordContact = {
    __typename?: 'LandlordContact';
    contactId: Scalars['Int'];
    name?: Maybe<Scalars['String']>;
    email?: Maybe<Scalars['String']>;
    officeNo?: Maybe<Scalars['String']>;
    mobileNo?: Maybe<Scalars['String']>;
    landlordName?: Maybe<Landlord>;
    propertyList?: Maybe<Array<Maybe<Property>>>;
  };
  
  export type PropertyList = {
    __typename?: 'PropertyList';
    propertyListId: Scalars['Int'];
    enquiryName?: Maybe<Scalars['String']>;
    customTitle?: Maybe<Scalars['String']>;
    enquiryDate?: Maybe<Scalars['DateTime']>;
    properties?: Maybe<Array<Maybe<Property>>>;
  };
  