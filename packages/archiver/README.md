# `@exobase/archiver`

> TODO: description

## Usage

```
const archive = require('@exobase/archiver');

await archive({
  source: 'build/*',
  destination: './destination.zip',
  exclude: ['destination.zip'],
  include: ['.gitignore']
})
```
