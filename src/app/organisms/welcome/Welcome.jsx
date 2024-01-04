import React, { useEffect, useState } from 'react';
import { Box } from 'folds';
import './Welcome.scss';

import initMatrix from '../../../client/initMatrix';

import Text from '../../atoms/text/Text';
import Spinner from '../../atoms/spinner/Spinner';

import SpaceTile from '../../molecules/space-tile/SpaceTile';

// import CinnySvg from '../../../../public/res/svg/cinny.svg';
import PinguiLabsLogo from '../../../../public/res/svg/pinguilabs.png';

function Welcome() {
  const mx = initMatrix.matrixClient;
  const [spaces, setSpaces] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      const publicRooms = (await mx.publicRooms()).chunk;
      setSpaces(publicRooms.filter((room) => room.room_type === 'm.space'));
    };
    fetchRooms();
  }, [mx]);

  return (
    <div className="app-welcome">
      <Box
        className="app-welcome__heading"
        direction="Row"
        grow="Yes"
        gap="300"
        alignItems="Center"
        justifyItems="Center"
      >
        <img
          className="app-welcome__heading__logo noselect"
          src={PinguiLabsLogo}
          alt="Pinguilabs logo"
        />
        <Text className="app-welcome__heading__text" variant="h1" weight="medium" primary>
          Pinguichat
        </Text>
      </Box>
      <div className="app-welcome__body">
        <Box direction="Column" grow="Yes" gap="300" alignItems="Center" justifyItems="Center">
          <Text className="app-welcome__body__title" variant="h1">
            Penguins Chatting, Do Not Disturb
          </Text>
          <Text className="app-welcome__body__subtitle" variant="h2" weight="light">
            Marching Towards Global Domination, One Code at a Time. Beware, the Penguins are Coding!
          </Text>
        </Box>
        <Box direction="Column" grow="Yes" gap="600" alignItems="Center" justifyItems="Center">
          <Text className="app-welcome__subheading" variant="h2" style={{ textAlign: 'center' }}>
            Our Spaces
          </Text>
          {spaces === null ? (
            <Spinner />
          ) : (
            spaces.map((space) => (
              <SpaceTile
                name={space.name}
                avatarSrc={space.avatar_url && mx.mxcUrlToHttp(space.avatar_url)}
                alias={space.canonical_alias}
                id={space.room_id}
                memberCount={space.num_joined_members}
              />
            ))
          )}
        </Box>
      </div>
    </div>
  );
}

export default Welcome;
