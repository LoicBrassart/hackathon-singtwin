import styled from 'styled-components';

const SApp = styled.div`
  main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
      '. .'
      '. .';
    width: 100vw;
    height: 80vh;

    > * {
      overflow-y: scroll;
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
    }
  }
`;

export default SApp;
