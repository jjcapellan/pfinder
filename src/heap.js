class Heap {
    constructor(prop) {
        this.items = [];
        this.prop = prop;
    }

    push(item) {
        if (!this.items.length) {
            item.inOpen = true;
            this.items.push(item);
            return;
        }

        for (let i = this.items.length - 1; i >= 0; i--) {

            if (this.items[i][this.prop] >= item[this.prop]) {
                this.items.splice(i + 1, 0, item);
                return;
            }
        }

        this.items.unshift(item);
    }
}

class MultiHeap {
    constructor(prop, range, size) {
        let heaps = [];
        for (let i = 0; i < size; i++) {
            heaps.push(new Heap(prop));
        }
        this.heaps = heaps;
        this.prop = prop;
        this.range = range;
        this.count = 0;
    }

    addHeaps(n) {
        for (let i = 0; i < n; i++) {
            this.heaps.push(new Heap(this.prop));
        }
    }

    push(item) {
        this.count++;
        let index = (item[this.prop] / this.range) | 0;
        if (index > (this.heaps.length - 1)) this.addHeaps(index - ((this.heaps.length - 1)));
        this.heaps[index].push(item);
    }

    pop() {
        this.count--;
        if (this.count < 0) {
            this.count = 0;
            return null;
        }
        for (let i = 0; i < this.heaps.length; i++) {
            if (this.heaps[i].items.length) {
                return this.heaps[i].items.pop();
            }
        }
    }
}

export { MultiHeap };