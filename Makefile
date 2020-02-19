lint:
	npx eslint .

publish:
	npm publish --dry-run

test:
	npx jest index.test.js

install:
	npm install
