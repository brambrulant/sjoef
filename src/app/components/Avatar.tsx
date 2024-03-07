'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar.tsx';
import { KindeUser } from '@kinde-oss/kinde-auth-react/dist/types/state/types';

export interface AvatarComponentProps {
  user: KindeUser;
}

export const AvatarComponent: React.FC<AvatarComponentProps> = ({ user }) => {
  return (
    <Avatar>
      <AvatarImage src={user?.picture ?? ''} />
      <AvatarFallback>
        {user?.given_name?.charAt(0)}
        {user?.family_name?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarComponent;
