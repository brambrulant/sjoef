import React from 'react';
import { Container, Modal, Text, Title, useMantineTheme } from '@mantine/core';
import { useQuery } from 'react-query';
import useToken from '@/functions/useToken';
import ConsumptionPointsCheckoutForm from '@/components/CheckoutForm/ConsumptionPointsCheckoutForm';
import QRCode from 'qrcode.react';

export default function Drankkaart() {
  const theme = useMantineTheme();
  const { token, isLoading: isAuthLoading, user } = useToken();
  const [modalOpen, setModalOpen] = React.useState(false);

  const fetchConsumptionPoints = async () => {
    const response = await fetch(`http://localhost:3000/api/consumption-points-user/${user?.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data, status } = useQuery('consumptionPoints', fetchConsumptionPoints, {
    enabled: !!token,
  });

  const remainingPoints = data ? data[0].total_points - data[0].used_points : 0;

  if (isAuthLoading || !user) return <Container>loading...</Container>;

  const openQRcodeFullScreen = () => {
    setModalOpen(true);
  };

  return (
    <Container className="flex flex-col text-center justify-center p-8 animate-gradient-x bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-xl shadow-2xl">
      {status === 'loading' && <Text>Loading...</Text>}
      {status === 'error' && <Text>An error has occurred</Text>}
      {status === 'success' && data.length && (
        <Title className="mb-8">You currently have: {remainingPoints} points</Title>
      )}
      {data?.length === 0 ? (
        <Title>Buy your first shouf points</Title>
      ) : (
        <div className="flex flex-col justify-center">
          {user.id && (
            <div>
              <QRCode
                value={user.id}
                className=" m-auto cursor-pointer"
                onClick={openQRcodeFullScreen}
              />
              <Text>click qr code to enlarge</Text>
              <Modal
                fullScreen
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                onClick={() => setModalOpen(false)}
              >
                <div className="flex">
                  <QRCode value={user.id} size={800} className="m-auto" />
                </div>
              </Modal>
            </div>
          )}
        </div>
      )}
      <ConsumptionPointsCheckoutForm />
    </Container>
  );
}
