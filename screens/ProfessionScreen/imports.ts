import React, {useState} from 'react';
import Header from '../../components/Header';
import ListView from '../../components/ListView';
import {View, Text} from 'react-native';
import {styles} from './styles';
import axios from '../../utils/axios';
import {useFocusEffect} from '@react-navigation/native';
import {IProfessionsProps} from '../../interfaces/profession';
import {ICONS} from '../../constants/data';
import {getProfessionsWithIcons} from '../../utils/helpers';
import {ENDPOINTS} from '../../constants/endpoints';
import {SCREENS} from '../../constants/data';

export {
  React,
  Header,
  ListView,
  View,
  styles,
  Text,
  axios,
  useFocusEffect,
  useState,
  ICONS,
  getProfessionsWithIcons,
  ENDPOINTS,
  SCREENS,
};

export type {IProfessionsProps};
