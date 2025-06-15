
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface FormData {
  id?: string;
  name: string;
  description: string;
  fields: FormField[];
}

interface FormBuilderState {
  formData: FormData;
  selectedField: FormField | null;
  isPreviewMode: boolean;
  isDragging: boolean;
}

type FormBuilderAction =
  | { type: 'SET_FORM_DATA'; payload: FormData }
  | { type: 'ADD_FIELD'; payload: FormField }
  | { type: 'UPDATE_FIELD'; payload: FormField }
  | { type: 'DELETE_FIELD'; payload: string }
  | { type: 'REORDER_FIELDS'; payload: FormField[] }
  | { type: 'SELECT_FIELD'; payload: FormField | null }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'UPDATE_FORM_META'; payload: { name: string; description: string } };

const initialState: FormBuilderState = {
  formData: {
    name: 'Untitled Form',
    description: 'A new form created with the form builder',
    fields: []
  },
  selectedField: null,
  isPreviewMode: false,
  isDragging: false
};

const formBuilderReducer = (state: FormBuilderState, action: FormBuilderAction): FormBuilderState => {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: action.payload
      };
    case 'ADD_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          fields: [...state.formData.fields, action.payload]
        }
      };
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          fields: state.formData.fields.map(field =>
            field.id === action.payload.id ? action.payload : field
          )
        },
        selectedField: action.payload
      };
    case 'DELETE_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          fields: state.formData.fields.filter(field => field.id !== action.payload)
        },
        selectedField: state.selectedField?.id === action.payload ? null : state.selectedField
      };
    case 'REORDER_FIELDS':
      return {
        ...state,
        formData: {
          ...state.formData,
          fields: action.payload
        }
      };
    case 'SELECT_FIELD':
      return {
        ...state,
        selectedField: action.payload
      };
    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        isPreviewMode: action.payload,
        selectedField: action.payload ? null : state.selectedField
      };
    case 'SET_DRAGGING':
      return {
        ...state,
        isDragging: action.payload
      };
    case 'UPDATE_FORM_META':
      return {
        ...state,
        formData: {
          ...state.formData,
          name: action.payload.name,
          description: action.payload.description
        }
      };
    default:
      return state;
  }
};

interface FormBuilderContextType {
  state: FormBuilderState;
  dispatch: React.Dispatch<FormBuilderAction>;
  createField: (type: FormField['type']) => FormField;
}

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

export const FormBuilderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  const createField = (type: FormField['type']): FormField => {
    const baseField: FormField = {
      id: uuidv4(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false
    };

    switch (type) {
      case 'text':
        return { ...baseField, placeholder: 'Enter text here...' };
      case 'textarea':
        return { ...baseField, placeholder: 'Enter your message...' };
      case 'select':
        return { ...baseField, options: ['Option 1', 'Option 2', 'Option 3'] };
      case 'radio':
        return { ...baseField, options: ['Option 1', 'Option 2', 'Option 3'] };
      case 'checkbox':
        return { ...baseField, label: 'Checkbox Label' };
      default:
        return baseField;
    }
  };

  return (
    <FormBuilderContext.Provider value={{ state, dispatch, createField }}>
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
};
