import { Entity } from "src/database-adapter/database-entity";


export class Title extends Entity {
    constructor(public name: string) {
        super(name);
    }

    addV(): DatabaseStatement {
        return {
            stmt: "g.V().hasLabel(label).has('name', name).fold().coalesce(unfold(), g.addV(label).property('yaroam', name).property('name', name))",
            params: {
                label: "Title",
                name: this.name
            }
        }
    }
}
