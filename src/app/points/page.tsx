'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import QRCode from 'qrcode.react';

import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@components/ui/drawer.tsx';
import ConsumptionPointsCheckoutForm from '@components/CheckoutForm/ConsumptionPointsCheckoutForm.tsx';

const getConsumptionPoints = async (userId: string) => {
  const response = await fetch(
    `/api/points?` +
      new URLSearchParams({
        userId: userId,
      }),
    {
      method: 'GET',
    }
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function Page() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { user } = useKindeBrowserClient();
  const [bgSize, setBgSize] = React.useState('bg-pos-0');

  const [drawerBgSize, setDrawerBgSize] = React.useState('bg-pos-0');

  React.useEffect(() => {
    let random = Math.floor(Math.random() * 6) * 20;
    if (modalOpen) {
      setDrawerBgSize(`bg-pos-${random}`);
    }
  }, [modalOpen]);

  const { data, isLoading } = useQuery({
    queryKey: ['points'],
    queryFn: () => getConsumptionPoints(user?.id ?? ''),
    staleTime: 5 * 1000,
    enabled: !!user?.id,
  });

  const remainingPoints = data ? data[0]?.total_points - data[0]?.used_points : 0;

  const openQRcodeFullScreen = () => {
    setModalOpen(false);
  };

  return (
    <div className="h-max-screen w-full flex flex-col">
      <div
        className={`flex flex-col mt-24 mx-24 text-center justify-center p-8 rounded-2xl transition-all duration-1000 animate-gradient-x bg-gradient-to-r from-blue-900 via-pink-200 to-pink-600 bg-size-200 shadow-2xl ${bgSize}`}
      >
        {data?.length && (
          <h1 className="mb-8 text-4xl font-light">You have: {remainingPoints} sjoef points</h1>
        )}
        {data?.length === 0 ? (
          <h1>Buy your first shouf points</h1>
        ) : (
          <div className="flex flex-col justify-center">
            {user && user.id && (
              <Drawer>
                <DrawerTrigger>
                  <div>
                    <QRCode
                      value={user.id}
                      className="m-auto cursor-pointer rounded-md"
                      onClick={openQRcodeFullScreen}
                    />
                    <p>click qr code to enlarge and show to scan</p>
                  </div>
                </DrawerTrigger>

                <DrawerContent
                  className={`w-full h-full transition-all duration-300 rounded-2xl animate-gradient-x bg-gradient-to-r from-pink-600 via-blue-400 to-blue-900 bg-size-200 ${drawerBgSize}`}
                >
                  <DrawerClose className="w-full h-full">
                    <QRCode
                      value={user.id}
                      size={800}
                      className="m-auto rounded-2xl"
                      onClick={openQRcodeFullScreen}
                    />
                  </DrawerClose>
                </DrawerContent>
              </Drawer>
            )}
          </div>
        )}
      </div>
      <div
        className={`mt-80 mb-24 mx-24 p-8 transition-all duration-300 rounded-2xl h-1/2 animate-gradient-x bg-gradient-to-r from-pink-600 via-blue-400 to-blue-900 bg-size-200 ${bgSize}`}
      >
        <ConsumptionPointsCheckoutForm setBgSize={setBgSize} />
      </div>
    </div>
  );
}
