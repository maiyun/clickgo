import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { layoutClassPrepend, stylePrepend } from '../../lib/tool.js';

const scope = css => stylePrepend(css, 'test_').style;
assert.equal(scope('.wrap:hover .object{transform:translateY(-6px)}'),
    '.test_wrap:hover .test_object{transform:translateY(-6px)}');
assert.equal(scope('@media(hover:hover){.wrap:hover .object{transform:translateY(-6px)}.wrap svg{display:block}}'),
    '@media(hover:hover){.test_wrap:hover .test_object{transform:translateY(-6px)}.test_wrap .test_tag-svg{display:block}}');
assert.equal(scope('@supports(display:grid){@media screen and (min-width:2.5px){.wrap{display:grid}}}'),
    '@supports(display:grid){@media screen and (min-width:2.5px){.test_wrap{display:grid}}}');
assert.equal(scope('@media(prefers-reduced-motion:reduce){.wrap .object,.wrap:hover .object{transform:none}.wrap:empty{}}'),
    '@media(prefers-reduced-motion:reduce){.test_wrap .test_object,.test_wrap:hover .test_object{transform:none}.test_wrap:empty{}}');
const animation = '@keyframes rise{from{opacity:0}50%,to{opacity:1}}.wrap{animation:rise 1s;animation-name:rise}';
assert.equal(scope(animation),
    '@keyframes test_rise{from{opacity:0}50%,to{opacity:1}}.test_wrap{animation:test_rise 1s;animation-name:test_rise}');
assert.equal(scope('@font-face{font-family:Face;src:url(face.woff)}.wrap{font-family:Face}'),
    '@font-face{font-family:test_Face;src:url(face.woff)}.test_wrap{font-family:test_Face}');

const dom = new JSDOM('<!doctype html><html><head></head></html>');
const style = dom.window.document.createElement('style');
style.textContent = scope(readFileSync(new URL('../../sources/control/cube/style.css', import.meta.url), 'utf8'));
dom.window.document.head.append(style);
const rules = [...style.sheet.cssRules];
const hover = rules.find(rule => rule.conditionText === '(hover: hover)' || rule.conditionText === '(hover:hover)');
const reduced = rules.find(rule => rule.conditionText?.includes('prefers-reduced-motion'));
assert.ok(hover && reduced, 'Cube must retain both media conditions');
assert.equal(hover.cssRules[0].selectorText, '.test_wrap:hover .test_object');
assert.match(hover.cssRules[0].style.transform, /translate3d\(.*rotateX\(-40deg\).*rotateY\(-35deg\)/);
assert.equal(reduced.cssRules[0].selectorText, '.test_wrap .test_object,.test_wrap:hover .test_object');
assert.equal(reduced.cssRules[0].style.transform, 'rotateX(-30deg) rotateY(-45deg)', 'reduced motion must preserve the static three-dimensional cube');
assert.equal(reduced.cssRules[1].selectorText, '.test_wrap .test_top::after,.test_wrap:hover .test_top::after');
assert.equal(reduced.cssRules[1].style.animation, 'none');
assert.ok(rules.some(rule => rule.name === 'test_sheen'), 'animation names must retain the same scope');

// layoutClassPrepend: multiline static/dynamic class, object ternary values, arrays, self-closing & v-bind:class
assert.equal(
    layoutClassPrepend('<div class="card\n  fa-check\n  active"></div>', ['p_']),
    '<div class="p_card fa-check p_active"></div>'
);
assert.equal(
    layoutClassPrepend(`<layout\n    class="server-card"\n    :class="{\n        'server-card--selected': targetUids.includes(s.uid) && s.uid !== sourceUid[0],\n        'server-card--source': s.uid === sourceUid[0],\n        active: cond ? a : b,\n    }"\n    @click.stop="toggle(s.uid)"\n></layout>`, ['p_']),
    `<layout\n    class="p_server-card"\n    :class="{[classPrepend('server-card--selected')]: targetUids.includes(s.uid) && s.uid !== sourceUid[0], [classPrepend('server-card--source')]: s.uid === sourceUid[0], [classPrepend('active')]: cond ? a : b}"\n    @click.stop="toggle(s.uid)"\n></layout>`
);
assert.equal(
    layoutClassPrepend(`<div :class="[\n    'a',\n    { [dynKey]: ok, 'b': flag ? 1 : 0 },\n    extraClass\n]"/>`, ['p_']),
    `<div :class="[classPrepend('a'),{[classPrepend(dynKey)]: ok, [classPrepend('b')]: flag ? 1 : 0},classPrepend(extraClass)]"/>`
);
assert.equal(
    layoutClassPrepend(`<div v-bind:class='{ "ok": ready, bare: true }'></div>`, ['p_']),
    `<div :class='{[classPrepend("ok")]: ready, [classPrepend("bare")]: true}'></div>`
);
assert.equal(
    layoutClassPrepend('<div :class="ok ? \'yes\' : \'no\'"></div>', ['p_']),
    '<div :class="classPrepend(ok ? \'yes\' : \'no\')"></div>'
);

console.log('Style scoping and layoutClassPrepend tests passed.');
