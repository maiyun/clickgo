import type Accordion from '../code';
import type AccordionItem from '../../accordion-item/code';

let sequence = 0;
const prefix = `cg-accordion-${Math.random().toString(36).slice(2)}`;

export function createId(): string {
    return `${prefix}-${++sequence}`;
}

export function normalize(value: string[], multiple: boolean): string[] {
    const result = [...new Set(value.filter(item => typeof item === 'string' && item.length > 0))];
    return multiple ? result : result.slice(0, 1);
}

export function toggle(parent: Accordion, item: AccordionItem): void {
    if (!item.props.name || item.isDisabled || !parent.access.items?.has(item.element)) return;
    const value = normalize(parent.value, parent.propBoolean('multiple'));
    const model = [...parent.props.modelValue];
    const multiple = parent.propBoolean('multiple');
    const name = item.props.name;
    const expanded = !value.includes(item.props.name);
    const next = expanded
        ? (parent.propBoolean('multiple') ? [...value, item.props.name] : [item.props.name])
        : value.filter(name => name !== item.props.name);
    const detail = { value: [...next], name, expanded };
    const event = { go: true, detail, preventDefault() { this.go = false; } };
    parent.emit('beforechange', event);
    if (!event.go || item.isDisabled || !parent.access.items?.has(item.element) ||
        item.props.name !== name || multiple !== parent.propBoolean('multiple') ||
        model.length !== parent.props.modelValue.length || model.some((v, i) => v !== parent.props.modelValue[i]) ||
        value.length !== parent.value.length || value.some((v, i) => v !== parent.value[i])) return;
    for (const child of parent.access.items.values()) {
        if (!next.includes(child.props.name)) child.restoreFocus();
    }
    parent.value = [...next];
    parent.emit('update:modelValue', [...next]);
    if (!parent.access.items?.has(item.element)) return;
    parent.emit('changed', { detail: { value: [...next], name: item.props.name, expanded } });
}

export function move(parent: Accordion, item: AccordionItem, key: string): void {
    if (!parent.formFocus || !parent.access.items || !parent.refs.list) return;
    const items = Array.from(parent.refs.list.children)
        .map(element => parent.access.items?.get(element as HTMLElement))
        .filter((entry): entry is AccordionItem => !!entry && !entry.isDisabled && !!entry.props.name);
    const index = items.indexOf(item);
    if (index < 0 || !items.length) return;
    let target = index;
    if (key === 'ArrowDown') target = (index + 1) % items.length;
    else if (key === 'ArrowUp') target = (index + items.length - 1) % items.length;
    else if (key === 'Home') target = 0;
    else if (key === 'End') target = items.length - 1;
    else return;
    items[target].refs.trigger?.focus();
}
