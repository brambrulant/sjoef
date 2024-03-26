'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs.tsx';
import { useKindeBrowserClient, LogoutLink, LoginLink } from '@kinde-oss/kinde-auth-nextjs';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover.tsx';
import AvatarComponent from '@components/Avatar.tsx';
import { Button } from '@components/ui/button.tsx';
import { Skeleton } from '@components/ui/skeleton.tsx';

export function Navbar() {
  const [opacity, setOpacity] = React.useState('bg-opacity-0');
  const { user, getPermissions } = useKindeBrowserClient();

  const permissions = getPermissions();

  const [activeTab, setActiveTab] = React.useState<string | undefined>();
  const pathname = usePathname();

  const menuItems = React.useMemo(
    () => [
      { name: 'events', path: '/events' },
      // { name: 'points', path: '/points', permissions: ['user'] },
      { name: 'tickets', path: '/tickets', permissions: ['user'] },
    ],
    []
  );

  React.useMemo(() => {
    if (pathname === '/') {
      setActiveTab('events');
    } else {
      const foundActiveTab = menuItems.find((item) => pathname === item.path)?.name;
      setActiveTab(foundActiveTab);
    }
  }, [menuItems, pathname]);

  React.useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled down a little bit (e.g., 100 pixels)
      const isScrolled = window.scrollY > 100;
      setOpacity(isScrolled ? 'bg-opacity-20' : 'bg-opacity-0');
    };

    // Attach the event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Tabs
      className={`w-screen h-14 bg-white ${opacity}  transition-all duration-1000 fixed z-50 top-0 p-0 rounded-b-md`}
    >
      <div className="">
        <div className="font-abc text-2xl h-14 flex flex-row items-center text-white absolute ml-4 cursor-pointer">
          <Link href="/events">sjoef.</Link>
        </div>
        <TabsList className="w-full h-14 bg-transparent flex justify-end m-auto">
          {menuItems.map((item) => {
            if (!user && item.permissions?.includes('user')) return null;
            return (
              <TabsTrigger
                key={item.name}
                className={`flex flex-row align-middle rounded-md ${item.name === activeTab && 'border-2 border-slate-100 animate-gradient-x bg-gradient-to-r from-blue-900 via-pink-200 to-pink-600 bg-size-200 text-slate-100'}`}
                value={item.name}
              >
                <Link href={item.path} className="font-abc">
                  {item.name}
                </Link>
              </TabsTrigger>
            );
          })}
          <div className="mt-2 ml-2 mr-2">
            <Popover>
              <PopoverTrigger>
                {user ? (
                  <AvatarComponent user={user} />
                ) : (
                  <Skeleton className="relative bg-slate-800 flex h-10 w-10 shrink-0 overflow-hidden rounded-full" />
                )}
              </PopoverTrigger>
              <PopoverContent className="mr-4 p-0">
                {permissions.permissions?.includes('admin') && (
                  <Button className="w-full border-2 border-transparent bg-transparent font-abc text-black hover:text-white">
                    <Link href={'/admin'}>Admin</Link>
                  </Button>
                )}
                <Button className="w-full bg-transparent border-2 border-transparent font-abc text-black hover:text-white">
                  {!user ? <LoginLink>Log in</LoginLink> : <LogoutLink>Log Out</LogoutLink>}
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </TabsList>
      </div>
    </Tabs>
  );
}
