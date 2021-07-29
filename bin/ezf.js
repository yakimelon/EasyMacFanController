#! /usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));
const { execSync } = require('child_process');

// exec smc command.
function smc(options) {
    return execSync('sudo /Applications/smcFanControl.app/Contents/Resources/smc ' + options);
}

function getFanCount() {
    return smc('-f').toString().split('\n')[0].slice(-1);
}

function changeAllFansForceMode(fanCount) {
    const target = ((2 ** fanCount) - 1).toString(16);
    smc('-k "FS! " -w 000' + target);
}

function changeFanRotationSpeed(fanNumber, speed) {
    smc('-k F' + fanNumber + 'Tg -w ' + fanSpeedMapper(speed));
}

function fanSpeedMapper(speed) {
    return (speed << 2).toString(16);
}

// show help
if (argv.help || argv.h) {
    console.log("" +
        "Options:\n" +
        "  -h, --help             display help for command\n" +
        "  -s, --status           Check mac fan status\n" +
        "  -a, --auto             Change mac fan all auto mode\n" +
        "  -m, --max              Maximize all fans speed\n" +
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

// maximize all fans speed
if (argv.max !== undefined || argv.m !== undefined) {
    // change mac fan mode
    const fanCount = getFanCount();
    changeAllFansForceMode(fanCount);

    // [fan#0 speed, fan#1 speed...]
    const maximumSpeeds = smc('-f')
        .toString()
        .split('\n')
        .filter(x => x.indexOf('Maximum') !== -1)
        .map(x => x.split(':')[1]
        .slice(1));

    // change mac fan rotate speed
    for (let i = 0; i < fanCount; i++) changeFanRotationSpeed(i, maximumSpeeds[i]);

    console.log("Maximize all fans speed.");
    return;
}

// change mac fan rotate speed
if (argv.rotate !== undefined || argv.r !== undefined) {
    // change mac fan mode
    const fanCount = getFanCount();
    changeAllFansForceMode(fanCount);

    // change mac fan rotate speed
    const speed = argv.r || argv.rotate;
    for (let i = 0; i < fanCount; i++) changeFanRotationSpeed(i, speed);

    console.log("changed mac fan rotation speed.");
    return;
}

console.log('Command not found. Please enter "ezf -h".');