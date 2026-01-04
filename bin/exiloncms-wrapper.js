#!/usr/bin/env node

/**
 * ExilonCMS CLI Wrapper
 *
 * This wrapper provides the npm global CLI interface
 * It delegates to the PHP CLI script
 *
 * @package ExilonCMS
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXILONCMS_VERSION = '0.2.2';

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
};

function colorize(text, color = 'reset') {
    return colors[color] + text + colors.reset;
}

function printHeader(text) {
    console.log(`\n${colorize('='.repeat(60), 'bold')}`);
    console.log(`${colorize(`  ${text}`, 'bold')}`);
    console.log(`${colorize('='.repeat(60), 'bold')}\n`);
}

function printSuccess(message) {
    console.log(colorize(`  ✅ ${message}`, 'green'));
}

function printError(message) {
    console.error(colorize(`  ❌ ${message}`, 'red'));
}

function printInfo(message) {
    console.log(colorize(`  ℹ️  ${message}`, 'cyan'));
}

function checkPHP() {
    return new Promise((resolve) => {
        const php = spawn('php', ['-v']);
        php.on('error', () => resolve(false));
        php.on('close', (code) => resolve(code === 0));
    });
}

function getPHPVersion() {
    return new Promise((resolve) => {
        const php = spawn('php', ['-r', 'echo PHP_VERSION;']);
        let output = '';
        php.stdout.on('data', (data) => { output += data.toString(); });
        php.on('close', () => resolve(output.trim()));
    });
}

function runPHPCLI(args) {
    return new Promise((resolve, reject) => {
        const cliScript = join(__dirname, '..', 'bin', 'exiloncms');
        const php = spawn('php', [cliScript, ...args], {
            stdio: 'inherit'
        });

        php.on('error', (err) => {
            printError(`Failed to execute PHP: ${err.message}`);
            printInfo('Make sure PHP 8.2+ is installed and in your PATH');
            reject(err);
        });

        php.on('close', (code) => {
            resolve(code);
        });
    });
}

async function commandNew(args) {
    printHeader(`ExilonCMS CLI v${EXILONCMS_VERSION}`);

    // Check PHP
    printInfo('Checking PHP installation...');
    const hasPHP = await checkPHP();

    if (! hasPHP) {
        printError('PHP is not installed or not in PATH');
        printInfo('Please install PHP 8.2 or higher:');
        console.log(`\n  ${colorize('Windows:', 'yellow')} https://windows.php.net/download/`);
        console.log(`  ${colorize('macOS:', 'yellow')} brew install php`);
        console.log(`  ${colorize('Linux:', 'yellow')} sudo apt install php8.2 php8.2-xml php8.2-zip php8.2-mbstring\n`);
        process.exit(1);
    }

    const phpVersion = await getPHPVersion();
    printSuccess(`PHP ${phpVersion} found`);

    // Check minimum version
    const minVersion = '8.2';
    if (phpVersion && phpVersion.localeCompare(minVersion, undefined, { numeric: true }) < 0) {
        printError(`PHP ${minVersion} or higher is required (you have ${phpVersion})`);
        process.exit(1);
    }

    // Run PHP CLI
    try {
        const exitCode = await runPHPCLI(['new', ...args]);
        process.exit(exitCode);
    } catch (err) {
        process.exit(1);
    }
}

function commandVersion() {
    console.log(`ExilonCMS CLI version ${EXILONCMS_VERSION}`);
    console.log(`PHP wrapper for Node.js`);
    process.exit(0);
}

function commandHelp() {
    printHeader('ExilonCMS CLI');

    console.log('Usage: exiloncms <command> [options]\n');

    console.log(colorize('Commands:', 'yellow'));
    console.log(`  ${colorize('new', 'green')} <name>      Create a new ExilonCMS project`);
    console.log(`  ${colorize('version', 'green')}           Show version information`);
    console.log(`  ${colorize('help', 'green')}              Show this help message\n`);

    console.log(colorize('Examples:', 'yellow'));
    console.log('  exiloncms new my-site');
    console.log('  exiloncms new blog');
    console.log('  exiloncms version\n');

    console.log(`For more information, visit: ${colorize('https://github.com/Exilon-Studios/ExilonCMS', 'cyan')}\n`);

    process.exit(0);
}

// Main
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        return commandHelp();
    }

    const command = args[0];

    switch (command) {
        case 'new':
        case 'create':
            await commandNew(args.slice(1));
            break;
        case 'version':
        case '-v':
        case '--version':
            commandVersion();
            break;
        case 'help':
        case '-h':
        case '--help':
            commandHelp();
            break;
        default:
            commandHelp();
    }
}

main().catch((err) => {
    printError(`Unexpected error: ${err.message}`);
    process.exit(1);
});
