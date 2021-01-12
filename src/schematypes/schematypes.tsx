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
  navigationState?: NavigationState;
  selectedPropertyList?: SelectedPropertyList;
  distinctSuburbs?: [Suburb];
  distinctRegions?: [Region];
  pdfVariables?: PDFVariables;

};


export type QuerySinglePropertyArgs = {
  propertyId: Scalars['Int'];
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
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
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
};


export type MutationPostPropertyArgs = {
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


export type MutationUpdatePropertyArgs = {
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
    agent: Agent
  }
  
  