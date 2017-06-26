import fs from 'fs';
import path  from 'path';
import { createLogger } from 'bunyan';
import RotatingFileStream from 'bunyan-rotating-file-stream';
import es from 'event-stream';

const sqlLogger = createLogger({
  name: 'sql',
  streams: [{
    stream: new RotatingFileStream({
      path: path.join(__dirname, '../assets/logs/log-%N.log'),
      threshold: '1k'
    })
  }]
});

/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
export function toRes(res, status=200) {
	return (err, thing) => {
		if (err) return res.status(500).send(err);

		if (thing && typeof thing.toObject==='function') {
			thing = thing.toObject();
		}
		res.status(status).json(thing);
	};
}

export function readFile(fileName, type) {
  return new Promise(function(resolve, reject){
    fs.readFile(path.join(__dirname, fileName), type, (err, data) => {
      if (err) { reject(err); }
      resolve(data);
    })
  });
}

export function readLine(file) {
  return new Promise((resolve, reject) => {

    let logs = [];

    fs.createReadStream(file)
      .pipe(es.split())
      .pipe(es.mapSync((line) => {

        if(!line) return;

        logs.push(JSON.parse(line));

      }))
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => {
        resolve(logs);
      });

  })
}

export function logSql(sql) {
  return sqlLogger.info(sql);
}