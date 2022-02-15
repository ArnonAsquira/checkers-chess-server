import React from "react";
import { ChangeEventHandler } from "react";

interface PropsForTextInput {
  id: string;
  label: string;
  type: string;
  name: string;
  value: string;
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
}

export default function TextInput(props: PropsForTextInput) {
  return (
    <form>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        type={props.type}
        value={props.value}
        name={props.name}
        onChange={props.handleInputChange}
        required
      ></input>
    </form>
  );
}
