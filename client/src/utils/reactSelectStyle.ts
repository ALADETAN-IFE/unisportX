import type { StylesConfig, GroupBase } from 'react-select';
import type { University } from './universitySelector';

export const selectCustomStyles: StylesConfig<University, false, GroupBase<University>> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#374151', // dark:bg-gray-700
    color: state.isDisabled ? '#fff' : '#111827', // dark:text-white
    borderColor: '#d1d5db', // border
    borderRadius: '0.375rem', // rounded-md
    minHeight: '2.5rem', // py-2
    boxShadow: state.isFocused ? '0 0 0 2px #2563eb' : provided.boxShadow, // focus:ring
    fontSize: '1rem',
    '&:hover': {
      borderColor: '#2563eb', // focus:border-blue-600
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 50,
    backgroundColor: '#374151', // dark:bg-gray-700
    color: '#fff',
    borderRadius: '0.375rem',
    fontSize: '1rem',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#2563eb'
      : state.isFocused
      ? '#e5e7eb'
      : '#374151', // dark:bg-gray-700
    color: state.isSelected ? '#fff' : state.isFocused ? '#111827' : '#fff', // dark:text-white
    cursor: 'pointer', // should be pointer, not loading
    fontSize: '1rem',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#fff',
    fontSize: '1rem',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#6b7280', // text-gray-400
    fontSize: '1rem',
  }),
  input: (provided) => ({
    ...provided,
    color: '#fff',
    fontSize: '1rem',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#6b7280',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: '#d1d5db',
  }),
};
