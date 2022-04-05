import React,{useState,FC} from 'react'
import styled from 'styled-components/native'
import Line1 from '../../assets/images/Line1.svg'
import Line2 from '../../assets/images/Line2.svg'
import Line3 from '../../assets/images/Line3.svg'
import Line4 from '../../assets/images/Line4.svg'
import Icon1 from '../../assets/images/icon1.svg'
import Icon2 from '../../assets/images/icon2.svg'
const Lane = styled.View`
`
const LockingLane:React.FC<{stepslocked:string}>=({stepslocked})=>{
    const [iconsarray,setIconsarray]=useState([<Icon2></Icon2>,<Icon1></Icon1>]);
return(
    <Lane style={{display:'flex', flexDirection:'column'}}>
     <Line1></Line1>
     {iconsarray[1]}
     <Line2></Line2>
     {iconsarray[1]}
     <Line3></Line3>
     {iconsarray[1]}
     <Line4></Line4>
    </Lane>
)
}
export default LockingLane