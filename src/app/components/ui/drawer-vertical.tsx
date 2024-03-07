'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '../../lib/utils';
import { DrawerOverlay, DrawerPortal } from '@components/ui/drawer.tsx';

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        // Adjust the position from bottom to the right side of the viewport
        'fixed inset-y-0 right-0 top-0 z-50 w-auto max-w-[90%] h-full flex flex-col rounded-l-[10px] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950',
        className
      )}
      {...props}
    >
      <div className="my-auto mx-4 h-[100px] w-2 rounded-full bg-slate-100 dark:bg-slate-800" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = 'DrawerContent';

export { DrawerContent };
