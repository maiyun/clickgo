import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public html = `<h1>Hello world!</h1>
<button>Button</button>
<h2>H2 title</h2>
<div>div</div>
<h3>H3 title</h3>
<input onclick="alert('alert')">
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
<style>li{background:red;}div{background:blue;}#li{background:yellow;}</style>`;

    public css = `div{background:blue;}.test{background:red;}#li{background:yellow;}`;

    public lcss = '';

    public rcss = '';

}
