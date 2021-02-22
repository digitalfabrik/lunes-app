import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import {styles} from './styles';
import Modal from '../../../components/Modal';
import {ProgressBar} from 'react-native-paper';
import {COLORS} from '../../../constants/colors';
import {IDocumentProps} from '../../../interfaces/exercise';
import axios from '../../../utils/axios';
import {ENDPOINTS} from '../../../constants/endpoints';
import {IVocabularyTrainerScreen} from '../../../interfaces/exercise';
import AnswerSection from '../../../components/AnswerSection';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CloseButton} from '../../../assets/images/imports';
import {SCREENS} from '../../../constants/data';
import {useFocusEffect} from '@react-navigation/native';

export {
  React,
  useState,
  Modal,
  View,
  ProgressBar,
  COLORS,
  styles,
  Image,
  Text,
  ENDPOINTS,
  axios,
  AnswerSection,
  BackHandler,
  KeyboardAwareScrollView,
  ActivityIndicator,
  TouchableOpacity,
  CloseButton,
  SCREENS,
  useFocusEffect,
};

export type {IDocumentProps, IVocabularyTrainerScreen};
