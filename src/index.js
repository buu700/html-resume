#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import {setTimeout} from 'node:timers/promises';
import {fileURLToPath} from 'node:url';
import {PDFDocument} from 'pdf-lib';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultTitle = 'Resume';

export const generate = async ({inputPath, outputPath, pages}) => {
	if (!inputPath || !outputPath) {
		throw new Error('Missing input or output path.');
	}

	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(`file://${path.resolve(inputPath)}`, {
		waitUntil: 'domcontentloaded'
	});

	await page.addStyleTag({
		url: `file://${path.join(__dirname, 'index.css')}`
	});
	await setTimeout(1000);

	const name = await page
		.$eval(
			'div:first-child > div:first-child',
			elem => elem.textContent?.trim() ?? ''
		)
		.catch(() => '');

	if (isNaN(pages) || pages < 1) {
		try {
			pages = parseInt(
				await page.$eval(
					'meta[name="pages"]',
					elem => elem.attributes.content?.value
				),
				10
			);
		}
		catch {}
	}

	const pdf = await PDFDocument.load(
		await page.pdf({
			displayHeaderFooter: false,
			format: 'letter',
			margin: {
				bottom: '0.19in',
				left: '0.2in',
				right: '0.2in',
				top: '0.2in'
			},
			pageRanges:
				isNaN(pages) || pages < 1 ?
					undefined :
				pages === 1 ?
					'1' :
					`1-${pages.toString()}`,
			scale: 0.9,
			tagged: true
		})
	);

	await browser.close();

	pdf.setTitle(`${name} ${defaultTitle}`.trim());

	await fs.writeFile(path.resolve(outputPath), await pdf.save());
};
