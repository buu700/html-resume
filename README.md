# html-resume

This is a small HTML/CSS "framework" that I use for my resume
([sample.pdf](https://github.com/buu700/html-resume/blob/master/sample.pdf?raw=true)).

## Usage

```
npm install html-resume
npx htmlResume /path/to/input.html /path/to/output.pdf
```

To limit the number of pages, set `--pages` to your intended page count, e.g.
`--pages 1`, or put it in the content of a `<meta>` element with `name="pages"`.

As a starting point, I've included the file
[template.html](https://github.com/buu700/html-resume/blob/master/template.html).
