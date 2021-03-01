import React, {useState} from 'react';
import {styles} from './styles';
import {
  View,
  Text,
  LogBox,
  TouchableOpacity,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import {IExercisesScreenProps} from '../../../interfaces/exercises';
import {Home} from '../../../assets/images';
import Title from '../../../components/Title';
import {EXERCISES, SCREENS} from '../../../constants/data';
import {Arrow} from '../../../assets/images';
import {useFocusEffect} from '@react-navigation/native';
import {COLORS} from '../../../constants/colors';
import {BackButton} from '../../../assets/images';

export {
  React,
  styles,
  COLORS,
  View,
  useState,
  useFocusEffect,
  Text,
  LogBox,
  TouchableOpacity,
  Home,
  EXERCISES,
  Title,
  Pressable,
  Image,
  FlatList,
  Arrow,
  SCREENS,
  BackButton,
};

export type {IExercisesScreenProps};
