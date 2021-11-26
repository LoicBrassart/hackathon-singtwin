import { useEffect, useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { toast } from 'react-toastify';
import SApp from './SApp';

function App() {
  const ytKey = 'AIzaSyA1fMmD_gz2mtu5AgP3CQuwSb2xSAGNJDc';

  const ytSource = useRef(null);
  const singAlong = useRef(null);
  const singer = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [lyrics, setLyrics] = useState(null);
  const [title, setTitle] = useState('');
  const [vidId, setVidId] = useState(null);
  const [vidUrl, setVidUrl] = useState('https://www.youtube.com/embed/');
  const [formData, setFormData] = useState({
    artist: '',
    song: '',
  });
  const [performances, setPerformances] = useState([]);
  const [recordedChunks, setRecordedChunks] = useState([]);

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

  const handleDataAvailable = ({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  };

  useEffect(() => {
    if (!vidId) return null;

    setVidUrl(`https://www.youtube.com/embed/${vidId}`);
    axios
      .get(`http://youtube.com/oembed?url=${vidUrl}&format=json`)
      .then(({ data }) => {
        setTitle(data.title);
      })
      .catch((err) => {
        toast.error(err);
      });
    return null;
  }, [vidId]);

  const handleClickSing = () => {
    toast.success("Let's Rock !!!");
    if (performances.length) {
      singAlong.current.play();
    }
    ytSource.current.src += '&autoplay=1';
    setVidUrl(`${vidUrl}&autoplay=1`);
    mediaRecorderRef.current = new MediaRecorder(singer.current.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  };

  const handleClickStop = () => {
    mediaRecorderRef.current.stop();
  };

  return (
    <SApp>
      <h1>Karaotwin!</h1>
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
      <button type="button" onClick={handleClickSing}>
        Sing!
      </button>
      <button type="button" onClick={handleClickStop}>
        Stop!
      </button>
      {recordedChunks.length > 0 && (
        <button type="button" onClick={handleDownload}>
          Download
        </button>
      )}
      <h2>{title}</h2>
      <main>
        <iframe
          id="video"
          title="Youtube Source"
          src={`//www.youtube.com/embed/${vidId}?rel=0`}
          frameBorder="0"
          allowFullScreen
          ref={ytSource}
        />
        {performances.length > 0 ? (
          <video
            src={`http://localhost:8080/${performances[0].fileName}`}
            id="sing-along"
            ref={singAlong}
          >
            <track src="" kind="captions" />
          </video>
        ) : (
          <p>
            Found no performances this time, you have the scene for yourself !
            \o/
          </p>
        )}
        <section className="Lyrics">{lyrics}</section>
        <Webcam className="singer" ref={singer} audio />
      </main>
    </SApp>
  );
}

export default App;
