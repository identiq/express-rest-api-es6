import {Router} from 'express';
import {readFile} from '../lib/util';
import {logSql} from '../lib/util';
import config from '../config.json';

export default ({config, db}) => {

  let sql = Router();

  sql.get('/:query', (req, res) => {

    readFile(config.sqlDir + '/{file}.sql'.replace('{file}', req.params.query), 'utf8')
      .then((data) => {

        db.connect((err) => {
          if (err) throw err;

          logSql(data);

          db.query(data, [], (err, result) => {
            if (err) throw err;

            db.end((err) => {
              if (err) throw err;
            });

            res.json({req: req.params, data: result});

          });
        });

      })
      .catch((err) => {

        console.log(err);
        res.json({req: req.params, err: err});

      });

  });

  return sql;

};
