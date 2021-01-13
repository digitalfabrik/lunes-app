import React, {useState} from 'react';
import {styles} from './styles';
import {View, Text, LogBox} from 'react-native';
import {
  IProfessionSubcategoryScreenProps,
  IProfessionSubcategoryProps,
} from '../../interfaces/professionSubcategory';
import ListView from '../../components/ListView';
import {SCREENS} from '../../constants/data';
import axios from '../../utils/axios';
import {ENDPOINTS} from '../../constants/endpoints';
import {useFocusEffect} from '@react-navigation/native';
import {getProfessionSubcategoryWithIcon} from '../../utils/helpers';

export {
  React,
  styles,
  View,
  Text,
  LogBox,
  ListView,
  SCREENS,
  axios,
  ENDPOINTS,
  useFocusEffect,
  useState,
  getProfessionSubcategoryWithIcon,
};

export type {IProfessionSubcategoryScreenProps, IProfessionSubcategoryProps};
