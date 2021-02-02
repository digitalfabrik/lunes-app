import React, {useState} from 'react';
import {View, TouchableOpacity, TextInput, Platform} from 'react-native';
import {styles} from './styles';
import {CloseIcon, VolumeUp} from '../../assets/images/imports';
import {COLORS} from '../../constants/colors';
import {IAnswerSectionProps, IDocumentProps} from '../../interfaces/exercise';
import Popover, {PopoverPlacement} from 'react-native-popover-view';
import PopoverContent from '../PopoverContent';
import SoundPlayer from 'react-native-sound-player';
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-community/async-storage';
import Feedback from '../FeedbackSection';
import stringSimilarity from 'string-similarity';
import Actions from '../Actions';
import {SCREENS} from '../../constants/data';

export {
  React,
  View,
  styles,
  TouchableOpacity,
  useState,
  COLORS,
  TextInput,
  CloseIcon,
  Popover,
  PopoverPlacement,
  PopoverContent,
  VolumeUp,
  Platform,
  SoundPlayer,
  Tts,
  AsyncStorage,
  Feedback,
  stringSimilarity,
  Actions,
  SCREENS,
};

export type {IAnswerSectionProps, IDocumentProps};
