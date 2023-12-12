#!/usr/bin/env node

import {program} from 'commander';
import {generate} from '../src/index.js';

program
	.name('htmlResume')
	.argument('<inputPath>', 'Path of input HTML file')
	.argument('<outputPath>', 'Path of output PDF file')
	.option('--pages <pages>', 'Number of pages')
	.action(async (inputPath, outputPath, {pages}) =>
		generate({
			inputPath,
			outputPath,
			pages
		})
	)
	.hook('postAction', () => {
		process.exit();
	});

await program.parseAsync();
