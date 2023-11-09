#!/bin/bash

if [ "$#" -ne '3' ] ; then
	echo './cv.sh input.html output.pdf "Your Name"'
	exit
fi

cd $(cd "$(dirname "$0")" ; pwd)

rm "${2}" "${2}.pdf" .tmp.html 2> /dev/null
cp "${1}" .tmp.html
echo -e "InfoKey: Title\nInfoValue: ${3} CV" > "${2}.metadata"

node -e "(async () => {
	const path	= require('path');

	const browser	= await require('puppeteer').launch();
	const page		= await browser.newPage();

	await page.goto('file://' + path.resolve('.tmp.html'));

	await new Promise(resolve => setTimeout(resolve, 1000));

	await page.pdf({
		displayHeaderFooter: false,
		format: 'letter',
		margin: {
			bottom: '0.2in',
			left: '0.2in',
			right: '0.2in',
			top: '0.2in'
		},
		pageRanges: '1',
		path: '${2}.pdf',
		scale: 0.9,
		tagged: true
	});

	await browser.close();
	process.exit();
})().catch(err => {
	console.error(err);
	process.exit(1);
})"


pdftk "${2}.pdf" update_info "${2}.metadata" output "${2}"

rm "${2}.pdf" "${2}.metadata" .tmp.html
