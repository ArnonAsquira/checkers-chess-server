import { Dispatch, SetStateAction, useState } from "react";

export default function useForm<T>(initialState: T) {
  const [inputValue, setInputValue]: [T, Dispatch<SetStateAction<T>>] =
    useState(initialState);

  const handleChange = (target: HTMLInputElement): void => {
    setInputValue((inputValue) => ({
      ...inputValue,
      [target.name]: target.value,
    }));
  };

  const returnValue: [
    T,
    (target: HTMLInputElement) => void,
    Dispatch<SetStateAction<T>>
  ] = [inputValue, handleChange, setInputValue];
  return returnValue;
}
