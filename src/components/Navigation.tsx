import React from 'react';

import { Pivot, PivotItem, IPivotStyles } from 'office-ui-fabric-react/lib/Pivot';
import { SearchBox, ISearchBoxStyles, } from 'office-ui-fabric-react/lib/SearchBox';
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react/lib/Image';

import { CommandBarButton, IContextualMenuProps, IIconProps, Stack, IStackStyles, initializeIcons, Toggle, IToggleStyles, DefaultButton, IButtonStyles } from 'office-ui-fabric-react';

import { isLoggedInVar } from "../cache/cache";
import HeaderImage from "../assets/EBLogoHeader.png"

import {navigationState} from "../reactivevariables/reactivevariables"
import {NavigationState} from "../schematypes/schematypes"

const addIcon: IIconProps = { iconName: 'Add' };

const filterIcon: IIconProps = { iconName: 'Filter' };

const pivotStyles: Partial<IPivotStyles> = {
  root: { /* width: "100vw", backgroundColor: "#20314b", marginBottom: "10px" */ },
   link: {
    selectors: {
      '&:hover': {
        backgroundColor: 'rgba(52, 90, 214, 0.14);',
      }
    }
  }, 
  linkIsSelected: {
    selectors: {
      '&:hover': {
        backgroundColor: 'rgba(52, 90, 214, 0.14);',
      }
    }
  }
};
const headerStackStyles: Partial<IStackStyles> = { root: { width: "100vw", backgroundColor: "#20314b", marginBottom: "10px" } };
const headerImageStyles: Partial<IStackStyles> = { root: { marginLeft: "37.5%", marginRight: "auto" } };
const stackStyles: Partial<IStackStyles> = { root: { height: 44 } };
const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 300, height: 44 } };
const toggleStyles: Partial<IToggleStyles> = { container: { marginTop: 5 }, label: { marginLeft: 4 } };
const commandBarStyles: Partial<IButtonStyles> = { root: { border: "1px solid rgb(161, 159, 157);" } };
const signoutIcon: IIconProps = { iconName: 'SignOut' };

const getTabId = (itemKey: string | undefined) => {
  return `NavigationPivot_${itemKey}`;
};



interface Props {
  
  selectedPropertyType: string | undefined,
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>,
  showSelectedPropertyListPanel: boolean,

}

export const Navigation: React.FC<Props> = ({  selectedPropertyType,  setSearch,  showSelectedPropertyListPanel }) => {
  initializeIcons();



  const handleLinkClick = (item?: PivotItem, ev?: React.MouseEvent<HTMLElement>) => {
    if (item === undefined) {
      navigationState (
        {
         ...navigationState(),
        selectedPropertyType: "",
       
        }
      )
    } else {
      
      navigationState ( {...navigationState(), selectedPropertyType: item.props.itemKey!})
    }

  };

  const onChangeSelectedPropertyListToggle = (ev: React.MouseEvent<HTMLElement>, checked: boolean | undefined) => {
    if (showSelectedPropertyListPanel === false) {
      navigationState ( {...navigationState(), showSelectedPropertyListPanel: true})
     
    } else {
      navigationState ( {...navigationState(), showSelectedPropertyListPanel: false})
    }

  }

  const imageProps: IImageProps = {
    src: HeaderImage,
    imageFit: ImageFit.contain,
  };

  const primaryButtonStyles: Partial<IButtonStyles> = { root: { width: 100, marginTop: 30, marginRight: 30 } };

  return (
    <div>
      <Stack styles={headerStackStyles} horizontal>
        <Image
          {...imageProps}
          alt='Header Image'
          width={400}
          height={100}
          styles={headerImageStyles}
        />

        {/* <DefaultButton styles={primaryButtonStyles} iconProps={signoutIcon} text="Logout" onClick={() => {
          localStorage.clear();
          isLoggedInVar(false);
          setLoginCallback(true)

        }}></DefaultButton> */}

      </Stack>


      <Stack horizontalAlign={"center"} horizontal gap={15} styles={stackStyles} >
        <CommandBarButton
          iconProps={addIcon}
          text="New Property"
          onClick={() =>navigationState ( {...navigationState(), showNewPropertyModal: true})}
          styles={commandBarStyles}
        // Set split=true to render a SplitButton instead of a regular button with a menu
        // split={true}

        />

        <CommandBarButton
          iconProps={filterIcon}
          text="Filter"
          onClick={() => navigationState ( {...navigationState(), showFilterModal: true})}
          styles={commandBarStyles}
        // Set split=true to render a SplitButton instead of a regular button with a menu
        // split={true}

        />

        <SearchBox
          styles={searchBoxStyles}
          placeholder="Search"
          onEscape={ev => {
            console.log('Custom onEscape Called');
          }}
          onClear={ev => {
            console.log('Custom onClear Called');
          }}
          onChange={(newValue: any) => setSearch(newValue)}
          onSearch={newValue => console.log('SearchBox onSearch fired: ' + newValue)}
        />

        <Toggle inlineLabel styles={toggleStyles} label="Selected Properties" checked={showSelectedPropertyListPanel} onChange={onChangeSelectedPropertyListToggle} />



      </Stack >


      {/* <Pivot
        aria-label="Navigation Pivot"
        selectedKey={selectedPropertyType}
        // eslint-disable-next-line react/jsx-no-bind
        onLinkClick={handleLinkClick}
        headersOnly={true}
        getTabId={getTabId}
        style={{ marginTop: "10px" }}
        styles={pivotStyles}
      >
        <PivotItem headerText="All Investors" itemKey="all" />
        <PivotItem headerText="Listed Funds" itemKey="listed" />
        <PivotItem headerText="Unlisted Funds" itemKey="unlisted" />
        <PivotItem headerText="Private Investors" itemKey="private" />
        <PivotItem headerText="BEE Funds" itemKey="bee" />
        <PivotItem headerText="Filtered List" itemKey="multifilter" />
      </Pivot> */}
    </div>
  );
};

export default Navigation