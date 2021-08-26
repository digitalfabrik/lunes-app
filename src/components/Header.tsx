import React from 'react'
import { SquareIcon, StarIcon, CircleIcon, LinesIcon, SmileIcon } from '../../assets/images'
import { COLORS } from '../constants/colors'
import styled from 'styled-components/native'

const Wrapper = styled.View`
    background-color: ${COLORS.lunesBlack};
    padding-top: ${(prop: IHeaderProps) => prop.top};
`;
const HeaderStyle = styled.View`
    background-color: ${COLORS.lunesBlack};
    height: 91;
    width: 100%;
`;
const SquareIconStyle = styled.View`
    position: absolute;
    top: 41.5;
    left: 24.3;
    width: 28;
    height: 28;
`;
const StarIconStyle = styled.View`
    position: absolute;
    top: -5;
    left: 98.3;
    width: 28;
    height: 23.5;
`;
const CircleIconStyle = styled.View`
    position: absolute;
    top: 37.5;
    right: 68.8;
    width: 28;
    height: 29;
`;
const VerticalLinesIcon = styled.View`
    position: absolute;
    top: 16.5;
    right: 0;
    width: 24.5;
    height: 28;
`;
const SmileIconStyle =styled.View`
    position: absolute;
    width: 80;
    height: 80;
    left: 50%;
    margin-left: -40;
    top: 51;
`;

export interface IHeaderProps {
  top: number | undefined
}

const Header = ({ top }: IHeaderProps): JSX.Element => (
<Wrapper testID='header' top={top}>
    <HeaderStyle>
      <SquareIconStyle>
        <SquareIcon />
      </SquareIconStyle>
      <StarIconStyle>
        <StarIcon />
      </StarIconStyle>
      <CircleIconStyle>
        <CircleIcon />
      </CircleIconStyle>
      <VerticalLinesIcon>
        <LinesIcon />
      </VerticalLinesIcon>
      <SmileIconStyle>
        <SmileIcon />
      </SmileIconStyle>
    </HeaderStyle>
  </Wrapper>
)
export default Header