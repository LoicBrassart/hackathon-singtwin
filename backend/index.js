const express = require('express');
const app = express();
const cors = require('cors');
const { backPort, db, uploadFile } = require('./conf');

app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hi!');
});

app.get('/performances', async (req, res) => {
  let sql = `
    SELECT 
      users.name AS userName, 
      performances.id AS perfId, 
      performances.song AS songTitle,
      performances.artist AS songArtist,
      performances.fileName AS fileName
    FROM 
      performances
      INNER JOIN users ON users.id=performances.idUser 
    WHERE 
      TRUE `;
  let sqlValues = [];
  const { artist, song, idUser } = req.query;
  if (artist) {
    sql += 'AND artist=? ';
    sqlValues.push(artist);
  }
  if (song) {
    sql += 'AND song=? ';
    sqlValues.push(song);
  }
  if (idUser) {
    sql += 'AND idUser=? ';
    sqlValues.push(idUser);
  }
  const [rows] = await db.query(sql, sqlValues);
  return res.send(rows);
});

app.post('/performances', (req, res) => {
  uploadFile(req, res, async (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    await db.query(
      'INSERT INTO performances (idUser, artist, song, fileName) VALUES(?,?,?,?)',
      [1, req.body.artist, req.body.song, req.file.filename]
    );
    return res.status(201).send(req.file);
  });
});

app.listen(backPort, () => {
  console.log('API for our Hackathon is available on ' + backPort);
});
