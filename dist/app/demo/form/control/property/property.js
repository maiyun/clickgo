"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.data = {
    'data': [
        {
            'kind': 'Design',
            'title': 'Name',
            'desc': 'The control name.',
            'type': 'property',
            'control': 'text',
            'default': 'Control1',
            'value': 'Control1'
        }, {
            'kind': 'Design',
            'title': 'Locked',
            'desc': 'Locked the control.',
            'type': 'property',
            'control': 'boolean',
            'default': 'false',
            'value': false
        }, {
            'kind': 'Layout',
            'title': 'Anchor',
            'desc': 'The anchor desc.',
            'type': 'property',
            'control': 'anchor',
            'default': 'left',
            'value': 'left, top'
        }, {
            'kind': 'Layout',
            'title': 'Dock',
            'desc': 'The dock.',
            'type': 'property',
            'control': 'dock',
            'default': 'none',
            'value': 'none'
        }, {
            'kind': 'Layout',
            'title': 'Location',
            'desc': 'Location of parent layout.',
            'type': 'property',
            'control': 'text',
            'default': '100, 1000',
            'value': '100, 1000',
            'sub': [
                {
                    'title': 'X',
                    'desc': 'X of location.',
                    'control': 'text'
                },
                {
                    'title': 'Y',
                    'desc': 'Y of location.',
                    'control': 'text'
                }
            ]
        }
    ]
};
