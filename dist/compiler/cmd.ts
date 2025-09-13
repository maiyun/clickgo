/**
 * Project: clickgo-compiler, User: JianSuoQiYue
 * Date: 2024-2-20 15:40:13, 2025-5-27 00:06:51, 2025-9-13 01:09:12
 */

// npm publish --tag dev --access public

/**
 * --- clickgo 常用的本地库 ---
 * pkgdl dl clickgo@3.2.6 vue@3.5.21 jszip@3.10.0 monaco-editor@0.34.1
 */

import * as cmd from 'commander';
import * as compiler from './compiler.js';

const program = new cmd.Command();

program
    .name('clickgo')
    .description('Compile the source code for ClickGo Application, Control, and Theme into standalone files.')
    .version('1.0.0', '-v, --version');

// --- 下载包 ---
program
    .option('-b, --boot <path>', 'compile boot')
    .option('-g, --clickgo <path>', 'clickgo path')
    .option('-c, --control <path...>', 'compile controls')
    .option('-t, --theme <path>', 'compile theme')
    .option('-a, --app <path>', 'compile application')
    .option('-i, --icon <path>', 'application icon')
    .option('-s, --save <path>', 'save path')
    .action(function() {
        const opts = program.opts();
        if (opts.boot) {
            // --- boot ---
            compiler.boot(opts.boot, opts.clickgo, opts.save).then((r: any) => {
                console.log(`Boot result: ${r}.`);
            }).catch(() => {});
        }
        else if (opts.control) {
            // --- control ---
            compiler.control(opts.control, opts.save).then((r: any) => {
                console.log(`Controls result: ${r}.`);
            }).catch(() => {});
        }
        else if (opts.theme) {
            // --- theme ---
            compiler.theme(opts.theme, opts.save).then((r: any) => {
                console.log(`Theme result: ${r}.`);
            }).catch(() => {});
        }
        else if (opts.app) {
            // --- application ---
            compiler.application(opts.app, opts.icon, opts.save).then((r: any) => {
                console.log(`Application result: ${r}.`);
            }).catch(() => {});
        }
    });

program.parse();
