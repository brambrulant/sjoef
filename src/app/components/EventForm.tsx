'use client';
import React from 'react';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
  FormDescription,
} from '@components/ui/form.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@components/ui/button.tsx';
import { Input } from '@components/ui/input.tsx';
import DatePicker from '@components/ui/datepicker.tsx';
import { useRouter } from 'next/navigation';
import { Textarea } from '@components/ui/textarea.tsx';
import { Slider } from '@components/ui/slider.tsx';
import { cn } from '../lib/utils.ts';

// Define the validation schema
const formSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  date: z.date().refine((date) => !isNaN(date.getTime()), { message: 'Date is required' }),
  openClose: z.array(z.number()).refine((value) => value[0] < value[1], {
    message: 'Opening time should be before closing time',
  }),
  genre: z.string().nonempty({ message: 'Genre is required' }),
  organizer: z.string().nonempty({ message: 'Organizer is required' }),
  price: z.string().nonempty({ message: 'Price is required' }),
  allocation: z.string().nonempty({ message: 'Allocation is required' }),
  line_up: z.string().nonempty({ message: 'Line up is required' }),
  description: z.string().nonempty({ message: 'Description is required' }),
});

const createEvent = async (values: z.infer<typeof formSchema>) => {
  const response = await fetch(`${process.env.BASE_URL}/api/event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export default function EventForm() {
  const [date, setDate] = React.useState(new Date());
  const [error, setError] = React.useState('');
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(formSchema),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      date: new Date(),
      openClose: [21, 27],
      genre: '',
      organizer: '',
      price: '',
      allocation: '',
    },
  });
  const mutation = useMutation({
    mutationFn: createEvent,
    onError: (error: any) => {
      setError(error.message);
    },
    onSuccess: () => {
      router.push('/events');
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div className="w-1/3 m-auto bg-slate-400 p-8 rounded-md">
      <h1 className="font-abc text-black mb-8">create a new event</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Party" {...field} />
                </FormControl>
                <FormDescription>Name of the event</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate ? selectedDate : new Date());
                      field.onChange(selectedDate);
                    }}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Date of the event</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="openClose"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormControl>
                  <Slider
                    min={12}
                    max={36}
                    step={0.25}
                    value={value}
                    onValueChange={onChange}
                    formatLabel={(value) => {
                      let hours = Math.floor(value);
                      const minutes = Math.floor((value - hours) * 60);
                      if (hours > 24) {
                        hours -= 24;
                      }
                      return `${hours.toString().padStart(2, '0')}.${minutes.toString().padStart(2, '0')}`;
                    }}
                    minStepsBetweenThumbs={1}
                    className={cn('w-[60%]')}
                  />
                </FormControl>
                <FormDescription>Time</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="punk" {...field} />
                </FormControl>
                <FormDescription>Genre of the event</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organizer"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Frits" {...field} />
                </FormControl>
                <FormDescription>Organizer of the event</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="5" {...field} />
                </FormControl>
                <FormDescription>Price</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="allocation"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="100" {...field} />
                </FormControl>
                <FormDescription>Allocation</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="line_up"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="DJ Python, CS-70, JAVA, Floating Points, DJ Rust"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Line Up</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Crazy party with the best DJ's in the world. be there or be a square"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Line Up</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-slate-950">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
