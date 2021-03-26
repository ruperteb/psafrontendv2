import * as React from 'react';
import {createRef} from "react"
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { Query, Property, Premises, FilterVariables } from "../schematypes/schematypes"
import { useQuery } from '@apollo/client';
import { selectedPropertyList } from "../reactivevariables/reactivevariables"
import { GET_FILTER_VARIABLES } from "../gql/gql"
import PropertyListItem from "./PropertyListItem"
import FlipMove from 'react-flip-move';
import AnimatedListItem from "./AnimatedListItem"



interface Props {
  propertyData: Query | undefined
  search: string | undefined
}

export const PropertyList: React.FunctionComponent<Props> = ({ propertyData, search }) => {

  const {
    data: filterData,
    loading: filterLoading,
    error: filterError
  } = useQuery<Query>(GET_FILTER_VARIABLES);

  console.log(filterData?.filterVariables)

  const getVacantGLA = (property: Property) => {
    var vacantGLA = 0
    property?.premisesList!.map(premises => {
      if (premises.vacant === "true") {
        vacantGLA += premises.area!
      }
    })
    return vacantGLA
  }

  const getEarliestOccDate = (property: Property) => {

    var premises = property?.premisesList
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
    return date
  }

  const checkDatesEqual = (first: Date | undefined, second: Date | undefined) => {
    if (first && second)
      if (first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate()) {
        return true
      } else return false
  }

  const checkDatesGreaterThanOrEqual = (first: Date | undefined, second: Date | undefined) => {
    if (first && second)
      if ((first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate()) || first > second) {
        return true
      } else return false
  }

  const checkDatesLessThanOrEqual = (first: Date | undefined, second: Date | undefined) => {
    if (first && second)
      if ((first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate()) || first < second) {
        return true
      } else return false
  }

  var startDate = new Date("01/01/2020")

  var originalPropertyData = propertyData
  var originalProperties = originalPropertyData!.properties!

  const filterFunction = (property: Property) => {
    if (filterData?.filterVariables!.suburb!.length !== 0) { if (!filterData?.filterVariables!.suburb?.includes(property.suburb!)) return false }
    if (filterData?.filterVariables!.region!.length !== 0) { if (!filterData?.filterVariables!.region?.includes(property.region!)) return false }
    if (filterData?.filterVariables!.province!.length !== 0) { if (!filterData?.filterVariables!.province?.includes(property.province!)) return false }
    if (filterData?.filterVariables!.buildingType!.length !== 0) { if (!filterData?.filterVariables!.buildingType?.includes(property.buildingType!)) return false }
    if (filterData?.filterVariables!.landlord!.length !== 0) { if (!filterData?.filterVariables!.landlord?.includes(property.contact?.landlordName?.landlordName!)) return false }
    if (filterData?.filterVariables!.vacantGLAMin! !== 0 || filterData?.filterVariables!.vacantGLAMax! !== 0) { if (filterData?.filterVariables!.vacantGLAMin! >= getVacantGLA(property)) return false }
    if (filterData?.filterVariables!.vacantGLAMax! !== 0) { if (filterData?.filterVariables!.vacantGLAMax! <= getVacantGLA(property)) return false }
    if (!checkDatesEqual(filterData?.filterVariables!.earliestOccMin, startDate)) { if (!checkDatesGreaterThanOrEqual(getEarliestOccDate(property), filterData?.filterVariables!.earliestOccMin)) return false }
    if (!checkDatesEqual(filterData?.filterVariables!.earliestOccMax, startDate)) { if (!checkDatesLessThanOrEqual(getEarliestOccDate(property), filterData?.filterVariables!.earliestOccMax)) return false }
    return true
  }

  const filteredProperties = originalProperties.filter(filterFunction);

  const searchSortedProperties = filteredProperties?.filter(property => {
    if (property !== null && property !== undefined) {
      if (property?.address !== null && property?.address !== undefined) {
        if (property?.suburb !== null && property?.suburb !== undefined) {
          if (property?.region !== null && property?.region !== undefined) {
            if (property?.province !== null && property?.province !== undefined) {
              return property?.propertyName.toLowerCase().includes(search!.toLowerCase()) || property?.address.toLowerCase().includes(search!.toLowerCase()) || property?.suburb.toLowerCase().includes(search!.toLowerCase()) || property?.region.toLowerCase().includes(search!.toLowerCase()) || property?.province.toLowerCase().includes(search!.toLowerCase())
            }
          }
        }
      }
    }
  })


  /* var nameSortedProperties = searchSortedProperties.slice().sort((a, b) => {
    var nameA = a.propertyName!.toUpperCase();
    var nameB = b.propertyName!.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}); */




  /* const onFilterChanged = (_: any, text: string): void => {
    setItems(originalItems.filter(item => item.name.toLowerCase().indexOf(text.toLowerCase()) >= 0));
  }; */

  const flipMoveStyles = {
    /* display: "flex",
    flexFlow: "row wrap",
    width: "100%" */


    /*  width: "35%" */
  }

  return (
    <div style={{ marginTop: 180, zIndex: 0 }}>
      <FlipMove enterAnimation={"elevator"} style={flipMoveStyles}>
      {searchSortedProperties.map(property => {return (
        <AnimatedListItem key={property?.propertyId} ref={createRef()}>
        
          <PropertyListItem key={property?.propertyId} property={property!}> </PropertyListItem>
       
        </AnimatedListItem>
         )
      })}
      
      </FlipMove>

    </div>

  );
};

export default PropertyList