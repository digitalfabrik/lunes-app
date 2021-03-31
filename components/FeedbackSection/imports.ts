import React from 'react';
import {styles} from './styles';
import {View, Text, ImageBackground} from 'react-native';
import {IFeedbackProps} from '../../interfaces/exercise';
import {
  CorrectFeedbackIcon,
  IncorrectFeedbackIcon,
  AlmostCorrectFeedbackIcon,
  incorrect_background,
  hint_background,
  correct_background,
} from '../../assets/images';
import {ARTICLES} from '../../constants/data';

export {
  React,
  styles,
  View,
  Text,
  CorrectFeedbackIcon,
  IncorrectFeedbackIcon,
  AlmostCorrectFeedbackIcon,
  incorrect_background,
  hint_background,
  correct_background,
  ARTICLES,
  ImageBackground,
};

export type {IFeedbackProps};
