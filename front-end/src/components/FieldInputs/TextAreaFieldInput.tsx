import { useState } from 'react';
import { TextArea } from '../ui';

type TextAreaFieldInputProps = {
  name: string;
  label: string;
  propertyFields: PropertyField[];
  updateFields: (propertyFields: PropertyField[]) => void;
};

const TextAreaFieldInput = ({ label, name, propertyFields, updateFields }: TextAreaFieldInputProps) => {
  const [value, setValue] = useState<string>(propertyFields[0].default_value!);
  return (
    <>
      <TextArea
        name={name}
        header={label}
        value={value}
        className='w-full'
        onChange={(e) => {
          setValue(e.target.value);
          updateFields([{ ...propertyFields[0], default_value: value }]);
        }}
      ></TextArea>
    </>
  );
};

export default TextAreaFieldInput;
