import React, {useState} from 'react';
import {View, TouchableOpacity, TextInput, Platform} from 'react-native';
import {styles} from './styles';
import {CloseIcon, VolumeUp} from '../../assets/images';
import {COLORS} from '../../constants/colors';
import {IAnswerSectionProps, IDocumentProps} from '../../interfaces/exercise';
import Popover from '../Popover';
import SoundPlayer from 'react-native-sound-player';
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feedback from '../FeedbackSection';
import stringSimilarity from 'string-similarity';
import Actions from '../Actions';
import PopoverContent from '../PopoverContent';
import {useFocusEffect} from '@react-navigation/native';
import {BoxShadow} from 'react-native-shadow';

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
  VolumeUp,
  Platform,
  SoundPlayer,
  Tts,
  AsyncStorage,
  Feedback,
  stringSimilarity,
  Actions,
  PopoverContent,
  useFocusEffect,
  BoxShadow,
};

export type {IAnswerSectionProps, IDocumentProps};
