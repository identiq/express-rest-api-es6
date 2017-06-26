import {Router} from 'express';
import glob from 'glob';
import path from 'path';
import {readLine} from '../lib/util';
import config from '../config.json';

export default ({config, db}) => {

  let log = Router();

  log.get('/', (req, res) => {

    glob(path.join(__dirname, config.logsDir, '*.log'), (err, matches) => {

      if (err) {
        return res.statusCode(404);
      }

      let promises = matches.map((file) => readLine(file));

      Promise.all(promises).then((logs) => {
        res.json({data: logs.reduce((a, b) => a.concat(b))});
      }).catch((err) => {
        res.json({err: err})
      });

    });

  });

  return log;

};
