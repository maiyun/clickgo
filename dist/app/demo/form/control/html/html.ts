import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public htmlIndex = 0;

    public html = [
        `<h1>Hello world!</h1>
<button>Button</button> <button disabled>Button2</button>
<h2>H2 title</h2>
<div>div</div>
<h3>H3 title</h3>
<input onclick="alert('alert')">
<h4>h4 title</h4>
<input type="email" disabled>
<ul>
    <li class="test">li</li>
    <li>li</li>
</ul>
<span>span</span>
<ol>
    <li>li</li>
    <li id="li">li</li>
</ol>
<script>alert('b');</script>
<style>li{background:red;}div{background:blue;}#li{background:yellow;}</style>`,
        `<h2>123</h2>
<button>Test</button>`
    ];

    public css = `div{background:blue;}.test{background:red;}#li{background:yellow;}`;

    public lcss = '';

    public rcss = '';

}
