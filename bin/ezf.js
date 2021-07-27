#! /usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));
const { execSync } = require('child_process');

// exec smc command.
function smc(options) {
    return execSync('sudo /Applications/smcFanControl.app/Contents/Resources/smc ' + options);
}

// show help
if (argv.help || argv.h) {
    console.log("" +
        "Options:\n" +
        "  -h, --help             display help for command\n" +
        "  -s, --status           Check mac fan status\n" +
        "  -a, --auto             Change mac fan all auto mode\n" +
        "  -r, --rotate [speed]   Change mac fan rotate"
    );
    return;
}

// check mac fan status
if (argv.status !== undefined || argv.s !== undefined) {
    const stdout = execSync('/Applications/smcFanControl.app/Contents/Resources/smc -f');
    console.log(stdout.toString());
    return;
}

// change mac fan all auto mode
if (argv.auto !== undefined || argv.a !== undefined) {
    smc('-k "FS! " -w 0000');
    console.log("changed mac fan all auto mode.");
    return;
}

// change mac fan rotate speed
if (argv.rotate !== undefined || argv.r !== undefined) {
    // change mac fan mode
    const fanCount = smc('-f').toString().split('\n')[0].slice(-1);
    const target = ((2 ** fanCount) - 1).toString(16);
    smc('-k "FS! " -w 000' + target);

    // change mac fan rotate speed
    const speed = argv.r || argv.rotate;
    for (let i = 0; i < fanCount; i++) {
        smc('-k F' + i + 'Tg -w ' + speed);
    }

    console.log("changed mac fan rotation speed.");
    return;
}

console.log('Command not found. Please enter "ezf -h".');