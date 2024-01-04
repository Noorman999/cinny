import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SpaceTile.scss';

import { Spinner } from 'folds';
import initMatrix from '../../../client/initMatrix';
import { twemojify } from '../../../util/twemojify';

import colorMXID from '../../../util/colorMXID';

import Text from '../../atoms/text/Text';
import Avatar from '../../atoms/avatar/Avatar';
import Button from '../../atoms/button/Button';

import { createSpaceShortcut } from '../../../client/action/accountData';

import { getSpaceChildren } from '../../utils/room';

function SpaceTile({ avatarSrc, name, id, alias, memberCount, desc, options }) {
  const mx = initMatrix.matrixClient;
  const [joined, setJoined] = useState(initMatrix.roomList.spaces.has(id));
  const [isLoading, setIsLoading] = useState(false);

  const onSpaceToggle = async () => {
    setIsLoading(true);
    if (joined) {
      await mx.leaveRoomChain(id).catch((e) => console.error(e));
      setJoined(false);
    } else {
      await mx.joinRoom(id).catch((e) => console.error(e));
      createSpaceShortcut(id);
      const space = mx.getRoom(id);
      const rooms = getSpaceChildren(space);
      rooms.forEach((room) => {
        mx.joinRoom(room).catch((e) => console.error(e));
      });
      setJoined(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="room-tile">
      <div className="room-tile__avatar">
        <Avatar imageSrc={avatarSrc} bgColor={colorMXID(id)} text={name} />
      </div>
      <div className="room-tile__content">
        <Text variant="s1">{twemojify(name)}</Text>
        <Text variant="b3">
          {alias + (memberCount === null ? '' : ` • ${memberCount} members`)}
        </Text>
        {desc !== null && typeof desc === 'string' ? (
          <Text className="room-tile__content__desc" variant="b2">
            {twemojify(desc, undefined, true)}
          </Text>
        ) : (
          desc
        )}
      </div>
      {options !== null && <div className="room-tile__options">{options}</div>}
      {isLoading ? (
        <Spinner size="600" />
      ) : (
        <Button variant={joined ? 'danger' : 'primary'} onClick={onSpaceToggle}>
          {joined ? 'Leave' : 'Join'}
        </Button>
      )}
    </div>
  );
}

SpaceTile.defaultProps = {
  avatarSrc: null,
  alias: null,
  options: null,
  desc: null,
  memberCount: null
};
SpaceTile.propTypes = {
  avatarSrc: PropTypes.string,
  alias: PropTypes.string,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  memberCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  desc: PropTypes.node,
  options: PropTypes.node
};

export default SpaceTile;
