import { version } from '../../package.json';
import { Router } from 'express';
import sql from './sql';
import log from './log';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/sql', sql({ config, db }));

  api.use('/logs', log({ config, db }));

  // perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
