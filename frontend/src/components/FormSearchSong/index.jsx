import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

require('dotenv').config();

export default function FormSearchSong({
  setVidId,
  setLyrics,
  setPerformances,
  formData,
  setFormData,
}) {
  const ytKey = process.env.REACT_APP_YTKEY;
  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const { artist, song } = formData;
    const needle = `${artist} - ${song}`;
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?limit=1&key=${ytKey}&type=video&q=${needle}`
      )
      .then(({ data }) => {
        setVidId(data.items[0].id.videoId);
      })
      .catch((err) => {
        toast.error(err);
      });
    axios
      .get(`https://api.lyrics.ovh/v1/${artist}/${song}`)
      .then(({ data }) => {
        const rawLyrics = data.lyrics.split('\n').map((row) => {
          return <p>{row}</p>;
        });
        setLyrics(rawLyrics);
      })
      .catch((err) => {
        toast.error(err);
      });
    axios
      .get(`http://localhost:8080/performances?artist=${artist}&song=${song}`)
      .then(({ data }) => {
        setPerformances(data);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="search"
        name="artist"
        placeholder="Artist"
        value={formData.artist}
        onChange={handleChange}
      />
      <input
        type="search"
        name="song"
        placeholder="Song"
        value={formData.song}
        onChange={handleChange}
      />
      <input type="submit" value="Fetch!" />
    </form>
  );
}

FormSearchSong.propTypes = {
  setVidId: PropTypes.func.isRequired,
  setLyrics: PropTypes.func.isRequired,
  setPerformances: PropTypes.func.isRequired,
  formData: PropTypes.shape().isRequired,
  setFormData: PropTypes.func.isRequired,
};
