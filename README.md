# EasyMacFanController

EasyMacFanController (EZF) is a command that allows you to control the fan speed of your Mac from the CLI.
Access to MacBook fans is done through [smcFanControl](https://github.com/hholtmann/smcFanControl), but EZF is a simpler and more elegant way to control MacBook fans.

# Features

- All functions are available in the CLI.
- You can see information about the fans.
- The fan speed can be changed.

# Usage

See information about the all fans.

```
$ ezf --status
```

Change all fans rotation speed.  
(Set the speed to less than the "maximum speed" and more than the "minimum speed".)

```
$ ezf --rotate [speed]
```

Change all fans to auto rotate mode.

```
$ ezf --auto
```

# Installation

1. Install the smcFanControl with Homebrew.
2. Install the EZF with npm.

```
$ brew install smcfancontrol --cask
$ npm install -g ezf
```

## License
 
[MIT](http://TomoakiTANAKA.mit-license.org)</blockquote>