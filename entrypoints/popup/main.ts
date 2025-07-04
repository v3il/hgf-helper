import 'reflect-metadata';
import './style.css';
import { PopupView } from './views';
import { mount } from 'svelte';

mount(PopupView, {
    target: document.body
});
