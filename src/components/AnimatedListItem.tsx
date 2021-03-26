import React, { CSSProperties, forwardRef } from "react";

type Props = {
    children:any
    
};

const animatedPropertyListItemStyles: CSSProperties = {
 
}

const AnimatedListItem = forwardRef<HTMLDivElement,Props>(( props, ref) => (
  <div ref ={ref} {...props} style={animatedPropertyListItemStyles}>
    {props.children}
  </div>
)


);




export default AnimatedListItem;