
export abstract class Entity {
    constructor(private readonly id: string) { }

    public getId() {
        return this.id;
    }

    abstract addV(): DatabaseStatement;

    public addEdgeTo(target: Entity, relationShip: string): DatabaseStatement {
        return {
            stmt: "g.V(source).addE(relationship).to(g.V(target))",
            params: {
                source: this.id,
                relationship: relationShip,
                target: target.getId()
            }
        }
    }
}
