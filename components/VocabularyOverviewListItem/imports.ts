import React from 'react';
import {styles} from './styles';
import {IVocabularyOverviewListItemProps} from '../../interfaces/exercise';
import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import {COLORS} from '../../constants/colors';
import Tts from 'react-native-tts';
import {getArticleColor} from '../../utils/helpers';
import {VolumeUp} from '../../assets/images/imports';
import SoundPlayer from 'react-native-sound-player';

export {
  React,
  styles,
  View,
  Text,
  Image,
  COLORS,
  TouchableOpacity,
  Tts,
  getArticleColor,
  VolumeUp,
  SoundPlayer,
  Platform,
};

export type {IVocabularyOverviewListItemProps};
