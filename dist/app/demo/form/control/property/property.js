import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    data = [
        {
            'kind': 'Design',
            'title': 'Name',
            'desc': 'The control name.',
            'type': 'property',
            'control': 'text',
            'default': 'Control1',
            'value': 'Control1'
        },
        {
            'kind': 'Design',
            'title': 'Locked',
            'desc': 'Locked the control.',
            'type': 'property',
            'control': 'check',
            'default': 'false',
            'value': 'false'
        },
        {
            'kind': 'Layout',
            'title': 'Like',
            'desc': 'The like desc.',
            'type': 'property',
            'control': 'select',
            'default': 'Button',
            'value': 'Button',
            'data': ['Button', 'Select', 'Check']
        },
        {
            'kind': 'Layout',
            'title': 'Dock',
            'desc': 'The dock.',
            'type': 'property',
            'control': 'dock',
            'default': 'none',
            'value': 'none'
        },
        {
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
                },
                {
                    'title': 'Z',
                    'desc': 'Z of location.',
                    'control': 'text'
                }
            ]
        },
        {
            'kind': 'Other',
            'title': 'Sub',
            'desc': 'Children.',
            'type': 'property',
            'control': 'text',
            'default': '',
            'value': '',
            'sub': [
                {
                    'title': 'Dock',
                    'desc': 'Dock of sub.',
                    'control': 'dock'
                },
                {
                    'title': 'Check',
                    'desc': 'Check of sub.',
                    'control': 'check'
                },
                {
                    'title': 'Select',
                    'desc': 'Select of sub.',
                    'control': 'select',
                    'data': ['', 'A', 'B', 'C']
                }
            ]
        },
        {
            'kind': 'Mouse',
            'title': 'MouseDown',
            'desc': 'On mouse down.',
            'type': 'event',
            'default': '',
            'value': 'mousedown'
        },
        {
            'kind': 'Mouse',
            'title': 'MouseUp',
            'desc': 'On mouse up.',
            'type': 'event',
            'default': '',
            'value': 'mouseup'
        },
        {
            'kind': 'Key',
            'title': 'KeyDown',
            'desc': 'On key down.',
            'type': 'event',
            'default': '',
            'value': 'kedown'
        },
        {
            'kind': 'Key',
            'title': 'KeyUp',
            'desc': 'On key up.',
            'type': 'event',
            'default': '',
            'value': 'keyup'
        }
    ];
}
