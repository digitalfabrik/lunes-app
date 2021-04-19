import React from 'react';
import AnswerSection from '../AnswerSection';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {IAnswerSectionProps} from '../../interfaces/exercise';

describe('Components', () => {
  describe('AnswerSection', () => {
    const defaultAnswerSectionProps: IAnswerSectionProps = {
      documents: [],
      profession: '',
      subCategory: '',
      currentDocumentNumber: 0,
      tryLater: () => {},
      finishExercise: () => {},
      setCurrentDocumentNumber: () => {},
    };

    it('renders correctly across screens', () => {
      const component = shallow(
        <AnswerSection {...defaultAnswerSectionProps} />,
      );
      expect(toJson(component)).toMatchSnapshot();
    });

    it('should render volume button', () => {
      const component = shallow(
        <AnswerSection {...defaultAnswerSectionProps} />,
      );
      expect(component.find('[testID="volume-button"]')).toHaveLength(1);
    });

    it('should render text input', () => {
      const component = shallow(
        <AnswerSection {...defaultAnswerSectionProps} />,
      );
      expect(component.find('[testID="input-field"]')).toHaveLength(1);
    });
  });
});
