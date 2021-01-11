import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import {Query, Property} from "../schematypes/schematypes"
import {useQuery  } from '@apollo/client';
import {selectedPropertyList} from "../reactivevariables/reactivevariables"
import PropertyListItem from "./PropertyListItem"





  
    

interface Props {
propertyData: Query | undefined
}

export const PropertyList: React.FunctionComponent<Props> = ({  propertyData }) => {

   



  var originalPropertyData = propertyData
  var originalProperties = originalPropertyData!.properties!

  var nameSortedProperties = originalProperties.slice().sort((a, b) => {
    var nameA = a.propertyName!.toUpperCase();
    var nameB = b.propertyName!.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
});

  var selectedMap = originalProperties.map(property => {
return ({...property, isSelected: false})
  })

  var selectedMap2 = selectedMap
  /* if(propertyData!.properties! !== null && propertyData!.properties !== undefined) {
    originalProperties = propertyData!.properties!
  } */
  const [properties, setProperties] = React.useState(originalProperties!);



  /* const onFilterChanged = (_: any, text: string): void => {
    setItems(originalItems.filter(item => item.name.toLowerCase().indexOf(text.toLowerCase()) >= 0));
  }; */

  return (
      <div>
{nameSortedProperties.map(property => {

    return (  
        <PropertyListItem key={property?.propertyId} property={property!}> </PropertyListItem>
    )

})}

      </div>
   
  );
};

export default PropertyList