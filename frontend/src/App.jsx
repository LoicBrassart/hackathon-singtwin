import { useEffect, useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { toast } from 'react-toastify';
import FormSearchSong from 'components/FormSearchSong';
import Controls from 'components/Controls';
import YTube from 'components/YTube';
import Performances from 'components/Performances';
import SApp from './SApp';

function App() {
  const ytSource = useRef(null);
  const [singAlong, setSingAlong] = useState(null);
  const singer = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [formData, setFormData] = useState({
    artist: '',
    song: '',
  });
  const [lyrics, setLyrics] = useState(null);
  const [title, setTitle] = useState('');
  const [vidId, setVidId] = useState(null);
  const [vidUrl, setVidUrl] = useState('https://www.youtube.com/embed/');
  const [performances, setPerformances] = useState([]);
  const [recordedChunks, setRecordedChunks] = useState([]);

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

  const handleRefUpdatesSing = () => {
    ytSource.current.src += '&autoplay=1';
    mediaRecorderRef.current = new MediaRecorder(singer.current.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current.addEventListener('dataavailable', ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    });
    mediaRecorderRef.current.start();
    if (performances.length > 0) {
      singAlong.current.play();
    }
  };

  const handleRefUpdatesStop = () => {
    mediaRecorderRef.current.stop();
  };

  return (
    <SApp>
      <h1>TwinSing!</h1>
      <FormSearchSong
        {...{ setVidId, setLyrics, setPerformances, formData, setFormData }}
      />
      <Controls
        {...{
          formData,
          setFormData,
          mediaRecorderRef,
          performances,
          singAlong,
          ytSource,
          setVidUrl,
          vidUrl,
          singer,
          recordedChunks,
          setRecordedChunks,
          handleRefUpdatesSing,
          handleRefUpdatesStop,
        }}
      />
      <h2>{title}</h2>
      <main>
        <YTube {...{ vidId, ytSource }} />
        <Performances {...{ performances, setSingAlong }} />
        <section className="Lyrics">{lyrics}</section>
        <Webcam className="singer" ref={singer} audio />
      </main>
    </SApp>
  );
}

export default App;
