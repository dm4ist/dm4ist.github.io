'use strict';

function Doings(name, progress = 'open', priority) {
    this.name = name;
    this.progress = progress;
    this.priority = priority;
}