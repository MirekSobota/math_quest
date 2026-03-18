What changed:
- netlify.toml now uses only `npm run build`
- Node pinned to 20 via `.nvmrc` and `.node-version`
- NPM_FLAGS set to `--include=dev` so Netlify installs devDependencies during its automatic install step
- package.json includes `engines.node = 20.x`

Why:
- Netlify already runs an automatic dependency install before the build command.
- Running `npm ci` again inside build.command caused a second install and your build then failed with `tsc: not found`.
- Your project needs devDependencies like TypeScript/Vite for building.
