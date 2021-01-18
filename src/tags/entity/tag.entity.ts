import { Entity } from "src/database-adapter/database-entity"

export class Tag extends Entity {
    constructor(public name: string) {
        super(name);
    }

    addV(): DatabaseStatement {
        return {
            stmt: "g.addV(label).property('yaroam', name).property('name', name)",
            params: {
                label: 'Tag',
                name: this.name
            }
        }
    }
}
