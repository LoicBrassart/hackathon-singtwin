import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

export default function Performances({ performances, setSingAlong }) {
  const vid = useRef(null);

  useEffect(() => {
    if (vid) setSingAlong(vid);
  }, [vid]);

  if (performances.length) {
    return (
      <video
        src={`http://localhost:8080/${performances[0].fileName}`}
        id="sing-along"
        ref={vid}
      >
        <track src="" kind="captions" />
      </video>
    );
  }
  return (
    <p>
      Found no performances this time, you have the scene for yourself ! \o/
    </p>
  );
}

Performances.propTypes = {
  performances: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setSingAlong: PropTypes.func.isRequired,
};
