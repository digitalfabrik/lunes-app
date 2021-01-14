import React from 'react';
import {styles} from './styles';
import {IVocabularyOverviewListItemProps} from '../../interfaces/exercise';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {COLORS} from '../../constants/colors';
import Tts from 'react-native-tts';
import {getBadgeColor} from '../../utils/helpers';
import {VolumeUp} from '../../assets/images/imports';

export {
  React,
  styles,
  View,
  Text,
  Image,
  COLORS,
  TouchableOpacity,
  Tts,
  getBadgeColor,
  VolumeUp,
};

export type {IVocabularyOverviewListItemProps};
