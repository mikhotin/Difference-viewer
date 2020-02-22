lint:
	npx eslint .

publish:
	npm publish --dry-run

test:
	npx jest index.test.js --coverage

install:
	npm install
