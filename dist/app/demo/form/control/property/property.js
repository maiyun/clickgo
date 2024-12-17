"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.data = [
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
}
exports.default = default_1;
