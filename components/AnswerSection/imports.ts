import React, {useState} from 'react';
import {View, TouchableOpacity, TextInput, Platform} from 'react-native';
import {styles} from './styles';
import {CloseIcon, VolumeUp} from '../../assets/images/imports';
import {COLORS} from '../../constants/colors';
import {IAnswerSectionProps, IDocumentProps} from '../../interfaces/exercise';
import Popover from '../Popover';
import SoundPlayer from 'react-native-sound-player';
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feedback from '../FeedbackSection';
import stringSimilarity from 'string-similarity';
import Actions from '../Actions';
import {SCREENS} from '../../constants/data';
import PopoverContent from '../PopoverContent';
import {useFocusEffect} from '@react-navigation/native';

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
  SCREENS,
  PopoverContent,
  useFocusEffect,
};

export type {IAnswerSectionProps, IDocumentProps};
