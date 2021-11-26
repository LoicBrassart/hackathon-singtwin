import PropTypes from 'prop-types';

export default function YTube({ vidId, ytSource }) {
  if (vidId) {
    return (
      <iframe
        id="video"
        title="Youtube Source"
        src={`//www.youtube.com/embed/${vidId}?rel=0`}
        frameBorder="0"
        allowFullScreen
        ref={ytSource}
      />
    );
  }
  return <p>Search an artist+song to get a YTube sing-along</p>;
}

YTube.propTypes = {
  vidId: PropTypes.string,
  ytSource: PropTypes.shape().isRequired,
};
YTube.defaultProps = {
  vidId: null,
};
