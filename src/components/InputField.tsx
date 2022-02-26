import React from "react";
import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useField } from "formik";

interface InputFieldProps {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}

export const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <Input
        id={props.name}
        {...field}
        placeholder={props.placeholder}
        type={props.type}
      ></Input>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
