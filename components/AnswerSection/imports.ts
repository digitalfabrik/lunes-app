import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Platform} from 'react-native';
import {styles} from './styles';
import {
  NextArrow,
  CloseIcon,
  VolumeUpDisabled,
  VolumeUp,
  InActiveVolumeUp,
  WhiteNextArrow,
} from '../../assets/images/imports';
import {COLORS} from '../../constants/colors';
import {IAnswerSectionProps, IDocumentProps} from '../../interfaces/exercise';
import Popover, {PopoverPlacement} from 'react-native-popover-view';
import PopoverContent from '../PopoverContent';
import SoundPlayer from 'react-native-sound-player';
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-community/async-storage';
import Feedback from '../FeedbackSection';
import stringSimilarity from 'string-similarity';

export {
  React,
  View,
  Text,
  styles,
  TouchableOpacity,
  useState,
  COLORS,
  TextInput,
  NextArrow,
  CloseIcon,
  Popover,
  PopoverPlacement,
  PopoverContent,
  VolumeUpDisabled,
  InActiveVolumeUp,
  VolumeUp,
  Platform,
  SoundPlayer,
  Tts,
  AsyncStorage,
  Feedback,
  stringSimilarity,
  WhiteNextArrow,
};

export type {IAnswerSectionProps, IDocumentProps};
