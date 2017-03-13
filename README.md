# watch-less-do-more [![CircleCI](https://circleci.com/gh/JakeSidSmith/watch-less-do-more.svg?style=svg)](https://circleci.com/gh/JakeSidSmith/watch-less-do-more)

Watch less files and their dependency tree for changes & automatically recompile

## About

Rather than watching a directory for changes in any files, like other watchers, watch-less-do-more watches your main less file and automatically watches only its dependencies. If the main file, or any of it's dependencies change, the main file is compiled. This also allows you to watch multiple main files in a directory, and only compile the ones that have either changed themselves, or have had their dependencies changed. Additionally, this means that updating your node_modules (if any are dependencies of your less) will cause your less to recompile.

## Example

If we have the following files

```
main-a.less
main-b.less
dependency-of-a.less
dependency-of-b.less
dependency-of-a-and-b.less
not-related-to-other-files.less
```

And we run the command

```shell
watch-less-do-more -i main-a.less -o main-a.css -i main-b.less -o main-b.css
```

* Changes to `not-related-to-other-files.less` will not cause any less to compile.

* Changes to `dependency-of-a-and-b.less` will cause both `main-a.less` and `main-b.less` to recompile.

* Changes to `dependency-of-a.less` will cause only `main-a.less` to recompile.

* Changes to `dependency-of-b.less` will cause only `main-b.less` to recompile.

## Install

Install watch-less-do-more and less. Currently supports less `2.x.x`.

```shell
npm install less watch-less-do-more --save
```

## Usage

In these examples we're adding a script to our package.json

### Single main file

```json
{
  "watch-less": "watch-less-do-more -i source.less -o output.css"
}
```

### Multiple main files

You can define as many files as you like, as long as there is an output argument for every input file

```json
{
  "watch-less": "watch-less-do-more -i source-a.less -o output-a.css -i source-b.less -o output-b.css"
}
```

### PostCSS

You can use PostCSS modules with watch-less-do-more incredibly easily.
Just install the modules you want, and tell watch-less-do-more to use them in the same way you would with PostCSS.

```json
{
  "watch-less": "watch-less-do-more -u autoprefixer -i source.less -o output.css"
}
```

### Options

```shell
--input, -i   Path to input LESS file                      [string] [required]
--output, -o  Path to output CSS file                      [string] [required]
--use, -u     PostCSS module to use                                   [string]
--help        Show help                                              [boolean]
--version     Show version number                                    [boolean]
```
