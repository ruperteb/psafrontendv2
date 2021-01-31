import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { Query, Property } from "../schematypes/schematypes"
import { useQuery } from '@apollo/client';
import { selectedPropertyList } from "../reactivevariables/reactivevariables"
import PropertyListItem from "./PropertyListItem"








interface Props {
  propertyData: Query | undefined
  search: string | undefined
}

export const PropertyList: React.FunctionComponent<Props> = ({ propertyData, search }) => {





  var originalPropertyData = propertyData
  var originalProperties = originalPropertyData!.properties!

  const searchSortedProperties = originalProperties?.filter(property => {
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

  return (
    <div>
      {searchSortedProperties.map(property => {

        return (
          <PropertyListItem key={property?.propertyId} property={property!}> </PropertyListItem>
        )

      })}

    </div>

  );
};

export default PropertyList