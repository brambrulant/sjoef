import React from 'react';
import { Input, Button, InputWrapper, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Calendar, DatePicker, DatePickerInput } from '@mantine/dates';

export type EventData = {
  name: string;
  date: Date;
  genre: string;
  organizer: string;
  price: string;
  allocation: string;
};

export const EventForm: React.FC<{ token: string }> = ({ token }) => {
  const form = useForm({
    initialValues: {
      name: '',
      date: new Date(),
      genre: '',
      organizer: '',
      price: '',
      allocation: '',
    },
  });

  const handleSubmit = async (values: EventData) => {
    console.log(values);
    // Call your API to submit the event
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Assuming you have the token available in this component
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);
  };

  return (
    <>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <InputWrapper label="Event name">
          <Input placeholder="Enter event name" {...form.getInputProps('name')} name="name" />
        </InputWrapper>
        <InputWrapper label="Event genre">
          <Input placeholder="Enter event genre" {...form.getInputProps('genre')} name="genre" />
        </InputWrapper>
        <InputWrapper label="Event organizer">
          <Input
            placeholder="Enter event organizer"
            {...form.getInputProps('organizer')}
            name="organizer"
          />
        </InputWrapper>
        <InputWrapper label="Price">
          <Input placeholder="Enter event price" {...form.getInputProps('price')} name="price" />
        </InputWrapper>
        <InputWrapper label="allocation">
          <Input
            placeholder="Enter event allocation"
            {...form.getInputProps('allocation')}
            name="allocation"
          />
        </InputWrapper>
        <InputWrapper label="Date">
          <DatePickerInput {...form.getInputProps('date')} name="date" placeholder="Pick date" />
        </InputWrapper>
        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
};

export default EventForm;
