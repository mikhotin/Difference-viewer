lint:
	npx eslint .

publish:
	npm publish --dry-run

test:
	npx babel-node src/bin/gendiff.js

install:
	npm link
