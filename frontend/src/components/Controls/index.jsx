import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function Controls({
  formData,
  setVidUrl,
  vidUrl,
  recordedChunks,
  setRecordedChunks,
  handleRefUpdatesSing,
  handleRefUpdatesStop,
}) {
  const [recording, setRecording] = useState(false);

  const handleDownload = () => {
    if (recordedChunks.length) {
      const data = new FormData();
      const config = {
        header: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });
      data.append('artist', formData.artist);
      data.append('song', formData.song);
      data.append('file', blob);

      axios
        .post('http://localhost:8080/performances', data, config)
        .then(() => {
          toast.success('Yay, we should have recorded it properly! ;-) ');
        })
        .catch(() => {
          toast.error('Oh noes, we lost your upload, sorry ! é_è');
        });
      setRecordedChunks([]);
    }
  };

  const handleClickSing = () => {
    toast.success("Let's Rock !!!");
    setVidUrl(`${vidUrl}&autoplay=1`);
    setRecording(true);

    handleRefUpdatesSing();
  };

  const handleClickStop = () => {
    setRecording(false);

    handleRefUpdatesStop();
  };
  return (
    <>
      {recording ? (
        <button type="button" onClick={handleClickStop}>
          Stop!
        </button>
      ) : (
        <button type="button" onClick={handleClickSing}>
          Sing!
        </button>
      )}

      {recordedChunks.length > 0 && (
        <button type="button" onClick={handleDownload}>
          Download
        </button>
      )}
    </>
  );
}

Controls.propTypes = {
  formData: PropTypes.shape().isRequired,
  setVidUrl: PropTypes.func.isRequired,
  vidUrl: PropTypes.string.isRequired,
  recordedChunks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setRecordedChunks: PropTypes.func.isRequired,
  handleRefUpdatesSing: PropTypes.func.isRequired,
  handleRefUpdatesStop: PropTypes.func.isRequired,
};
