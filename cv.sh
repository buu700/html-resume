#!/bin/bash

if [ "$#" -ne '3' ] ; then
	echo './cv.sh input.html output.pdf "Your Name"'
	exit
fi

rm "${2}" "${2}.pdf"
echo -e "InfoKey: Title\nInfoValue: ${3} CV" > "${2}.metadata"

wkhtmltopdf "${1}" "${2}" --page-size letter --dpi 150 --margin-top 0.2in --margin-bottom 0.2in --margin-left 0.2in --margin-right 0.2in

pdftk "${2}" cat 1 output "${2}.pdf"

pdftk "${2}.pdf" update_info "${2}.metadata" output "${2}"

rm "${2}.pdf" "${2}.metadata"